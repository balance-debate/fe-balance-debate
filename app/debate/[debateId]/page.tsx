import type { Metadata } from "next";
import { Header } from "@/domains/common/Header";
import { DebateDetailContainer } from "@/domains/container/debate/DebateDetailContainer";
import { fetchDebateDetail } from "@/lib/api";

type PageProps = {
  params: Promise<{ debateId: string }>;
};

export default async function DebateDetailByIdPage({ params }: PageProps) {
  const { debateId } = await params;
  return (
    <div className="flex h-screen flex-col">
      <Header title="토론 주제" />
      {/* 클라이언트 컨테이너에 ID 전달 */}
      <DebateDetailContainer debateId={debateId} />
    </div>
  );
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { debateId } = await params;
  try {
    const data = await fetchDebateDetail(debateId);
    const title = data.topic || "토론 주제";
    const description = `${data.choiceA} vs ${data.choiceB}`;
    const site =
      (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
      "https://balance-debate.com";
    const fullUrl = `${site}/debate/${debateId}`;
    return {
      title,
      description,
      alternates: {
        canonical: fullUrl,
      },
      openGraph: {
        title,
        description,
        type: "article",
        url: fullUrl,
        images: data.thumbnailUrl
          ? [
              {
                url: data.thumbnailUrl,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: data.thumbnailUrl ? [data.thumbnailUrl] : undefined,
      },
    };
  } catch {
    const fallbackTitle = "토론 주제";
    const fallbackDescription = "밸런스 토론의 상세 내용을 확인해보세요.";
    const site =
      (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
      "https://balance-debate.com";
    const fullUrl = `${site}/debate/${debateId}`;
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: {
        canonical: fullUrl,
      },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        type: "article",
        url: fullUrl,
      },
    };
  }
}


