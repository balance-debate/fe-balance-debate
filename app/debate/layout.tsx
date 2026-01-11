export default function DebateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}
