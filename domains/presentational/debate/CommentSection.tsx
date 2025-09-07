"use client";

import { useEffect, useState } from "react";
import { Comment } from "./types";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";
import { useAuthStatus } from "@/domains/common/hooks/useAuthStatus";
import { fetchComments, type CommentFromAPI } from "@/lib/api";

interface CommentSectionProps {
  debateId: number;
}

export function CommentSection({ debateId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStatus();

  useEffect(() => {
    const load = async () => {
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
    };

    load();
  }, [debateId]);

  // 좋아요 순으로 정렬
  const sortedComments = [...comments].sort(
    (a, b) => b.likeCount - a.likeCount
  );

  const handleCommentSubmit = (content: string) => {
    const newComment: Comment = {
      id: Date.now(), // 임시 ID
      author: {
        name: user?.nickname || "익명", // 실제 사용자 정보 사용
        profileImage: user?.nickname
          ? `https://picsum.photos/seed/${user.nickname}/40/40`
          : "https://picsum.photos/seed/anonymous/40/40",
      },
      content,
      likeCount: 0,
      isLiked: false,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);

    // TODO: 실제 API 호출
    console.log("TODO: API call to create comment", { debateId, content });
  };

  const handleCommentLike = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            }
          : comment
      )
    );

    // TODO: 실제 API 호출
    console.log("TODO: API call to like comment", { commentId });
  };

  const handleReply = (commentId: number, content: string) => {
    const newReply = {
      id: Date.now(), // 임시 ID
      author: {
        name: user?.nickname || "익명", // 실제 사용자 정보 사용
        profileImage: user?.nickname
          ? `https://picsum.photos/seed/${user.nickname}/40/40`
          : "https://picsum.photos/seed/anonymous/40/40",
      },
      content,
      likeCount: 0,
      isLiked: false,
      parentCommentId: commentId,
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            }
          : comment
      )
    );

    // TODO: 실제 API 호출
    console.log("TODO: API call to create reply", { commentId, content });
  };

  const handleReplyLike = (replyId: number) => {
    setComments((prev) =>
      prev.map((comment) => ({
        ...comment,
        replies: comment.replies?.map((reply) =>
          reply.id === replyId
            ? {
                ...reply,
                isLiked: !reply.isLiked,
                likeCount: reply.isLiked
                  ? reply.likeCount - 1
                  : reply.likeCount + 1,
              }
            : reply
        ),
      }))
    );

    // TODO: 실제 API 호출
    console.log("TODO: API call to like reply", { replyId });
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
