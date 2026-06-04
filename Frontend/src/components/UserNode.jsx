import { Handle, Position } from "reactflow";

const UserNode = ({
  data,
}) => {
  const popularityScore =
    data.popularityScore || 0;
  const friendCount =
    data.friendCount || 0;
  const popularityTier =
    data.popularityTier || "middle";
  const hobbies = data.hobbies || [];

  const sizeClass =
    popularityTier === "high"
      ? "min-w-[300px] p-6"
      : popularityTier === "middle"
      ? "min-w-[260px] p-5"
      : "min-w-[220px] p-4";

  const colorClass =
    popularityTier === "high"
      ? "border-[#F59E0B] bg-[#1A1206] shadow-[#F59E0B]/20"
      : popularityTier === "middle"
      ? "border-[#8B5CF6] bg-[#171226] shadow-[#8B5CF6]/20"
      : "border-[#3B82F6] bg-[#0F172A] shadow-[#3B82F6]/10";

  const titleClass =
    popularityTier === "high"
      ? "text-2xl"
      : popularityTier === "middle"
      ? "text-xl"
      : "text-lg";

  return (
    <div
      className={`rounded-2xl border shadow-lg transition-all ${sizeClass} ${colorClass}`}
    >
      <Handle
        type="target"
        position={
          Position.Top
        }
      />

      <div className="space-y-2">
        <h3 className={`${titleClass} font-bold text-white`}>
          {data.username}
        </h3>

        <p className="text-zinc-400">
          Age: {data.age}
        </p>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-lg bg-black/30 px-3 py-1 text-sm text-white">
            Popularity: {popularityScore}
          </div>

          <div className="inline-flex rounded-lg bg-black/30 px-3 py-1 text-sm text-white">
            Friends: {friendCount}
          </div>
        </div>

        {hobbies.length > 0 && (
          <div className="flex max-w-[260px] flex-wrap gap-2 pt-2">
            {hobbies.map((hobby) => (
              <span
                key={hobby}
                className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-xs text-zinc-200"
              >
                <span className="max-w-[120px] truncate">
                  {hobby}
                </span>

              </span>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={
          Position.Bottom
        }
      />
    </div>
  );
};

export default UserNode;
