import { useState } from "react";
import { useGetIncidentsQuery } from "../api/incidentsApi";

export function Incidents() {
  const [severity, setSeverity] = useState("");
  const { data: incidents = [], isLoading, isError } = useGetIncidentsQuery(
    { limit: 100, severity: severity || undefined },
    { pollingInterval: 30000 }
  );

  return (
    <div>
      <div className="page-header">
        <h1>Incidents</h1>
        <p>Articles reporting incidents involving Guardian Insurance</p>
      </div>

      <div className="filters-bar">
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">All severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="card">
        {isLoading && <p className="loading">Loading incidents…</p>}
        {isError && <p className="error-msg">Failed to load incidents.</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Summary</th>
                <th>Published</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id}>
                  <td className="text-muted text-sm">{inc.article.source}</td>
                  <td><a href={inc.article.url} target="_blank" rel="noreferrer">{inc.article.title}</a></td>
                  <td><span className={`badge badge-${inc.severity}`}>{inc.severity}</span></td>
                  <td className="text-sm">{inc.summary}</td>
                  <td className="text-muted text-sm">{(inc.article.published_at || inc.created_at).slice(0, 10)}</td>
                </tr>
              ))}
              {!isLoading && incidents.length === 0 && (
                <tr><td colSpan={5} className="text-muted" style={{ textAlign: "center", padding: 24 }}>No incidents found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
