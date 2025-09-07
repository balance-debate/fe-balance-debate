// 공통 API 응답 타입 (실제 규격에 맞게)
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string | null;
  data: T | null;
  code?: string | null;
}

// HTTP 메서드 타입
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 요청 옵션 타입
export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  credentials?: RequestCredentials;
}

// 인증 관련 타입
export interface User {
  nickname: string;
  profileEmoji: string;
}

export interface LoginRequest {
  nickname: string;
  password: string;
}

export interface SignupRequest {
  nickname: string;
  password: string;
  confirmPassword: string; // 프론트엔드에서만 사용, API에는 보내지 않음
}

// API 전송용 회원가입 요청 (confirmPassword 제외)
export interface SignupApiRequest {
  nickname: string;
  password: string;
}
