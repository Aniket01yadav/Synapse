import User from "../models/User.js";

export const createUser = async (data) => {
  return await User.create(data);
};

export const getUsers = async () => {
  return await User.find()
    .populate("friends", "username age");
};

export const getUserById = async (id) => {
  return await User.findById(id)
    .populate("friends", "username age hobbies");
};

export const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(
    id,
    data,
    { returnDocument: "after" }
  );
};

export const deleteUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.friends.length > 0) {
    const error = new Error(
      "Unlink friendships before deleting user"
    );

    error.statusCode = 400;
    throw error;
  }

  const linkedByAnotherUser =
    await User.exists({
      friends: id,
    });

  if (linkedByAnotherUser) {
    const error = new Error(
      "Unlink friendships before deleting user"
    );

    error.statusCode = 400;
    throw error;
  }

  await User.findByIdAndDelete(id);

  return {
    success: true,
    message: "User deleted successfully",
  };
};
