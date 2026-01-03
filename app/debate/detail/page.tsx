"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LegacyDebateDetailRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const debateId = searchParams.get("debateId");
    if (debateId) {
      router.replace(`/debate/${debateId}`);
    } else {
      router.replace(`/debate`);
    }
  }, [router, searchParams]);
  return null;
}
