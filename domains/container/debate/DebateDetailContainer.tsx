import { useState } from "react";
import { DebateDetailContent } from "../../presentational/debate/DebateDetailContent";
import { DebateDetailStats } from "../../presentational/debate/DebateDetailStats";

export function DebateDetailContainer() {
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(
    null
  );
  const [stats, setStats] = useState({
    left: 42,
    right: 58,
  });

  const handleSelectSide = (side: "left" | "right") => {
    setSelectedSide(side);
    setStats((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <DebateDetailContent
        title="이 주제에 대해 어떻게 생각하시나요?"
        thumbnail="https://picsum.photos/800/400"
        onSelectSide={handleSelectSide}
        selectedSide={selectedSide}
      />
      <div className="relative mt-8">
        {selectedSide === null ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-200">
            <p className="text-lg font-medium text-gray-600">
              투표 후에 결과를 확인할 수 있습니다
            </p>
          </div>
        ) : null}
        <div className={selectedSide === null ? "pointer-events-none" : ""}>
          <DebateDetailStats
            agreeCount={stats.left}
            disagreeCount={stats.right}
          />
        </div>
      </div>
    </div>
  );
}
