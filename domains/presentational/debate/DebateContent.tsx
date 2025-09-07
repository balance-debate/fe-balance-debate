interface DebateContentProps {
  title: string;
  thumbnail: string;
  onSelectSide: (side: "left" | "right") => void;
}

export function DebateContent({
  title,
  thumbnail,
  onSelectSide,
}: DebateContentProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{title}</h1>
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <img
            src={thumbnail}
            alt={title}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <button
            onClick={() => onSelectSide("left")}
            className="flex-1 rounded-lg bg-blue-500 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
          >
            찬성
          </button>
          <button
            onClick={() => onSelectSide("right")}
            className="flex-1 rounded-lg bg-red-500 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-red-600"
          >
            반대
          </button>
        </div>
      </div>
    </div>
  );
}
