import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar";
import FriendsList from "../components/FriendsList";
import Loader from "../components/Loader";

import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const suggestedHobbies = [
  "Coding",
  "Gaming",
  "Reading",
  "Cricket",
  "Music",
  "Cooking",
  "Traveling",
  "Photography",
];

const Profile = () => {
  const { user, getCurrentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hobby, setHobby] = useState("");
  const [hobbyLoading, setHobbyLoading] = useState(false);
  const [removingFriend, setRemovingFriend] = useState(null);
  const [friendToRemove, setFriendToRemove] = useState(null);

  const visibleSuggestedHobbies = suggestedHobbies.filter(
    (item) =>
      !profile?.hobbies?.some(
        (hobbyName) => hobbyName.toLowerCase() === item.toLowerCase()
      )
  );

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get(`/users/${user._id}`);

      setProfile(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    }
  }, [fetchProfile, user?._id]);

  const parseHobbies = (value) => {
    const seen = new Set();

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => {
        const key = item.toLowerCase();

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
  };

  const addHobby = async (value = hobby) => {
    const hobbiesToAdd = parseHobbies(value);

    if (hobbiesToAdd.length === 0) return;

    try {
      setHobbyLoading(true);

      for (const hobbyName of hobbiesToAdd) {
        await api.post(`/hobbies/${profile._id}`, {
          hobby: hobbyName,
        });
      }

      toast.success(
        hobbiesToAdd.length === 1 ? "Hobby added" : "Hobbies added"
      );

      setHobby("");

      await fetchProfile();
      await getCurrentUser();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add hobby"
      );
    } finally {
      setHobbyLoading(false);
    }
  };

  const handleHobbyKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addHobby();
    }
  };

  const removeHobby = async (hobbyName) => {
    try {
      await api.delete(`/hobbies/${profile._id}`, {
        data: {
          hobby: hobbyName,
        },
      });

      toast.success("Hobby removed");

      await fetchProfile();
      await getCurrentUser();
    } catch {
      toast.error("Failed to remove hobby");
    }
  };

  const removeFriend = async () => {
    if (!friendToRemove) return;

    try {
      setRemovingFriend(friendToRemove._id);

      await api.delete(`/users/${profile._id}/unlink`, {
        data: {
          friendId: friendToRemove._id,
        },
      });

      toast.success("Friend removed");
      setFriendToRemove(null);

      await fetchProfile();
      await getCurrentUser();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove friend"
      );
    } finally {
      setRemovingFriend(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 lg:pb-0">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] text-3xl font-bold text-white">
                {profile?.username?.[0]?.toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-2xl font-bold text-white">
                  {profile?.username}
                </h2>

                <p className="break-words text-zinc-400">{profile?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-[#18181B] p-4">
                <p className="text-zinc-400">Age</p>

                <h3 className="text-xl font-bold text-white">
                  {profile?.age}
                </h3>
              </div>

              <div className="rounded-xl bg-[#18181B] p-4">
                <p className="text-zinc-400">Popularity Score</p>

                <h3 className="text-xl font-bold text-[#F59E0B]">
                  {profile?.popularityScore}
                </h3>
              </div>

              <div className="rounded-xl bg-[#18181B] p-4">
                <p className="text-zinc-400">Friends</p>

                <h3 className="text-xl font-bold text-white">
                  {profile?.friends?.length || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#111111] p-6 lg:col-span-2">
            <h2 className="mb-6 text-xl font-bold text-white">Hobbies</h2>

            <div className="mb-6 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={hobby}
                onKeyDown={handleHobbyKeyDown}
                onChange={(e) => setHobby(e.target.value)}
                placeholder="Add hobby... e.g. coding, gaming"
                className="flex-1 rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-[#8B5CF6]"
              />

              <button
                onClick={() => addHobby()}
                disabled={hobbyLoading}
                className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] px-5 py-3 text-white sm:py-0"
              >
                {hobbyLoading ? "..." : "Add"}
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-zinc-400">
                Suggested hobbies
              </p>

              {visibleSuggestedHobbies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visibleSuggestedHobbies.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => addHobby(item)}
                      disabled={hobbyLoading}
                      className="rounded-full border border-[#8B5CF6]/50 px-3 py-1 text-sm text-[#C4B5FD] transition hover:bg-[#8B5CF6]/20 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-600"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  All suggested hobbies added
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {profile?.hobbies?.length > 0 ? (
                profile.hobbies.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-full bg-[#8B5CF6]/20 px-4 py-2"
                  >
                    <span className="text-sm text-[#C4B5FD]">{item}</span>

                    <button
                      onClick={() => removeHobby(item)}
                      className="text-red-400 hover:text-red-300"
                    >
                      x
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500">No hobbies added yet</p>
              )}
            </div>
          </div>

          <FriendsList
            friends={profile?.friends || []}
            removingFriend={removingFriend}
            onRemoveFriend={(friendId, friendName) =>
              setFriendToRemove({
                _id: friendId,
                username: friendName,
              })
            }
          />
        </div>
      </div>

      {friendToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#111111] p-6 shadow-2xl shadow-black/40">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-xl font-bold text-red-300">
                !
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Unlink friend?
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  This will remove{" "}
                  <span className="font-medium text-zinc-200">
                    {friendToRemove.username || "this friend"}
                  </span>{" "}
                  from your friends list.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFriendToRemove(null)}
                disabled={removingFriend === friendToRemove._id}
                className="rounded-xl border border-zinc-700 px-5 py-2.5 font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={removeFriend}
                disabled={removingFriend === friendToRemove._id}
                className="rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {removingFriend === friendToRemove._id
                  ? "Unlinking..."
                  : "Unlink"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
