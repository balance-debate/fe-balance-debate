import { Header } from "@/domains/common/Header";
import type { Metadata } from "next";
import { API_BASE_URL } from "@/lib/constants";
import type { DebatesAPIResponse } from "@/domains/presentational/debate/types";
import DebatListContainer from "@/domains/container/DebatListContainer";

export default async function DebatPage() {
  return (
    <>
      <Header title="토론 목록" />
      <DebatListContainer />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const baseTitle = "밸런스 토론 목록";
  const baseDescription = "요즘 가장 핫한 밸런스 토론 주제를 만나보세요.";

  try {
    const res = await fetch(
      `${API_BASE_URL}/debates?size=1&page=0`,
      { next: { revalidate: 86400 } }
    );
    const json = (await res.json()) as {
      statusCode: number;
      data: DebatesAPIResponse | null;
    };
    const first = json.data?.debates?.[0];

    return {
      title: baseTitle,
      description: baseDescription,
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        type: "website",
        images: first?.thumbnailUrl
          ? [
              {
                url: first.thumbnailUrl,
                width: 1200,
                height: 630,
                alt: "토론 목록 대표 이미지",
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {
      title: baseTitle,
      description: baseDescription,
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        type: "website",
      },
    };
  }
}
