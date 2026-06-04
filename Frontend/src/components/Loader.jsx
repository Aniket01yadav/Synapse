const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#8B5CF6] border-t-transparent"></div>

        <p className="text-sm text-zinc-400">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;