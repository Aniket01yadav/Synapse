import User from "../models/User.js";
import calculatePopularity from "../helpers/calculatePopularity.js";

export const updatePopularityScore =
  async (userId) => {
    const user =
      await User.findById(userId)
        .populate(
          "friends",
          "hobbies"
        );

    if (!user) {
      throw new Error("User not found");
    }

    const score =
      calculatePopularity(user);

    await User.findByIdAndUpdate(
      userId,
      {
        popularityScore: score,
      }
    );

    return score;
  };
