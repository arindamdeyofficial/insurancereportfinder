import { useGetIncidentsQuery } from "../api/incidentsApi";
import { useGetSentimentsQuery } from "../api/sentimentsApi";
import { useGetRivalAdsQuery } from "../api/rivalAdsApi";
import {
  useGetSentimentTrendQuery,
  useGetIncidentTrendQuery,
  useGetRivalLeaderboardQuery,
  useGetSourceActivityQuery,
} from "../api/analyticsApi";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea", "#0891b2", "#ea580c"];

function SentimentTrendChart({ data }) {
  if (!data?.length) return <p className="loading">No data</p>;
  const byDate = {};
  data.forEach(({ date, label, count }) => {
    if (!byDate[date]) byDate[date] = { date, positive: 0, negative: 0, neutral: 0 };
    if (label in byDate[date]) byDate[date][label] = count;
  });
  const chartData = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="positive" stroke="#16a34a" dot={false} name="Positive" />
        <Line type="monotone" dataKey="negative" stroke="#dc2626" dot={false} name="Negative" />
        <Line type="monotone" dataKey="neutral" stroke="#ca8a04" dot={false} name="Neutral" />
      </LineChart>
    </ResponsiveContainer>
  );
}

function IncidentTrendChart({ data }) {
  if (!data?.length) return <p className="loading">No data</p>;
  const byDate = {};
  data.forEach(({ date, severity, count }) => {
    if (!byDate[date]) byDate[date] = { date, high: 0, medium: 0, low: 0 };
    if (severity in byDate[date]) byDate[date][severity] = count;
  });
  const chartData = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="high" stackId="a" fill="#dc2626" name="High" />
        <Bar dataKey="medium" stackId="a" fill="#ca8a04" name="Medium" />
        <Bar dataKey="low" stackId="a" fill="#16a34a" name="Low" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RivalLeaderboardChart({ data }) {
  if (!data?.length) return <p className="loading">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="competitor" tick={{ fontSize: 11 }} width={76} />
        <Tooltip />
        <Bar dataKey="count" fill="#2563eb" name="Ad mentions" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SourceActivityChart({ data }) {
  if (!data?.length) return <p className="loading">No data</p>;
  const sources = [...new Set(data.map((r) => r.source))];
  const byDate = {};
  data.forEach(({ date, source, articles }) => {
    if (!byDate[date]) byDate[date] = { date };
    byDate[date][source] = articles;
  });
  const chartData = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        {sources.slice(0, 5).map((src, i) => (
          <Line key={src} type="monotone" dataKey={src} stroke={COLORS[i % COLORS.length]} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Dashboard() {
  const { data: incidents = [], isLoading: loadInc } = useGetIncidentsQuery({}, { pollingInterval: 30000 });
  const { data: sentiments = [], isLoading: loadSent } = useGetSentimentsQuery({}, { pollingInterval: 30000 });
  const { data: rivalAds = [], isLoading: loadRival } = useGetRivalAdsQuery({}, { pollingInterval: 30000 });

  const { data: sentimentTrend, isLoading: loadSTrend } = useGetSentimentTrendQuery(30, { pollingInterval: 120000 });
  const { data: incidentTrend, isLoading: loadITrend } = useGetIncidentTrendQuery(30, { pollingInterval: 120000 });
  const { data: rivalLeaderboard, isLoading: loadRLeader } = useGetRivalLeaderboardQuery(30, { pollingInterval: 120000 });
  const { data: sourceActivity, isLoading: loadSActivity } = useGetSourceActivityQuery(30, { pollingInterval: 120000 });

  const highCount = incidents.filter((i) => i.severity === "high").length;
  const negCount = sentiments.filter((s) => s.label === "negative").length;
  const avgScore = sentiments.length
    ? (sentiments.reduce((a, s) => a + s.score, 0) / sentiments.length).toFixed(2)
    : "—";

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Live monitoring for Guardian Insurance news coverage</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Incidents</div>
          <div className="stat-value">{loadInc ? "…" : incidents.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">High Severity</div>
          <div className="stat-value" style={{ color: "var(--color-danger)" }}>{loadInc ? "…" : highCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Sentiment</div>
          <div className="stat-value" style={{ color: Number(avgScore) >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
            {loadSent ? "…" : avgScore}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Negative Articles</div>
          <div className="stat-value" style={{ color: "var(--color-warning)" }}>{loadSent ? "…" : negCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rival Ads Detected</div>
          <div className="stat-value">{loadRival ? "…" : rivalAds.length}</div>
        </div>
      </div>

      {/* ── Analytics charts from ClickHouse ── */}
      <div className="charts-row">
        <div className="card">
          <div className="card-header">30-Day Sentiment Trend</div>
          <div className="card-body">
            {loadSTrend ? <p className="loading">Loading…</p> : <SentimentTrendChart data={sentimentTrend} />}
          </div>
        </div>
        <div className="card">
          <div className="card-header">30-Day Incident Trend by Severity</div>
          <div className="card-body">
            {loadITrend ? <p className="loading">Loading…</p> : <IncidentTrendChart data={incidentTrend} />}
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-header">Rival Ad Leaderboard (30 Days)</div>
          <div className="card-body">
            {loadRLeader ? <p className="loading">Loading…</p> : <RivalLeaderboardChart data={rivalLeaderboard} />}
          </div>
        </div>
        <div className="card">
          <div className="card-header">Top Source Activity (30 Days)</div>
          <div className="card-body">
            {loadSActivity ? <p className="loading">Loading…</p> : <SourceActivityChart data={sourceActivity} />}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Recent Incidents</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Summary</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 10).map((inc) => (
                <tr key={inc.id}>
                  <td className="text-muted text-sm">{inc.article.source}</td>
                  <td><a href={inc.article.url} target="_blank" rel="noreferrer">{inc.article.title}</a></td>
                  <td><span className={`badge badge-${inc.severity}`}>{inc.severity}</span></td>
                  <td className="text-sm">{inc.summary}</td>
                  <td className="text-muted text-sm">{inc.created_at.slice(0, 10)}</td>
                </tr>
              ))}
              {!loadInc && incidents.length === 0 && (
                <tr><td colSpan={5} className="text-muted" style={{ textAlign: "center" }}>No incidents yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
