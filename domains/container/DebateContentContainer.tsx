"use client";

import { DebateContent } from "../presentational/debate/DebateContent";

// 임시 데이터 (나중에 API로 대체)
const mockDebate = {
  id: 1,
  title:
    "이것은 매우 흥미로운 토론 주제입니다. 이 주제에 대해 여러분의 의견을 들려주세요.",
  thumbnail: "https://picsum.photos/seed/100/800/400",
};

export function DebateContentContainer() {
  const handleSelectSide = (side: "left" | "right") => {
    // TODO: 선택한 의견 처리 로직 구현
    console.log(`Selected side: ${side}`);
  };

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <DebateContent
        title={mockDebate.title}
        thumbnail={mockDebate.thumbnail}
        onSelectSide={handleSelectSide}
      />
    </main>
  );
}
