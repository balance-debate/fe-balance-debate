import {
  type DebatesAPIResponse,
  type DebateFromAPI,
} from "@/domains/presentational/debate/types";
import { apiGet, apiPost } from "@/lib/utils/api";

export async function fetchDebates(
  page: number = 0,
  size: number = 20
): Promise<DebatesAPIResponse> {
  const response = await apiGet<DebatesAPIResponse>(
    `/debates?size=${size}&page=${page}`
  );

  if (response.statusCode !== 200) {
    throw new Error(`API 요청 실패: ${response.statusCode}`);
  }

  return response.data!;
}

export async function fetchDebateDetail(id: string): Promise<DebateFromAPI> {
  const response = await apiGet<DebateFromAPI>(`/debates/${id}`);

  if (response.statusCode !== 200) {
    if (response.statusCode === 404) {
      throw new Error("토론을 찾을 수 없습니다.");
    }
    throw new Error(`API 요청 실패: ${response.statusCode}`);
  }

  if (!response.data) {
    throw new Error("토론 데이터가 없습니다.");
  }

  return response.data;
}

export async function fetchHasVote(
  debateId: string
): Promise<{ hasVote: boolean }> {
  const response = await apiGet<{ hasVote: boolean }>(
    `/debates/${debateId}/has-vote`
  );

  if (response.statusCode !== 200) {
    throw new Error(`투표 여부 조회 실패: ${response.statusCode}`);
  }

  if (!response.data) {
    throw new Error("투표 여부 데이터가 없습니다.");
  }

  return response.data;
}

export async function submitVote(
  debateId: string,
  target: "CHOICE_A" | "CHOICE_B"
): Promise<void> {
  const response = await apiPost(`/debates/${debateId}/votes`, { target });

  if (response.statusCode !== 200) {
    if (response.statusCode === 404) {
      throw new Error("토론을 찾을 수 없습니다.");
    }
    if (response.statusCode === 409) {
      throw new Error("이미 투표하셨습니다.");
    }
    throw new Error(`투표 실패: ${response.statusCode}`);
  }
}

export async function fetchVoteResults(
  debateId: string
): Promise<{ choiceACount: number; choiceBCount: number }> {
  const response = await apiGet<{ choiceACount: number; choiceBCount: number }>(
    `/debates/${debateId}/votes`
  );

  if (response.statusCode !== 200) {
    if (response.statusCode === 404) {
      throw new Error("토론을 찾을 수 없습니다.");
    }
    throw new Error(`투표 결과 조회 실패: ${response.statusCode}`);
  }

  if (!response.data) {
    throw new Error("투표 결과 데이터가 없습니다.");
  }

  return response.data;
}
