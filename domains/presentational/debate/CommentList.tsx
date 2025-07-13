"use client";

import { Comment } from "./types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onLike: (commentId: number) => void;
  onReply: (commentId: number, content: string) => void;
  onReplyLike: (replyId: number) => void;
}

export function CommentList({
  comments,
  onLike,
  onReply,
  onReplyLike,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>아직 댓글이 없습니다.</p>
        <p className="text-sm mt-2">첫 번째 댓글을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onLike={onLike}
          onReply={onReply}
          onReplyLike={onReplyLike}
        />
      ))}
    </div>
  );
}
