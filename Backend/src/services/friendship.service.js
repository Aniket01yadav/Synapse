import User from "../models/User.js";
import {
  updatePopularityScore,
} from "./popularity.service.js";

export const linkUsers = async (
  userId,
  friendId
) => {
  if (userId === friendId) {
    throw new Error(
      "Cannot connect user to self"
    );
  }

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new Error("User not found");
  }

  const alreadyFriend =
    user.friends.some(
      (id) => id.toString() === friendId
    );

  if (alreadyFriend) {
    throw new Error(
      "Relationship already exists"
    );
  }

  user.friends.push(friendId);
  friend.friends.push(userId);

  await user.save();
  await friend.save();

  await updatePopularityScore(userId);
  await updatePopularityScore(friendId);

  return {
    success: true,
    message: "Users linked successfully",
  };
};

export const unlinkUsers = async (
  userId,
  friendId
) => {
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new Error("User not found");
  }

  user.friends =
    user.friends.filter(
      (id) => id.toString() !== friendId
    );

  friend.friends =
    friend.friends.filter(
      (id) => id.toString() !== userId
    );

  await user.save();
  await friend.save();

  await updatePopularityScore(userId);
  await updatePopularityScore(friendId);

  return {
    success: true,
    message: "Users unlinked successfully",
  };
};
