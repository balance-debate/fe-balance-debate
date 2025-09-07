import {
  type DebatesAPIResponse,
  type DebateFromAPI,
} from "@/domains/presentational/debate/types";
import { apiGet, apiPost, apiDelete } from "@/lib/utils/api";

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

// 댓글 목록 조회
export interface CommentFromAPI {
  id: number;
  content: string;
  childComments: Array<{
    id: number;
    content: string;
    likeCount: number;
    liked: boolean;
    createdAt: string;
    updatedAt: string;
    writer?: {
      nickname: string;
      profileEmoji: string;
    };
  }>;
  likeCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
  writer?: {
    nickname: string;
    profileEmoji: string;
  };
}

export interface CommentsAPIResponse {
  hasNext: boolean;
  comments: CommentFromAPI[];
}

export async function fetchComments(
  debateId: number | string,
  page: number = 0,
  size: number = 20
): Promise<CommentsAPIResponse> {
  const response = await apiGet<CommentsAPIResponse>(
    `/debates/${debateId}/comments?page=${page}&size=${size}`
  );

  if (response.statusCode !== 200) {
    if (response.statusCode === 403) {
      throw new Error("NOT_VOTED");
    }
    throw new Error(`댓글 조회 실패: ${response.statusCode}`);
  }

  if (!response.data) {
    throw new Error("댓글 데이터가 없습니다.");
  }

  return response.data;
}

// 댓글/답글 작성
export async function createComment(
  debateId: number | string,
  content: string,
  parentCommentId: number | null = null
): Promise<void> {
  const response = await apiPost<null>(`/debates/${debateId}/comments`, {
    content,
    parentCommentId,
  });

  if (response.statusCode !== 200) {
    // 코드 기반 우선 처리
    if (response.code === "NOT_VOTED") {
      throw new Error("NOT_VOTED");
    }
    if (response.code === "NOT_FOUND_DEBATE") {
      throw new Error("NOT_FOUND_DEBATE");
    }
    if (response.code === "NOT_FOUND_COMMENT") {
      throw new Error("NOT_FOUND_COMMENT");
    }

    // 백엔드 구현과의 불일치 대비 (status만 들어오는 경우)
    if (response.statusCode === 403) {
      throw new Error("NOT_VOTED");
    }
    if (response.statusCode === 404) {
      throw new Error("NOT_FOUND_DEBATE");
    }
    if (response.statusCode === 400) {
      throw new Error("NOT_FOUND_COMMENT");
    }

    throw new Error(`댓글 작성 실패: ${response.statusCode}`);
  }
}

// 댓글 좋아요
export async function likeComment(commentId: number | string): Promise<void> {
  const response = await apiPost<null>(`/comments/${commentId}/likes`);

  if (response.statusCode !== 200) {
    if (response.code === "NOT_VOTED" || response.statusCode === 403) {
      throw new Error("NOT_VOTED");
    }
    if (response.code === "NOT_FOUND_COMMENT" || response.statusCode === 404) {
      throw new Error("NOT_FOUND_COMMENT");
    }
    if (
      response.code === "ALREADY_LIKED_COMMENT" ||
      response.statusCode === 409
    ) {
      throw new Error("ALREADY_LIKED_COMMENT");
    }
    throw new Error(`댓글 좋아요 실패: ${response.statusCode}`);
  }
}

// 댓글 좋아요 취소
export async function unlikeComment(commentId: number | string): Promise<void> {
  const response = await apiDelete<null>(`/comments/${commentId}/likes`);

  if (response.statusCode !== 200) {
    if (response.code === "NOT_FOUND_COMMENT" || response.statusCode === 404) {
      throw new Error("NOT_FOUND_COMMENT");
    }
    throw new Error(`댓글 좋아요 취소 실패: ${response.statusCode}`);
  }
}
