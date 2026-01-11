import type { Metadata } from "next";
import { Header } from "@/domains/common/Header";
import { DebateDetailContainer } from "@/domains/container/debate/DebateDetailContainer";
import { API_BASE_URL } from "@/lib/constants";
import type { ApiResponse } from "@/lib/types/api";
import type { DebateFromAPI } from "@/domains/presentational/debate/types";
import { ScrollToTop } from "@/domains/common/ScrollToTop";

type PageProps = {
  params: Promise<{ debateId: string }>;
};

export default async function DebateDetailByIdPage({ params }: PageProps) {
  const { debateId } = await params;
  return (
    <div className="flex h-screen flex-col">
      <Header title="토론 주제" />
      <ScrollToTop />
      {/* 클라이언트 컨테이너에 ID 전달 */}
      <DebateDetailContainer debateId={debateId} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { debateId } = await params;
  const site =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
    "https://balance-debate.com";
  const fullUrl = `${site}/debate/${debateId}`;
  try {
    const res = await fetch(`${API_BASE_URL}/debates/${debateId}`, {
      next: { revalidate: 86400 },
    });
    const json = (await res.json()) as ApiResponse<DebateFromAPI>;
    const data = json.data || null;
    const title = data?.topic || "토론 주제";
    const description = data
      ? `${data.choiceA} vs ${data.choiceB}`
      : "밸런스 토론의 상세 내용을 확인해보세요.";
    return {
      title,
      description,
      alternates: { canonical: fullUrl },
      openGraph: {
        title,
        description,
        type: "article",
        url: fullUrl,
        images: data?.thumbnailUrl
          ? [{ url: data.thumbnailUrl, width: 1200, height: 630, alt: title }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: data?.thumbnailUrl ? [data.thumbnailUrl] : undefined,
      },
    };
  } catch {
    const title = "토론 주제";
    const description = "밸런스 토론의 상세 내용을 확인해보세요.";
    return {
      title,
      description,
      alternates: { canonical: fullUrl },
      openGraph: { title, description, type: "article", url: fullUrl },
    };
  }
}
