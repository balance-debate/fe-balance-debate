"use client";

import { useEffect, useState } from "react";
import { Comment } from "./types";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";
// import { useAuthStatus } from "@/domains/common/hooks/useAuthStatus";
import {
  fetchComments,
  type CommentFromAPI,
  createComment,
  likeComment,
  unlikeComment,
} from "@/lib/api";

interface CommentSectionProps {
  debateId: number;
}

export function CommentSection({ debateId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const { user } = useAuthStatus();

  async function loadComments() {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchComments(debateId, 0, 20);

      // API -> UI 타입 매핑
      const mapped: Comment[] = data.comments.map((c: CommentFromAPI) => ({
        id: c.id,
        author: {
          name: "익명",
          profileImage: `https://picsum.photos/seed/comment-${c.id}/40/40`,
        },
        content: c.content,
        likeCount: c.likeCount,
        isLiked: c.liked,
        replies: c.childComments.map((rc) => ({
          id: rc.id,
          author: {
            name: "익명",
            profileImage: `https://picsum.photos/seed/reply-${rc.id}/40/40`,
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
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debateId]);

  // 좋아요 순으로 정렬
  const sortedComments = [...comments].sort(
    (a, b) => b.likeCount - a.likeCount
  );

  const handleCommentSubmit = async (content: string) => {
    try {
      await createComment(debateId, content, null);
      await loadComments();
    } catch (e) {
      const err = e as Error;
      if (err.message === "NOT_VOTED") {
        setError("NOT_VOTED");
      } else if (err.message === "NOT_FOUND_DEBATE") {
        setError("존재하지 않는 토론입니다.");
      } else {
        setError(err.message || "댓글 작성에 실패했습니다.");
      }
    }
  };

  const handleCommentLike = async (commentId: number) => {
    try {
      const target = comments.find((c) => c.id === commentId);
      if (target?.isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
      await loadComments();
    } catch (e) {
      const err = e as Error;
      if (err.message === "NOT_VOTED") {
        setError("NOT_VOTED");
      } else if (err.message === "NOT_FOUND_COMMENT") {
        setError("댓글을 찾을 수 없습니다.");
      } else if (err.message === "ALREADY_LIKED_COMMENT") {
        // 이미 좋아요 한 경우 UX: 무시하고 최신 목록만 반영
        await loadComments();
      } else {
        setError(err.message || "댓글 좋아요에 실패했습니다.");
      }
    }
  };

  const handleReply = async (commentId: number, content: string) => {
    try {
      await createComment(debateId, content, commentId);
      await loadComments();
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
    }
  };

  const handleReplyLike = async (replyId: number) => {
    try {
      let isLiked = false;
      for (const c of comments) {
        const found = c.replies?.find((r) => r.id === replyId);
        if (found) {
          isLiked = found.isLiked;
          break;
        }
      }
      if (isLiked) {
        await unlikeComment(replyId);
      } else {
        await likeComment(replyId);
      }
      await loadComments();
    } catch (e) {
      const err = e as Error;
      if (err.message === "NOT_VOTED") {
        setError("NOT_VOTED");
      } else if (err.message === "NOT_FOUND_COMMENT") {
        setError("댓글을 찾을 수 없습니다.");
      } else if (err.message === "ALREADY_LIKED_COMMENT") {
        await loadComments();
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
        <div className="text-sm text-gray-500">좋아요 순으로 정렬됨</div>
      </div>

      {/* 댓글 입력 */}
      <div className="mb-8">
        <CommentInput onSubmit={handleCommentSubmit} />
      </div>

      {/* 댓글 목록 */}
      <CommentList
        comments={sortedComments}
        onLike={handleCommentLike}
        onReply={handleReply}
        onReplyLike={handleReplyLike}
      />
    </div>
  );
}
