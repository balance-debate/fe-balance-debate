"use client";

import { useAuth } from "@/lib/api/auth";

/**
 * 로그인 상태를 확인하는 훅
 */
export function useAuthStatus() {
  const { data: meResponse, isLoading, error } = useAuth.useMe();

  const isAuthenticated =
    meResponse?.statusCode === 200 && meResponse?.data !== null;
  const user = meResponse?.data || null;

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
  };
}
