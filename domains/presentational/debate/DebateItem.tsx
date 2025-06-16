import { type DebateItem } from "./types";
import { AuthorInfo } from "./AuthorInfo";
import { CommentCount } from "./CommentCount";
import Link from "next/link";

interface DebateItemProps {
  debate: DebateItem;
}

export function DebateItem({ debate }: DebateItemProps) {
  return (
    <Link
      href={`/debate/${debate.id}`}
      className="mx-auto mb-5 block max-w-2xl overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-5 shadow-md transition-all hover:shadow-lg"
    >
      <AuthorInfo
        name={debate.author.name}
        profileImage={debate.author.profileImage}
        createdAt={debate.createdAt}
      />
      <div className="mt-5">
        <h3 className="mb-4 text-xl font-bold text-gray-900 line-clamp-2">
          {debate.title}
        </h3>
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <img
            src={debate.thumbnail}
            alt={debate.title}
            className="h-48 w-full object-cover md:h-56"
          />
        </div>
        <div className="mt-4">
          <CommentCount count={debate.commentCount} />
        </div>
      </div>
    </Link>
  );
}
