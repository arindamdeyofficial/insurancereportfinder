import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SEVERITY_COLOR = { high: "#e02424", medium: "#c27803", low: "#057a55", none: "#9ca3af" };

export function IncidentTimeline({ data }) {
  const byDate = {};
  data.forEach((inc) => {
    const date = inc.created_at.slice(0, 10);
    byDate[date] = (byDate[date] || 0) + 1;
  });

  const chartData = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ date, count }));

  if (!chartData.length) return <p className="text-muted">No incident data yet.</p>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#1a56db" radius={[4, 4, 0, 0]}>
          {chartData.map((_, i) => <Cell key={i} fill="#1a56db" />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
