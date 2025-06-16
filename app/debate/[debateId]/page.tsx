"use client";

import { Header } from "@/domains/common/Header";
import { DebateDetailContainer } from "@/domains/container/debate/DebateDetailContainer";

export default function DebateDetailPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="토론 주제" />
      <DebateDetailContainer />
    </div>
  );
}
