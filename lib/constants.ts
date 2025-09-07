// API 관련 상수
export const API_BASE_URL = "https://dev-api.balance-debate.com";
// export const API_BASE_URL = "https://13.125.132.172";

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/signup",
    LOGIN: "/login",
    LOGOUT: "/logout",
    ME: "/me",
  },
} as const;
