"use client";

import { useEffect, useState } from "react";
import { Comment } from "./types";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";
import { useAuthStatus } from "@/domains/common/hooks/useAuthStatus";
import {
  fetchComments,
  type CommentFromAPI,
  createComment,
  likeComment,
  unlikeComment,
} from "@/lib/api";

interface CommentSectionProps {
  debateId: number;
  hasVote?: boolean | null;
}

export function CommentSection({ debateId, hasVote }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStatus();

  async function loadComments() {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchComments(debateId, 0, 20);

      // API -> UI 타입 매핑
      const mapped: Comment[] = data.comments.map((c: CommentFromAPI) => ({
        id: c.id,
        author: {
          name: c.writer?.nickname ?? "익명",
          profileImage: c.writer?.profileEmoji ?? "🙂",
        },
        content: c.content,
        likeCount: c.likeCount,
        isLiked: c.liked,
        replies: c.childComments.map((rc) => ({
          id: rc.id,
          author: {
            name: rc.writer?.nickname ?? "익명",
            profileImage: rc.writer?.profileEmoji ?? "🙂",
          },
          content: rc.content,
          likeCount: rc.likeCount,
          isLiked: rc.liked,
          parentCommentId: c.id,
        })),
      }));

      setComments(mapped);
    } catch (e) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // 투표한 경우에만 댓글을 불러옵니다
    if (hasVote === true) {
      loadComments();
    } else if (hasVote === false) {
      // 투표 전에는 댓글 비노출
      setComments([]);
      setError("NOT_VOTED");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debateId, hasVote]);

  // 서버 순서를 유지합니다 (정렬 제거)

  const handleCommentSubmit = async (content: string) => {
    try {
      const { commentId } = await createComment(debateId, content, null);
      const tempId = commentId;
      const tempComment: Comment = {
        id: tempId,
        author: {
          name: isAuthenticated && user?.nickname ? user.nickname : "익명",
          profileImage:
            isAuthenticated && user?.profileEmoji ? user.profileEmoji : "🙂",
        },
        content,
        likeCount: 0,
        isLiked: false,
        replies: [],
      };
      setComments((prev) => [tempComment, ...prev]);
    } catch (e) {
      const err = e as Error;
      if (err.message === "NOT_VOTED") {
        setError("NOT_VOTED");
      } else if (err.message === "NOT_FOUND_DEBATE") {
        setError("존재하지 않는 토론입니다.");
      } else {
        setError(err.message || "댓글 작성에 실패했습니다.");
      }
      await loadComments();
    }
  };

  const handleCommentLike = async (commentId: number) => {
    const target = comments.find((c) => c.id === commentId);
    const wasLiked = !!target?.isLiked;

    // 낙관적 토글
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1,
            }
          : c
      )
    );

    try {
      if (wasLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
    } catch (e) {
      // 실패 시 롤백
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                isLiked: wasLiked,
                likeCount: wasLiked ? c.likeCount + 1 : c.likeCount - 1,
              }
            : c
        )
      );

      const err = e as Error;
      if (err.message === "NOT_VOTED") {
        setError("NOT_VOTED");
      } else if (err.message === "NOT_FOUND_COMMENT") {
        setError("댓글을 찾을 수 없습니다.");
      } else if (err.message === "ALREADY_LIKED_COMMENT") {
        // 이미 좋아요 상태면 무시
      } else {
        setError(err.message || "댓글 좋아요에 실패했습니다.");
      }
    }
  };

  const handleReply = async (commentId: number, content: string) => {
    try {
      const { commentId: newId } = await createComment(
        debateId,
        content,
        commentId
      );
      const tempId = newId;
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: [
                  ...(c.replies || []),
                  {
                    id: tempId,
                    author: {
                      name:
                        isAuthenticated && user?.nickname
                          ? user.nickname
                          : "익명",
                      profileImage:
                        isAuthenticated && user?.profileEmoji
                          ? user.profileEmoji
                          : "🙂",
                    },
                    content,
                    likeCount: 0,
                    isLiked: false,
                    parentCommentId: commentId,
                  },
                ],
              }
            : c
        )
      );
    } catch (e) {
      const err = e as Error;
      if (err.message === "NOT_VOTED") {
        setError("NOT_VOTED");
      } else if (err.message === "NOT_FOUND_COMMENT") {
        setError("부모 댓글을 찾을 수 없습니다.");
      } else if (err.message === "NOT_FOUND_DEBATE") {
        setError("존재하지 않는 토론입니다.");
      } else {
        setError(err.message || "답글 작성에 실패했습니다.");
      }
      await loadComments();
    }
  };

  const handleReplyLike = async (replyId: number) => {
    // 현재 liked 상태 파악
    let wasLiked = false;
    setComments((prev) => {
      // 먼저 낙관적 토글을 수행하기 위해 미리 탐색
      for (const c of prev) {
        const found = c.replies?.find((r) => r.id === replyId);
        if (found) {
          wasLiked = found.isLiked;
          break;
        }
      }
      return prev.map((c) => ({
        ...c,
        replies: c.replies?.map((r) =>
          r.id === replyId
            ? {
                ...r,
                isLiked: !r.isLiked,
                likeCount: r.isLiked ? r.likeCount - 1 : r.likeCount + 1,
              }
            : r
        ),
      }));
    });

    try {
      if (wasLiked) {
        await unlikeComment(replyId);
      } else {
        await likeComment(replyId);
      }
    } catch (e) {
      // 실패 시 롤백
      setComments((prev) =>
        prev.map((c) => ({
          ...c,
          replies: c.replies?.map((r) =>
            r.id === replyId
              ? {
                  ...r,
                  isLiked: wasLiked,
                  likeCount: wasLiked ? r.likeCount + 1 : r.likeCount - 1,
                }
              : r
          ),
        }))
      );

      const err = e as Error;
      if (err.message === "NOT_VOTED") {
        setError("NOT_VOTED");
      } else if (err.message === "NOT_FOUND_COMMENT") {
        setError("댓글을 찾을 수 없습니다.");
      } else if (err.message === "ALREADY_LIKED_COMMENT") {
        // 이미 좋아요 상태면 무시
      } else {
        setError(err.message || "답글 좋아요에 실패했습니다.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error === "NOT_VOTED") {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="text-center py-8 text-gray-600">
          투표 후에 댓글을 확인할 수 있습니다
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          댓글 {comments.length}개
        </h3>
        {/* 서버 순서를 그대로 표시합니다 */}
      </div>

      {/* 댓글 입력 */}
      <div className="mb-8">
        <CommentInput onSubmit={handleCommentSubmit} />
      </div>

      {/* 댓글 목록 */}
      <CommentList
        comments={comments}
        onLike={handleCommentLike}
        onReply={handleReply}
        onReplyLike={handleReplyLike}
      />
    </div>
  );
}
