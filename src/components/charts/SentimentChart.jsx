import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = { positive: "#057a55", negative: "#e02424", neutral: "#6b7280" };

export function SentimentChart({ data }) {
  const counts = { positive: 0, negative: 0, neutral: 0 };
  data.forEach((s) => { counts[s.label] = (counts[s.label] || 0) + 1; });

  const chartData = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  if (!chartData.length) return <p className="text-muted">No sentiment data yet.</p>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || "#aaa"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
