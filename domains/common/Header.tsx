"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, Popover, Typography, Button, Box } from "@mui/material";
import { ExitToApp as LogoutIcon } from "@mui/icons-material";
import { useAuthStatus } from "./hooks/useAuthStatus";
import { useAuthModal } from "@/lib/providers/AuthModalProvider";
import { useAuth } from "@/lib/api/auth";
import { useSnackbar } from "@/lib/providers/SnackbarProvider";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { isAuthenticated, user, isLoading } = useAuthStatus();
  const { openLoginModal } = useAuthModal();
  const { useLogout } = useAuth;
  const logoutMutation = useLogout();
  const { showSnackbar } = useSnackbar();

  // 팝오버 상태
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isPopoverOpen = Boolean(anchorEl);

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      showSnackbar("로그아웃되었습니다.", "success");
      handlePopoverClose();
    } catch {
      showSnackbar("로그아웃 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* 로고 */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          밸런스토론
        </Link>

        {/* 중앙 제목 */}
        <div className="absolute left-1/2 -translate-x-1/2">
          {title && (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        {/* 로그인/사용자 영역 */}
        <div className="flex items-center">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated && user ? (
            <>
              <button
                onClick={handleUserClick}
                className="flex items-center gap-2 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <Avatar
                  src={`https://picsum.photos/seed/${user.nickname}/40/40`}
                  alt={user.nickname}
                  sx={{ width: 32, height: 32 }}
                />
                <span className="hidden md:inline font-medium text-gray-900">
                  {user.nickname}
                </span>
              </button>

              <Popover
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box sx={{ p: 2, minWidth: 200 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    {user.nickname}
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                  </Button>
                </Box>
              </Popover>
            </>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden md:inline">로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
