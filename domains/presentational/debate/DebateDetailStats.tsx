import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface DebateDetailStatsProps {
  agreeCount: number;
  disagreeCount: number;
  choiceALabel?: string;
  choiceBLabel?: string;
}

export function DebateDetailStats({
  agreeCount,
  disagreeCount,
  choiceALabel = "찬성",
  choiceBLabel = "반대",
}: DebateDetailStatsProps) {
  const total = agreeCount + disagreeCount;
  const agreePercentage = Math.round((agreeCount / total) * 100);
  const disagreePercentage = Math.round((disagreeCount / total) * 100);

  const data = [
    { name: choiceALabel, value: agreeCount, color: "#3B82F6" },
    { name: choiceBLabel, value: disagreeCount, color: "#EF4444" },
  ];

  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white mx-auto max-w-4xl px-4 py-8 md:px-8">
      <h2 className="mb-6 text-xl font-bold text-gray-900">투표 현황</h2>
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="h-50 w-40 md:h-48 md:w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={65}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500" />
            <span className="text-lg font-medium text-gray-900">
              {choiceALabel}: {agreeCount}표 ({agreePercentage}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500" />
            <span className="text-lg font-medium text-gray-900">
              {choiceBLabel}: {disagreeCount}표 ({disagreePercentage}%)
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            총 {total}명이 투표했습니다
          </div>
        </div>
      </div>
    </div>
  );
}
