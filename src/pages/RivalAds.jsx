import { useState } from "react";
import { useGetRivalAdsQuery } from "../api/rivalAdsApi";

export function RivalAds() {
  const [competitor, setCompetitor] = useState("");
  const { data: rivalAds = [], isLoading, isError } = useGetRivalAdsQuery(
    { limit: 100, competitor: competitor || undefined },
    { pollingInterval: 30000 }
  );

  const competitors = [...new Set(rivalAds.map((r) => r.competitor_name))].sort();

  return (
    <div>
      <div className="page-header">
        <h1>Rival Advertisements</h1>
        <p>Competitor insurance company advertisement campaigns detected in news</p>
      </div>

      <div className="filters-bar">
        <select value={competitor} onChange={(e) => setCompetitor(e.target.value)}>
          <option value="">All competitors</option>
          {competitors.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="card">
        {isLoading && <p className="loading">Loading rival ads…</p>}
        {isError && <p className="error-msg">Failed to load rival ads.</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Title</th>
                <th>Competitor</th>
                <th>Campaign Summary</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rivalAds.map((r) => (
                <tr key={r.id}>
                  <td className="text-muted text-sm">{r.article.source}</td>
                  <td><a href={r.article.url} target="_blank" rel="noreferrer">{r.article.title}</a></td>
                  <td><span className="badge badge-neutral">{r.competitor_name}</span></td>
                  <td className="text-sm">{r.ad_summary}</td>
                  <td className="text-muted text-sm">{r.created_at.slice(0, 10)}</td>
                </tr>
              ))}
              {!isLoading && rivalAds.length === 0 && (
                <tr><td colSpan={5} className="text-muted" style={{ textAlign: "center", padding: 24 }}>No rival ads detected yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
