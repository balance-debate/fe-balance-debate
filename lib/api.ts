import {
  type DebatesAPIResponse,
  type DebateFromAPI,
} from "@/domains/presentational/debate/types";
import { API_BASE_URL } from "@/lib/constants";

export async function fetchDebates(
  page: number = 0,
  size: number = 20
): Promise<DebatesAPIResponse> {
  const response = await fetch(
    `${API_BASE_URL}/debates?size=${size}&page=${page}`
  );

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function fetchDebateDetail(id: string): Promise<DebateFromAPI> {
  const response = await fetch(`${API_BASE_URL}/debates/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("토론을 찾을 수 없습니다.");
    }
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function fetchHasVote(
  debateId: string
): Promise<{ hasVote: boolean }> {
  const response = await fetch(`${API_BASE_URL}/debates/${debateId}/has-vote`);

  if (!response.ok) {
    throw new Error(`투표 여부 조회 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function submitVote(
  debateId: string,
  target: "CHOICE_A" | "CHOICE_B"
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/debates/${debateId}/votes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ target }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("토론을 찾을 수 없습니다.");
    }
    if (response.status === 409) {
      throw new Error("이미 투표하셨습니다.");
    }
    throw new Error(`투표 실패: ${response.status}`);
  }
}

export async function fetchVoteResults(
  debateId: string
): Promise<{ choiceACount: number; choiceBCount: number }> {
  const response = await fetch(`${API_BASE_URL}/debates/${debateId}/votes`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("토론을 찾을 수 없습니다.");
    }
    throw new Error(`투표 결과 조회 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}
