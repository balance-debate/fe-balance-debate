import { Header } from "@/domains/common/Header";
import type { Metadata } from "next";
import { fetchDebates } from "@/lib/api";
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
    const data = await fetchDebates(0, 1);
    const first = data.debates?.[0];

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
