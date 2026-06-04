import calculatePopularity from "../src/helpers/calculatePopularity.js";

describe("Popularity Score", () => {
  test(
    "Calculates popularity correctly",
    () => {
      const user = {
        hobbies: [
          "Coding",
          "Cricket",
        ],
        friends: [
          {
            hobbies: [
              "Coding",
            ],
          },
          {
            hobbies: [
              "Cricket",
            ],
          },
        ],
      };

      const score =
        calculatePopularity(user);

      expect(score).toBe(3);
    }
  );

  test(
    "should return 0 for user with no friends",
    () => {
      const user = {
        hobbies: ["Coding"],
        friends: [],
      };

      const score =
        calculatePopularity(user);

      expect(score).toBe(0);
    }
  );

  test(
    "should account for multiple shared hobbies",
    () => {
      const user = {
        hobbies: [
          "Coding",
          "Gaming",
          "Reading",
        ],
        friends: [
          {
            hobbies: [
              "Coding",
              "Gaming",
              "Reading",
            ],
          },
        ],
      };

      const score =
        calculatePopularity(user);

      expect(score).toBe(2.5);
    }
  );

  test(
    "should decrease after unlink when friend is removed",
    () => {
      const userWithFriend = {
        hobbies: [
          "Coding",
          "Cricket",
        ],
        friends: [
          {
            hobbies: [
              "Coding",
              "Cricket",
            ],
          },
        ],
      };

      const userAfterUnlink = {
        ...userWithFriend,
        friends: [],
      };

      expect(
        calculatePopularity(userWithFriend)
      ).toBe(2);

      expect(
        calculatePopularity(userAfterUnlink)
      ).toBe(0);
    }
  );
});
