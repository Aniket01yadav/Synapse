import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../helpers/generateToken.js";

export const register = async (data) => {
  const { username, email, password, age } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    age,
  });

  const token = generateToken(user._id);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return {
    success: true,
    token,
    user: userWithoutPassword,
  };
};

export const login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Account does not exist");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return {
    success: true,
    token,
    user: userWithoutPassword,
  };
};

export const getMe = async (userId) => {
  return await User.findById(userId).select("-password");
};