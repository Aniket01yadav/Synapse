import calculateRecommendationScore
from "../src/helpers/calculateRecommendationScore.js";

describe(
  "Recommendation Engine",
  () => {
    test(
      "Should generate score",
      () => {
        const currentUser = {
          hobbies: ["Coding"],
          friends: [
            {
              _id: "1",
            },
          ],
        };

        const targetUser = {
          hobbies: ["Coding"],
          friends: ["1"],
          popularityScore: 5,
        };

        const score =
          calculateRecommendationScore(
            currentUser,
            targetUser
          );

        expect(score).toBe(13);
      }
    );
  }
);