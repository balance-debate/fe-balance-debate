"use client";

import { use } from "react";
import { Header } from "@/domains/common/Header";
import { DebateDetailContainer } from "@/domains/container/debate/DebateDetailContainer";

interface DebateDetailPageProps {
  params: Promise<{
    debateId: string;
  }>;
}

export default function DebateDetailPage({ params }: DebateDetailPageProps) {
  const { debateId } = use(params);

  return (
    <div className="flex h-screen flex-col">
      <Header title="토론 주제" />
      <DebateDetailContainer debateId={debateId} />
    </div>
  );
}
