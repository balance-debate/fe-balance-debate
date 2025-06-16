import { Header } from "@/domains/common/Header";

export default function DebateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header title="토론 목록" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
