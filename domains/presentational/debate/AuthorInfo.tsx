import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface AuthorInfoProps {
  name: string;
  profileImage: string;
  createdAt: Date;
}

export function AuthorInfo({ name, profileImage, createdAt }: AuthorInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={profileImage}
        alt={name}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
      />
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{name}</span>
        <span className="text-sm text-gray-500">
          {format(createdAt, "yyyy년 MM월 dd일", {
            locale: ko,
          })}
        </span>
      </div>
    </div>
  );
}
