"use client";

import { useState } from "react";
import { Comment } from "./types";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  debateId: number;
}

// 임시 댓글 데이터
const mockComments: Comment[] = [
  {
    id: 1,
    author: {
      name: "김철수",
      profileImage: "https://picsum.photos/seed/user1/40/40",
    },
    content:
      "정말 흥미로운 주제네요! 저는 찬성 쪽에 한 표를 던졌습니다. 여러분들은 어떻게 생각하시나요?",
    likeCount: 12,
    isLiked: false,
    replies: [
      {
        id: 101,
        author: {
          name: "이영희",
          profileImage: "https://picsum.photos/seed/user2/40/40",
        },
        content:
          "저도 같은 생각이에요! 특히 환경적인 측면에서 생각해보면 더욱 그런 것 같습니다.",
        likeCount: 3,
        isLiked: true,
        parentCommentId: 1,
      },
      {
        id: 102,
        author: {
          name: "박민수",
          profileImage: "https://picsum.photos/seed/user3/40/40",
        },
        content:
          "흠... 저는 조금 다른 의견인데, 경제적 측면도 고려해야 한다고 생각해요.",
        likeCount: 7,
        isLiked: false,
        parentCommentId: 1,
      },
    ],
  },
  {
    id: 2,
    author: {
      name: "정현우",
      profileImage: "https://picsum.photos/seed/user4/40/40",
    },
    content:
      "반대 의견입니다. 실용성을 고려했을 때 다른 선택이 더 나을 것 같아요.",
    likeCount: 8,
    isLiked: true,
    replies: [],
  },
  {
    id: 3,
    author: {
      name: "최지은",
      profileImage: "https://picsum.photos/seed/user5/40/40",
    },
    content:
      "와 이런 주제로 토론하는 게 정말 재미있네요! 더 많은 사람들의 의견이 궁금합니다 😊",
    likeCount: 15,
    isLiked: false,
    replies: [],
  },
];

export function CommentSection({ debateId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);

  // 좋아요 순으로 정렬
  const sortedComments = [...comments].sort(
    (a, b) => b.likeCount - a.likeCount
  );

  const handleCommentSubmit = (content: string) => {
    const newComment: Comment = {
      id: Date.now(), // 임시 ID
      author: {
        name: "나", // TODO: 실제 사용자 정보로 교체
        profileImage: "https://picsum.photos/seed/me/40/40",
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
        name: "나", // TODO: 실제 사용자 정보로 교체
        profileImage: "https://picsum.photos/seed/me/40/40",
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
