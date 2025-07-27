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

// API 응답에 맞는 새로운 타입
export interface DebateFromAPI {
  topic: string;
  choiceA: string;
  choiceB: string;
  thumbnailUrl: string;
}

export interface DebatesAPIResponse {
  hasNext: boolean;
  debates: DebateFromAPI[];
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
