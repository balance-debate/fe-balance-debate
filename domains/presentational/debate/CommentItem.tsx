"use client";

import { useState } from "react";
import { Comment } from "./types";
import { CommentInput } from "./CommentInput";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: number) => void;
  onReply: (commentId: number, content: string) => void;
  onReplyLike: (replyId: number) => void;
}

// TODO: 실제 로그인 상태 확인 로직으로 교체 필요
const IS_LOGGED_IN = true; // 임시 상수

export function CommentItem({
  comment,
  onLike,
  onReply,
  onReplyLike,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleLike = () => {
    if (!IS_LOGGED_IN) {
      // TODO: 로그인 모달 표시
      console.log("TODO: Show login modal");
      return;
    }
    onLike(comment.id);
  };

  const handleReplySubmit = (content: string) => {
    onReply(comment.id, content);
    setShowReplyInput(false);
  };

  const handleReplyLike = (replyId: number) => {
    if (!IS_LOGGED_IN) {
      // TODO: 로그인 모달 표시
      console.log("TODO: Show login modal");
      return;
    }
    onReplyLike(replyId);
  };

  return (
    <div className="space-y-4">
      {/* 메인 댓글 */}
      <div className="flex items-start space-x-3">
        <img
          src={comment.author.profileImage}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium text-gray-900">
              {comment.author.name}
            </span>
          </div>

          <p className="mt-1 text-gray-900 whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* 댓글 액션 버튼들 */}
          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.isLiked
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={comment.isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.60L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7v13m-3-4h-2m-2-2h2m2-4h2m2-2h2"
                />
              </svg>
              <span>{comment.likeCount}</span>
            </button>

            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              답글
            </button>
          </div>
        </div>
      </div>

      {/* 답글 입력창 */}
      {showReplyInput && (
        <div className="ml-11">
          <CommentInput
            onSubmit={handleReplySubmit}
            placeholder="답글을 입력하세요..."
            isReply={true}
          />
        </div>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-4">
          {/* 대댓글 펼치기/접기 버튼 */}
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                showReplies ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span>
              {showReplies
                ? "답글 숨기기"
                : `답글 ${comment.replies.length}개 보기`}
            </span>
          </button>

          {/* 대댓글 리스트 */}
          {showReplies && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-3">
                  <img
                    src={reply.author.profileImage}
                    alt={reply.author.name}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium text-gray-900">
                        {reply.author.name}
                      </span>
                    </div>

                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                      {reply.content}
                    </p>

                    {/* 대댓글 액션 버튼들 */}
                    <div className="flex items-center space-x-4 mt-2">
                      <button
                        onClick={() => handleReplyLike(reply.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          reply.isLiked
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill={reply.isLiked ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.60L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7v13m-3-4h-2m-2-2h2m2-4h2m2-2h2"
                          />
                        </svg>
                        <span>{reply.likeCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
