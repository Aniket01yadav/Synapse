import User from "../models/User.js";

export const getGraph = async () => {
  const users = await User.find();

  const connectedUsers =
    users.filter(
      (user) =>
        user.friends &&
        user.friends.length > 0
    );

  const graphUsers =
    connectedUsers.length > 0
      ? connectedUsers
      : users.slice(0, 1);

  const nodes = graphUsers.map(
    (user, index) => ({
      id: user._id.toString(),

      type: "userNode",

      data: {
        username: user.username,
        age: user.age,
        hobbies: user.hobbies || [],
        friendCount:
          user.friends?.length || 0,
        popularityScore:
          user.popularityScore || 0,
      },

      position: {
        x: (index % 4) * 350,
        y:
          Math.floor(index / 4) *
          250,
      },
    })
  );

  const nodeIds = new Set(
    graphUsers.map((user) =>
      user._id.toString()
    )
  );

  const edgeSet = new Set();

  const edges = [];

  graphUsers.forEach((user) => {
    user.friends.forEach((friend) => {
      const source =
        user._id.toString();

      const target =
        friend.toString();

      if (
        !nodeIds.has(source) ||
        !nodeIds.has(target)
      ) {
        return;
      }

      const pair = [source, target]
        .sort()
        .join("-");

      if (!edgeSet.has(pair)) {
        edgeSet.add(pair);

        edges.push({
          id: pair,
          source,
          target,
          animated: true,
        });
      }
    });
  });

  return {
    nodes,
    edges,
  };
};
