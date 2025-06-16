"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { DebateItem } from "../presentational/debate/DebateItem";
import { type DebateItem as DebateItemType } from "../presentational/debate/types";

// 모킹 데이터
const mockDebates: DebateItemType[] = Array.from(
  { length: 100 },
  (_, index) => ({
    id: index + 1,
    author: {
      name: `작성자 ${index + 1}`,
      profileImage: `https://picsum.photos/seed/${index}/40/40`,
    },
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
    title: `토론 주제 ${index + 1}: 이것은 매우 흥미로운 토론 주제입니다.`,
    thumbnail: `https://picsum.photos/seed/${index + 100}/300/200`,
    commentCount: Math.floor(Math.random() * 100),
  })
);

export default function DebatListContainer() {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: mockDebates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 430,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto bg-gray-50 px-4 py-5 md:px-8"
    >
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const debate = mockDebates[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <DebateItem debate={debate} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
