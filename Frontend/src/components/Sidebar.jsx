import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const Sidebar = ({
  friendHobbies = [],
}) => {
  const [search, setSearch] =
    useState("");

  const [hobbies, setHobbies] =
    useState([]);
  const [hiddenHobbies, setHiddenHobbies] =
    useState([]);

  const fetchHobbies =
    useCallback(async () => {
      try {
        const response =
          await api.get(
            "/hobbies"
          );

        setHobbies(response.data || []);
      } catch (error) {
        console.log(error);
      }
    }, []);

  useEffect(() => {
    fetchHobbies();
  }, [fetchHobbies]);

  const onDragStart = (
    event,
    hobby
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      hobby.name
    );

    event.dataTransfer.effectAllowed =
      "move";
  };

  const cleanedHobbies = useMemo(() => {
    const seen = new Set();

    const hobbyMap = new Map();

    hobbies
      .flatMap((hobby) =>
        hobby.name
          .split(",")
          .map((name) => ({
            name: name.trim(),
            friends: [],
          }))
          .filter((item) => item.name)
      )
      .forEach((hobby) => {
        const key = hobby.name.toLowerCase();

        if (!hobbyMap.has(key)) {
          hobbyMap.set(key, hobby);
        }
      });

    friendHobbies
      .flatMap((hobby) =>
        hobby.name
          .split(",")
          .map((name) => ({
            name: name.trim(),
            friendName: hobby.friendName,
          }))
          .filter((item) => item.name)
      )
      .forEach((hobby) => {
        const key = hobby.name.toLowerCase();
        const existing =
          hobbyMap.get(key) || {
            name: hobby.name,
            friends: [],
          };

        if (
          hobby.friendName &&
          !existing.friends.includes(hobby.friendName)
        ) {
          existing.friends.push(hobby.friendName);
        }

        hobbyMap.set(key, existing);
      });

    return Array.from(hobbyMap.values())
      .filter((hobby) => {
        const key = hobby.name.toLowerCase();

        if (
          seen.has(key) ||
          hiddenHobbies.includes(key)
        ) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [friendHobbies, hiddenHobbies, hobbies]);

  const filteredHobbies =
    cleanedHobbies.filter((hobby) => {
      const query = search.toLowerCase();

      return (
        hobby.name.toLowerCase().includes(query) ||
        hobby.friends.some((friend) =>
          friend.toLowerCase().includes(query)
        )
      );
    });

  return (
    <aside className="order-2 w-full border-b border-zinc-800 bg-[#111111] p-4 lg:order-none lg:h-full lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">
          Hobbies
        </h2>

        <span className="rounded-full bg-[#18181B] px-3 py-1 text-xs font-medium text-zinc-400">
          {filteredHobbies.length}
        </span>
      </div>

      <input
        type="text"
        placeholder="Search hobby..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="mb-4 w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white"
      />

      <div className="grid max-h-72 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:max-h-none lg:grid-cols-1 lg:space-y-0 lg:overflow-visible lg:pr-0">
        {filteredHobbies.map(
          (hobby) => (
            <div
              key={hobby.name.toLowerCase()}
              draggable
              onDragStart={(e) =>
                onDragStart(
                  e,
                  hobby
                )
              }
              className="flex cursor-move items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-[#18181B] p-3 text-white transition hover:border-[#8B5CF6]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {hobby.name}
                </p>

                {hobby.friends.length > 0 && (
                  <p className="mt-1 truncate text-xs text-zinc-400">
                    {hobby.friends.join(", ")}
                  </p>
                )}
              </div>

              <button
                type="button"
                aria-label={`Remove ${hobby.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setHiddenHobbies((current) => [
                    ...current,
                    hobby.name.toLowerCase(),
                  ]);
                }}
                onDragStart={(event) => event.preventDefault()}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-red-500/60 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
              >
                x
              </button>
            </div>
          )
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
