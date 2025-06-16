"use client";

import { useParams } from "next/navigation";

export default function DebateDetailPage() {
  const params = useParams();
  const debateId = params.debateId;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          토론 상세 페이지 (ID: {debateId})
        </h1>
        <p className="mt-4 text-gray-600">
          여기에 토론 상세 내용이 들어갈 예정입니다.
        </p>
      </div>
    </div>
  );
}
