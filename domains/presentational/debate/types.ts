export interface DebateItem {
  id: number;
  author: {
    name: string;
    profileImage: string;
  };
  createdAt: Date;
  title: string;
  thumbnail: string;
  commentCount: number;
}

// 댓글 타입 정의
export interface Comment {
  id: number;
  author: {
    name: string;
    profileImage: string;
  };
  content: string;
  likeCount: number;
  isLiked: boolean;
  replies?: Reply[];
}

// 대댓글 타입 정의
export interface Reply {
  id: number;
  author: {
    name: string;
    profileImage: string;
  };
  content: string;
  likeCount: number;
  isLiked: boolean;
  parentCommentId: number;
}
