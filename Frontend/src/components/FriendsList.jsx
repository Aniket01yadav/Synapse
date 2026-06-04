const FriendsList = ({
  friends = [],
  removingFriend,
  onRemoveFriend,
}) => {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-[#111111] p-6 lg:col-span-3">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          My Friends
        </h2>

        <span className="rounded-full bg-[#8B5CF6]/20 px-3 py-1 text-sm font-medium text-[#C4B5FD]">
          {friends.length}
        </span>
      </div>

      {friends.length === 0 ? (
        <p className="rounded-xl bg-[#18181B] p-4 text-zinc-500">
          You have not added any friends yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between gap-4 rounded-xl bg-[#18181B] p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] font-bold text-white">
                  {friend.username?.[0]?.toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    {friend.username}
                  </h3>

                  <p className="text-sm text-zinc-400">
                    Age: {friend.age}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onRemoveFriend(
                    friend._id,
                    friend.username
                  )
                }
                disabled={removingFriend === friend._id}
                className="shrink-0 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removingFriend === friend._id
                  ? "Removing..."
                  : "Unlink"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
