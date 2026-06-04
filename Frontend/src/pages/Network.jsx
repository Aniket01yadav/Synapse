import { useEffect, useCallback, useState } from "react";
import React from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";

import "reactflow/dist/style.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserNode from "../components/UserNode";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

import api from "../services/api";

const nodeTypes = {
  userNode: UserNode,
};

const getPopularityTier = (
  popularityScore,
  scores
) => {
  if (scores.length <= 1) {
    return "middle";
  }

  const scoreIndex =
    scores.indexOf(popularityScore);

  const ratio =
    scoreIndex / (scores.length - 1);

  if (ratio >= 0.67) {
    return "high";
  }

  if (ratio >= 0.34) {
    return "middle";
  }

  return "low";
};

const Network = () => {
  const { user, getCurrentUser } = useAuth();
  const currentUserId = user?._id;
  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState([]);

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState([]);

  const [loading, setLoading] =
    React.useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [friendHobbies, setFriendHobbies] = useState([]);

  const fetchGraph = useCallback(async () => {
    try {
      const [graphResponse, profileResponse, usersResponse] =
        await Promise.all([
          api.get("/graph"),
          api.get(`/users/${currentUserId}`),
          api.get("/users"),
        ]);

      const response = graphResponse;
      const allUsers = usersResponse.data || [];
      const profileFriends = profileResponse.data?.friends || [];
      const profileFriendIds = profileFriends.map((friend) =>
        typeof friend === "string" ? friend : friend._id
      );
      const edgeFriendIds = response.data.edges
        .filter(
          (edge) =>
            edge.source === currentUserId ||
            edge.target === currentUserId
        )
        .map((edge) =>
          edge.source === currentUserId
            ? edge.target
            : edge.source
        );
      const friendIds = new Set([
        ...profileFriendIds,
        ...edgeFriendIds,
      ]);

      setFriendHobbies(
        allUsers
          .filter((friend) => friendIds.has(friend._id))
          .flatMap((friend) =>
            (friend.hobbies || []).map((hobby) => ({
              name: hobby,
              friendName: friend.username,
            }))
          )
      );

      const friendCounts = new Map();

      response.data.edges.forEach((edge) => {
        friendCounts.set(
          edge.source,
          (friendCounts.get(edge.source) || 0) + 1
        );

        friendCounts.set(
          edge.target,
          (friendCounts.get(edge.target) || 0) + 1
        );
      });

      const filteredEdges = response.data.edges.filter(
        (edge) =>
          edge.source === currentUserId ||
          edge.target === currentUserId
      );

      const visibleNodeIds = new Set([currentUserId]);

      filteredEdges.forEach((edge) => {
        visibleNodeIds.add(edge.source);
        visibleNodeIds.add(edge.target);
      });

      const filteredNodes = response.data.nodes.filter(
        (node) => visibleNodeIds.has(node.id)
      );

      const popularityScores = [
        ...new Set(
          filteredNodes
            .map(
              (node) =>
                node.data?.popularityScore || 0
            )
            .sort((a, b) => a - b)
        ),
      ];

      const graphNodes = filteredNodes.map(
        (node) => {
          const popularityScore =
            node.data?.popularityScore || 0;
          const backendFriendCount =
            node.data?.friendCount || 0;
          const edgeFriendCount =
            friendCounts.get(node.id) || 0;

          return {
            ...node,
            data: {
              ...node.data,
              id: node.id,
              hobbies: node.data?.hobbies || [],
              isCurrentUser: node.id === currentUserId,
              friendCount: Math.max(
                backendFriendCount,
                edgeFriendCount
              ),
              popularityTier: getPopularityTier(
                popularityScore,
                popularityScores
              ),
            },
            type: "userNode",
            draggable: true,
          };
        }
      );

      setNodes(graphNodes);
      setEdges(filteredEdges);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load graph");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [
    currentUserId,
    setEdges,
    setNodes,
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGraph();
  };

  useEffect(() => {
    if (currentUserId) {
      fetchGraph();
    }
  }, [currentUserId, fetchGraph]);

  const onConnect = useCallback(
    async (params) => {
      try {
        await api.post(
          `/users/${params.source}/link`,
          {
            friendId:
              params.target,
          }
        );

        toast.success("Friendship created");
        await fetchGraph();
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
          "Failed to create friendship"
        );
      }
    },
    [fetchGraph]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();

      const hobby = event.dataTransfer.getData(
        "application/reactflow"
      );

      if (!hobby) return;

      if (reactFlowInstance) {
        const position =
          reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });

        const nodeAtPosition = nodes.find(
          (node) =>
            node.position.x < position.x &&
            node.position.x + 220 > position.x &&
            node.position.y < position.y &&
            node.position.y + 150 > position.y
        );

        if (nodeAtPosition) {
          if (nodeAtPosition.id !== currentUserId) {
            toast.error("You can only add hobbies to your own profile");
            return;
          }

          try {
            await api.post(
              `/hobbies/${nodeAtPosition.id}`,
              { hobby }
            );

            toast.success(`${hobby} added to your profile`);

            await getCurrentUser();

            await fetchGraph();
          } catch (error) {
            toast.error(
              error?.response?.data?.message ||
              "Failed to add hobby"
            );
          }
        }
      }
    },
    [
      currentUserId,
      fetchGraph,
      getCurrentUser,
      nodes,
      reactFlowInstance,
    ]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-screen bg-[#0A0A0A]">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          friendHobbies={friendHobbies}
        />

        <div className="flex flex-col flex-1">
          <div className="border-b border-zinc-800 bg-[#111111] p-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Network Graph
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-lg bg-[#8B5CF6] px-4 py-2 text-white transition hover:bg-[#A855F7] disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div
            className="flex-1"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={
              onNodesChange
            }
            onEdgesChange={
              onEdgesChange
            }
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            fitView
            minZoom={0.3}
            maxZoom={2}
          >
            <Background />
            <Controls />
          </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
