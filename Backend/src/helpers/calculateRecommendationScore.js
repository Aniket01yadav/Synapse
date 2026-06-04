const calculateRecommendationScore = (
  currentUser,
  targetUser
) => {
  const mutualFriends =
    targetUser.friends.filter(
      (friendId) =>
        currentUser.friends.some(
          (friend) =>
            friend._id.toString() ===
            friendId.toString()
        )
    ).length;

  const sharedHobbies =
    currentUser.hobbies.filter(
      (hobby) =>
        targetUser.hobbies.includes(
          hobby
        )
    ).length;

  const popularity =
    targetUser.popularityScore || 0;

  const score =
    mutualFriends * 5 +
    sharedHobbies * 3 +
    popularity;

  return Number(
    score.toFixed(2)
  );
};

export default calculateRecommendationScore;