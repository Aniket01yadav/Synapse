import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const getId = (value) =>
  typeof value === "string" ? value : value?._id;

const normalize = (value) => value?.toLowerCase();

const getSharedHobbies = (currentUser, targetUser) => {
  const currentHobbies = new Set(
    (currentUser?.hobbies || []).map((hobby) => normalize(hobby))
  );

  return (targetUser?.hobbies || []).filter((hobby) =>
    currentHobbies.has(normalize(hobby))
  );
};

const getMutualFriends = (currentUser, targetUser, users) => {
  const currentFriendIds = new Set(
    (currentUser?.friends || []).map(getId).filter(Boolean)
  );

  return (targetUser?.friends || [])
    .map(getId)
    .filter((friendId) => currentFriendIds.has(friendId))
    .map((friendId) => users.find((item) => item._id === friendId))
    .filter(Boolean);
};

const getMutualFriendCountText = (friends) =>
  `${friends.length} mutual friend${friends.length === 1 ? "" : "s"}`;

const Recommendations = () => {
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingFriend, setAddingFriend] = useState(null);
  const [openMutualFriends, setOpenMutualFriends] = useState({});

  const currentFriendIds = useMemo(
    () => new Set((user?.friends || []).map(getId).filter(Boolean)),
    [user?.friends]
  );

  const buildCandidate = useCallback(
    (targetUser, users) => {
      const sharedHobbies = getSharedHobbies(user, targetUser);
      const mutualFriends = getMutualFriends(user, targetUser, users);

      return {
        ...targetUser,
        sharedHobbies,
        mutualFriends,
        reasonScore:
          sharedHobbies.length * 3 +
          mutualFriends.length * 5 +
          (targetUser.popularityScore || 0),
      };
    },
    [user]
  );

  const fetchRecommendations = useCallback(async () => {
    try {
      const usersResponse = await api.get("/users");
      const allUsersList = usersResponse.data || [];

      const filteredUsers = allUsersList.filter((item) => {
        const itemId = getId(item);

        return itemId !== user?._id && !currentFriendIds.has(itemId);
      });

      const searchableUsers = allUsersList
        .filter((item) => getId(item) !== user?._id)
        .map((item) => buildCandidate(item, allUsersList));

      const enrichedUsers = filteredUsers.map((item) =>
        buildCandidate(item, allUsersList)
      );

      const suggestedUsers = enrichedUsers
        .filter(
          (item) =>
            item.sharedHobbies.length > 0 ||
            item.mutualFriends.length > 0
        )
        .sort((a, b) => b.reasonScore - a.reasonScore)
        .slice(0, 6);

      setAllUsers(searchableUsers);
      setRecommendations(suggestedUsers);
      setSearchResults([]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, [buildCandidate, currentFriendIds, user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchRecommendations();
    }
  }, [fetchRecommendations, user?._id]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = allUsers.filter((item) =>
      [item.username, item._id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(lowerQuery))
    );

    setSearchResults(results);
  };

  const addFriend = async (friendId, isSearchResult = false) => {
    try {
      setAddingFriend(friendId);

      await api.post(`/users/${user._id}/link`, {
        friendId,
      });

      const updatedUser = {
        ...user,
        friends: [...(user?.friends || []), friendId],
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Friend added successfully");

      if (isSearchResult) {
        setSearchQuery("");
        setSearchResults([]);
      }

      await fetchRecommendations();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add friend"
      );
    } finally {
      setAddingFriend(null);
    }
  };

  if (loading) return <Loader />;

  const renderReasonRows = (item) => (
    <div className="mt-5 grid gap-3">
      {item.sharedHobbies.length > 0 && (
        <div className="rounded-xl border border-[#8B5CF6]/25 bg-[#8B5CF6]/10 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#C4B5FD]">
            Shared hobby
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {item.sharedHobbies.map((hobby) => (
              <span
                key={hobby}
                className="rounded-full bg-[#8B5CF6]/25 px-3 py-1 text-xs font-medium text-[#DDD6FE]"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
      )}

      {item.mutualFriends.length > 0 && (
        <div className="rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 p-3">
          <button
            type="button"
            onClick={() =>
              setOpenMutualFriends((current) => ({
                ...current,
                [item._id]: !current[item._id],
              }))
            }
            className="text-xs font-bold text-zinc-300 transition hover:text-[#FCD34D]"
          >
            {getMutualFriendCountText(item.mutualFriends)}
          </button>

          {openMutualFriends[item._id] && (
            <p className="mt-2 text-xs font-medium text-zinc-400">
              {item.mutualFriends
                .map((friend) => friend.username)
                .join(", ")}
            </p>
          )}
        </div>
      )}

      {item.sharedHobbies.length === 0 &&
        item.mutualFriends.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-[#18181B] p-3">
            <p className="text-sm text-zinc-400">
              No shared hobbies or mutual friends found yet.
            </p>
          </div>
        )}
    </div>
  );

  const renderUserCard = (item, isSearchResult = false) => {
    const isFriend = currentFriendIds.has(item._id);

    return (
    <div
      key={item._id}
      className="group flex min-h-[310px] flex-col justify-between rounded-2xl border border-zinc-800 bg-[#111111] p-5 transition hover:-translate-y-1 hover:border-[#8B5CF6] hover:shadow-2xl hover:shadow-[#8B5CF6]/10"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] font-bold text-white">
              {item.username?.charAt(0)?.toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-white">
                {item.username}
              </h2>
              <p className="text-sm text-zinc-400">Age: {item.age}</p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#18181B] px-3 py-2 text-right">
            <p className="text-[11px] text-zinc-500">Score</p>
            <p className="text-sm font-bold text-[#F59E0B]">
              {(item.popularityScore || 0).toFixed(1)}
            </p>
          </div>
        </div>

        {renderReasonRows(item)}
      </div>

      <button
        type="button"
        onClick={() => addFriend(item._id, isSearchResult)}
        disabled={isFriend || addingFriend === item._id}
        className="mt-5 w-full rounded-xl bg-linear-to-r from-[#8B5CF6] to-[#A855F7] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-none disabled:bg-zinc-800 disabled:text-zinc-400"
      >
        {isFriend
          ? "Already Friend"
          : addingFriend === item._id
          ? "Adding..."
          : "Add Friend"}
      </button>
    </div>
    );
  };

  const visibleList = searchResults.length > 0 ? searchResults : recommendations;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-[#111111] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Friend Recommendations
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              People are ranked by shared hobbies, mutual friends, and popularity.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Search users by username or id"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-[#111111] px-5 py-3 text-white placeholder-zinc-500 transition focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {searchQuery ? "Search Results" : "Best Matches"}
          </h2>

          <span className="rounded-full bg-[#18181B] px-3 py-1 text-sm text-zinc-400">
            {visibleList.length} users
          </span>
        </div>

        {visibleList.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-12 text-center">
            <p className="text-zinc-400">
              {searchQuery
                ? "No users found with that username."
                : "No recommendations available. Add hobbies or connect with more users."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleList.map((item) =>
              renderUserCard(item, searchResults.length > 0)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
