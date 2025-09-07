import { type DebateFromAPI } from "./types";
import Link from "next/link";

interface DebateItemProps {
  debate: DebateFromAPI;
  index: number;
}

export function DebateItem({ debate, index }: DebateItemProps) {
  return (
    <Link
      href={`/debate/detail?debateId=${index + 1}`}
      className="mx-auto mb-5 block max-w-2xl overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-5 shadow-md transition-all hover:shadow-lg"
    >
      <div className="mt-2">
        <h3 className="mb-4 text-xl font-bold text-gray-900 line-clamp-2">
          {debate.topic}
        </h3>
        <div className="overflow-hidden rounded-lg border border-gray-100 mb-4">
          <img
            src={debate.thumbnailUrl}
            alt={debate.topic}
            className="h-48 w-full object-cover md:h-56"
          />
        </div>
        <div className="space-y-3">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-1">선택지 A</p>
            <p className="text-gray-900 font-semibold">{debate.choiceA}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-600 font-medium mb-1">선택지 B</p>
            <p className="text-gray-900 font-semibold">{debate.choiceB}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
