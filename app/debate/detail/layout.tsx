import type { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  const title = "오늘의 토론은?";
  const description = "당신의 선택과 의견을 마음껏 표현해보세요.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default function DebateDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
