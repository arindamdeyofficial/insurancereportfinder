import { useState } from "react";
import { useGetSentimentsQuery } from "../api/sentimentsApi";
import { SentimentChart } from "../components/charts/SentimentChart";

export function Sentiments() {
  const [label, setLabel] = useState("");
  const { data: sentiments = [], isLoading, isError } = useGetSentimentsQuery(
    { limit: 100, label: label || undefined },
    { pollingInterval: 30000 }
  );

  return (
    <div>
      <div className="page-header">
        <h1>Sentiment Analysis</h1>
        <p>Public sentiment toward Guardian Insurance across news sources</p>
      </div>

      <div className="charts-row" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">Sentiment Distribution</div>
          <div className="card-body">
            <SentimentChart data={sentiments} />
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <select value={label} onChange={(e) => setLabel(e.target.value)}>
          <option value="">All sentiments</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>

      <div className="card">
        {isLoading && <p className="loading">Loading sentiments…</p>}
        {isError && <p className="error-msg">Failed to load sentiments.</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Title</th>
                <th>Score</th>
                <th>Label</th>
                <th>Reasoning</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sentiments.map((s) => (
                <tr key={s.id}>
                  <td className="text-muted text-sm">{s.article.source}</td>
                  <td><a href={s.article.url} target="_blank" rel="noreferrer">{s.article.title}</a></td>
                  <td style={{ fontWeight: 600, color: s.score >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                    {s.score.toFixed(2)}
                  </td>
                  <td><span className={`badge badge-${s.label}`}>{s.label}</span></td>
                  <td className="text-sm">{s.reasoning}</td>
                  <td className="text-muted text-sm">{s.created_at.slice(0, 10)}</td>
                </tr>
              ))}
              {!isLoading && sentiments.length === 0 && (
                <tr><td colSpan={6} className="text-muted" style={{ textAlign: "center", padding: 24 }}>No sentiment data found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
