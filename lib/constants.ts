// API 관련 상수
export const API_BASE_URL = "https://dev-api.balance-debate.com";

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/signup",
    LOGIN: "/login",
    LOGOUT: "/logout",
    ME: "/me",
  },
} as const;
