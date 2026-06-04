import User from "../models/User.js";

const calculateHobbyScore = (
  currentUser,
  hobby,
  allUsers
) => {
  let score = 0;
  const signals = [];

  const friendsWithHobby =
    currentUser.friends.filter(
      (friendId) => {
        const friend = allUsers.find(
          (u) =>
            u._id.toString() ===
            friendId.toString()
        );
        return (
          friend &&
          friend.hobbies.includes(hobby)
        );
      }
    ).length;

  score += friendsWithHobby * 4;
  if (friendsWithHobby > 0) {
    signals.push("friendsWithHobby");
  }

  const usersWithHobby = allUsers.filter(
    (u) => u.hobbies.includes(hobby)
  ).length;
  score += usersWithHobby * 0.5;
  if (usersWithHobby > 0) {
    signals.push("hobbyPopularity");
  }

  if (currentUser.hobbies.includes(hobby)) {
    score = 0;
  }

  return { score, signals };
};

export const getRecommendations = async (
  userId
) => {
  const currentUser = await User.findById(
    userId
  ).populate("friends");

  if (!currentUser) {
    throw new Error("User not found");
  }

  const allUsers = await User.find();

  const nonFriends = allUsers.filter(
    (user) =>
      user._id.toString() !== userId &&
      !currentUser.friends.some(
        (friend) =>
          friend._id.toString() ===
          user._id.toString()
      )
  );

  const friendRecommendations = nonFriends
    .map((user) => {
      const mutualFriends = user.friends.filter(
        (friendId) =>
          currentUser.friends.some(
            (friend) =>
              friend._id.toString() ===
              friendId.toString()
          )
      ).length;

      const sharedHobbies = currentUser.hobbies.filter(
        (hobby) =>
          user.hobbies.includes(hobby)
      ).length;

      const popularity =
        user.popularityScore || 0;

      const score =
        mutualFriends * 5 +
        sharedHobbies * 3 +
        popularity;

      const sourceSignals = [];
      if (mutualFriends > 0)
        sourceSignals.push("mutualFriends");
      if (sharedHobbies > 0)
        sourceSignals.push("sharedHobbies");
      if (popularity > 0)
        sourceSignals.push("popularity");

      let reason = [];
      if (mutualFriends > 0)
        reason.push(
          `${mutualFriends} mutual friends`
        );
      if (sharedHobbies > 0)
        reason.push(
          `${sharedHobbies} shared hobbies`
        );

      return {
        userId: user._id,
        username: user.username,
        age: user.age,
        score: Number(score.toFixed(2)),
        reason:
          reason.length > 0
            ? reason.join(", ")
            : "Similar interests",
        sourceSignals,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const allHobbies = new Set();
  allUsers.forEach((user) => {
    user.hobbies.forEach((hobby) => {
      allHobbies.add(hobby);
    });
  });

  const hobbyRecommendations = Array.from(
    allHobbies
  )
    .map((hobby) => {
      const { score, signals } =
        calculateHobbyScore(
          currentUser,
          hobby,
          allUsers
        );

      const friendsWithHobby = currentUser.friends.filter(
        (friendId) => {
          const friend = allUsers.find(
            (u) =>
              u._id.toString() ===
              friendId.toString()
          );
          return (
            friend &&
            friend.hobbies.includes(hobby)
          );
        }
      ).length;

      let reason = [];
      if (friendsWithHobby > 0)
        reason.push(
          `${friendsWithHobby} friends enjoy this`
        );

      return {
        hobby,
        score: Number(score.toFixed(2)),
        reason:
          reason.length > 0
            ? reason.join(", ")
            : "Popular interest",
        sourceSignals: signals,
      };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    friends: friendRecommendations,
    hobbies: hobbyRecommendations,
  };
};
