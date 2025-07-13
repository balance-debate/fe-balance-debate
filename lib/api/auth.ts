import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../constants";
import { apiGet, apiPost } from "../utils/api";
import {
  User,
  LoginRequest,
  SignupApiRequest,
  ApiResponse,
} from "../types/api";

// Query Keys
export const AUTH_QUERY_KEYS = {
  ME: ["auth", "me"] as const,
} as const;

// API 함수들
export const authApi = {
  /**
   * 회원가입
   */
  signup: async (data: SignupApiRequest): Promise<ApiResponse<null>> => {
    return apiPost<null>(API_ENDPOINTS.AUTH.SIGNUP, data);
  },

  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<ApiResponse<null>> => {
    return apiPost<null>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<ApiResponse<null>> => {
    return apiPost<null>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * 내 정보 조회
   */
  me: async (): Promise<ApiResponse<User>> => {
    return apiGet<User>(API_ENDPOINTS.AUTH.ME);
  },
};

// React Query Hooks
export const useAuth = {
  /**
   * 내 정보 조회 쿼리
   */
  useMe: () => {
    return useQuery({
      queryKey: AUTH_QUERY_KEYS.ME,
      queryFn: authApi.me,
    });
  },

  /**
   * 회원가입 뮤테이션
   */
  useSignup: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: authApi.signup,
      onSuccess: () => {
        // 회원가입 성공 시 내 정보 다시 가져오기
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ME });
      },
    });
  },

  /**
   * 로그인 뮤테이션
   */
  useLogin: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: authApi.login,
      onSuccess: () => {
        // 로그인 성공 시 내 정보 다시 가져오기
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ME });
      },
    });
  },

  /**
   * 로그아웃 뮤테이션
   */
  useLogout: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: authApi.logout,
      onSuccess: () => {
        // 로그아웃 성공 시 모든 쿼리 무효화
        queryClient.clear();
      },
    });
  },
};
