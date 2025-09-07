"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState, useEffect } from "react";
import { DebateItem } from "../presentational/debate/DebateItem";
import { type DebateFromAPI } from "../presentational/debate/types";
import { fetchDebates } from "@/lib/api";

export default function DebatListContainer() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [debates, setDebates] = useState<DebateFromAPI[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const loadMoreDebates = async () => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);
    try {
      const response = await fetchDebates(currentPage, 20);
      setDebates((prev) => [...prev, ...response.debates]);
      setHasNext(response.hasNext);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("토론 목록을 불러오는데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMoreDebates();
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: debates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500,
    overscan: 5,
  });

  // 스크롤이 끝에 가까워지면 더 많은 데이터 로드
  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;

    if (lastItem.index >= debates.length - 1 && hasNext && !isLoading) {
      loadMoreDebates();
    }
  }, [debates.length, hasNext, isLoading, rowVirtualizer.getVirtualItems()]);

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
          const debate = debates[virtualRow.index];
          if (!debate) return null;

          return (
            <div
              key={virtualRow.index}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <DebateItem debate={debate} index={virtualRow.index} />
            </div>
          );
        })}
      </div>
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      )}
    </div>
  );
}
