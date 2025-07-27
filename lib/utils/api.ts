import { API_BASE_URL } from "@/lib/constants";
import { ApiResponse, RequestOptions } from "../types/api";

/**
 * 공통 API 호출 함수
 * @param endpoint - API 엔드포인트 (예: '/signup', '/login')
 * @param options - 요청 옵션
 * @returns Promise<ApiResponse<T>>
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    body,
    credentials = "include", // 쿠키 방식 로그인을 위해 include 설정
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  // 기본 헤더 설정
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // 요청 설정
  const requestConfig: RequestInit = {
    method,
    headers: defaultHeaders,
    credentials,
  };

  // body가 있는 경우 JSON 문자열로 변환
  if (body && method !== "GET") {
    requestConfig.body = JSON.stringify(body);
  }

  try {
    console.log(`[API Request] ${method} ${url}`, body ? body : "");

    const response = await fetch(url, requestConfig);

    console.log(response);

    // 응답을 JSON으로 파싱
    const data: ApiResponse<T> = await response.json();

    console.log(`[API Response] ${method} ${url}`, data);

    return data;
  } catch (error) {
    console.error(`[API Error] ${method} ${url}`, error);

    // 에러 발생 시 기본 응답 형태로 반환
    return {
      statusCode: 500,
      message: "Network error occurred",
      data: null,
      code: "NETWORK_ERROR",
    };
  }
}

/**
 * GET 요청 헬퍼 함수
 */
export function apiGet<T = unknown>(
  endpoint: string,
  options: Omit<RequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST 요청 헬퍼 함수
 */
export function apiPost<T = unknown>(
  endpoint: string,
  body?: unknown,
  options: Omit<RequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "POST", body });
}
