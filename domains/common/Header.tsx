"use client";

import Link from "next/link";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
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

        {/* 로그인/로그아웃 버튼 */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-2 text-gray-500 hover:bg-gray-100"
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
      </div>
    </header>
  );
}
