const calculatePopularity = (user) => {
  const friendCount =
    user.friends?.length || 0;

  let sharedHobbies = 0;

  user.friends?.forEach((friend) => {
    const common =
      user.hobbies.filter((hobby) =>
        friend.hobbies.includes(hobby)
      );

    sharedHobbies += common.length;
  });

  return (
    friendCount +
    sharedHobbies * 0.5
  );
};

export default calculatePopularity;