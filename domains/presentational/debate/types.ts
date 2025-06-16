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
