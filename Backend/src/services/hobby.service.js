import User from "../models/User.js";
import Hobby from "../models/Hobby.js";
import { updatePopularityScore } from "./popularity.service.js";

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeHobby = (value) => value?.trim();

const getHobbyParts = (value) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) || [];

export const addHobby = async (
  userId,
  data
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const hobbies = getHobbyParts(data.hobby);

  if (hobbies.length === 0) {
    throw new Error("Hobby is required");
  }

  for (const hobby of hobbies) {
    const alreadyExists =
      user.hobbies.some(
        (item) =>
          item.toLowerCase() ===
          hobby.toLowerCase()
      );

    if (!alreadyExists) {
      user.hobbies.push(hobby);
    }

    await Hobby.findOneAndUpdate(
      {
        name: {
          $regex: `^${escapeRegExp(hobby)}$`,
          $options: "i",
        },
      },
      {
        $setOnInsert: {
          name: hobby,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );
  }

  await user.save();

  await updatePopularityScore(userId);

  return await User.findById(userId);
};

export const removeHobby = async (
  userId,
  data
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const hobby = normalizeHobby(data.hobby);

  user.hobbies = user.hobbies.filter(
    (item) =>
      item.toLowerCase() !==
      hobby.toLowerCase()
  );

  await user.save();

  await updatePopularityScore(userId);

  return await User.findById(userId);
};

export const getAllHobbies =
  async () => {
    const hobbies = await Hobby.find().sort({
      name: 1,
    });

    const seen = new Set();

    return hobbies
      .flatMap((hobby) =>
        getHobbyParts(hobby.name).map((name) => ({
          _id: hobby._id,
          name,
        }))
      )
      .filter((hobby) => {
        const key = hobby.name.toLowerCase();

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };
