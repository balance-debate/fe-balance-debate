"use client";

import { Suspense } from "react";
import { Header } from "@/domains/common/Header";
import { DebateDetailContainer } from "@/domains/container/debate/DebateDetailContainer";
import { useSearchParams } from "next/navigation";

function DebateDetailPageInner() {
  const param = useSearchParams();
  const debateId = param.get("debateId");

  if (!debateId) {
    return (
      <div className="flex h-screen flex-col">
        <Header title="토론 주제" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">
              잘못된 접근입니다. debateId가 필요합니다.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header title="토론 주제" />
      <DebateDetailContainer debateId={debateId} />
    </div>
  );
}

export default function DebateDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen flex-col">
          <Header title="토론 주제" />
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          </div>
        </div>
      }
    >
      <DebateDetailPageInner />
    </Suspense>
  );
}
