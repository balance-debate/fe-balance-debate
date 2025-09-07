interface DebateDetailContentProps {
  title: string;
  thumbnail: string;
  choiceA: string;
  choiceB: string;
  onSelectSide: (side: "left" | "right") => void;
  selectedSide: "left" | "right" | null;
  hasVote?: boolean | null;
  isVoting?: boolean;
}

export function DebateDetailContent({
  title,
  thumbnail,
  choiceA,
  choiceB,
  onSelectSide,
  selectedSide,
  hasVote,
  isVoting = false,
}: DebateDetailContentProps) {
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
            disabled={selectedSide !== null || hasVote === true || isVoting}
            className={`flex-1 rounded-lg px-6 py-4 text-lg font-semibold text-white transition-colors ${
              selectedSide === "left"
                ? "bg-blue-600"
                : selectedSide === null && hasVote !== true && !isVoting
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400"
            }`}
          >
            {isVoting ? "투표 중..." : choiceA}
          </button>
          <button
            onClick={() => onSelectSide("right")}
            disabled={selectedSide !== null || hasVote === true || isVoting}
            className={`flex-1 rounded-lg px-6 py-4 text-lg font-semibold text-white transition-colors ${
              selectedSide === "right"
                ? "bg-red-600"
                : selectedSide === null && hasVote !== true && !isVoting
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-400"
            }`}
          >
            {isVoting ? "투표 중..." : choiceB}
          </button>
        </div>
        {hasVote === true && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">이미 투표하셨습니다.</p>
          </div>
        )}
        {isVoting && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600">투표를 처리하고 있습니다...</p>
          </div>
        )}
      </div>
    </div>
  );
}
