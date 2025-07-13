"use client";

import { useState } from "react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isReply?: boolean;
}

// TODO: 실제 로그인 상태 확인 로직으로 교체 필요
const IS_LOGGED_IN = true; // 임시 상수

export function CommentInput({
  onSubmit,
  placeholder = "댓글을 입력하세요...",
  isReply = false,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!IS_LOGGED_IN) {
      // TODO: 로그인 모달 표시
      console.log("TODO: Show login modal");
      return;
    }

    onSubmit(content.trim());
    setContent("");
    setIsFocused(false);
  };

  const handleClick = () => {
    if (!IS_LOGGED_IN) {
      // TODO: 로그인 모달 표시
      console.log("TODO: Show login modal");
      return;
    }
    setIsFocused(true);
  };

  return (
    <div className={`${isReply ? "ml-12" : ""}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start space-x-3">
          {/* 프로필 이미지 (로그인 상태일 때만) */}
          {IS_LOGGED_IN && (
            <img
              src="https://picsum.photos/40/40" // TODO: 실제 사용자 프로필 이미지
              alt="내 프로필"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
          )}

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onClick={handleClick}
              onFocus={() => setIsFocused(true)}
              placeholder={
                IS_LOGGED_IN
                  ? placeholder
                  : "댓글을 작성하려면 로그인이 필요합니다."
              }
              disabled={!IS_LOGGED_IN}
              className={`w-full p-3 border rounded-lg resize-none transition-all ${
                IS_LOGGED_IN
                  ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : "border-gray-200 bg-gray-50 cursor-pointer"
              } ${isFocused ? "min-h-[100px]" : "min-h-[44px]"}`}
              rows={isFocused ? 3 : 1}
            />

            {/* 버튼들 (포커스 상태일 때만 표시) */}
            {isFocused && IS_LOGGED_IN && (
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setContent("");
                    setIsFocused(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    content.trim()
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isReply ? "답글" : "댓글"} 작성
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
