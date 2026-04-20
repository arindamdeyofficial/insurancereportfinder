import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/authSlice";
import {
  useGetWebsitesQuery,
  useCreateWebsiteMutation,
  useToggleWebsiteMutation,
  useDeleteWebsiteMutation,
  useTriggerScrapeMutation,
} from "../api/websitesApi";
import { MultiSelect } from "../components/MultiSelect";

const LANGUAGES = [
  "english", "hindi", "bengali", "tamil", "telugu", "malayalam", "kannada",
  "marathi", "gujarati", "punjabi", "odia", "assamese", "urdu", "konkani",
  "nepali", "maithili", "manipuri", "mizo", "kashmiri",
];

const EMPTY_FORM = { name: "", url: "", rss_url: "", language: "english", is_active: true };

export function Scraping() {
  const user = useSelector(selectCurrentUser);
  const canEdit = user?.role === "admin" || user?.role === "analyst";

  const { data: websites = [], isLoading } = useGetWebsitesQuery(false);
  const [createWebsite, { isLoading: creating }] = useCreateWebsiteMutation();
  const [toggleWebsite] = useToggleWebsiteMutation();
  const [deleteWebsite] = useDeleteWebsiteMutation();
  const [triggerScrape, { isLoading: scraping }] = useTriggerScrapeMutation();

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [scrapeMsg, setScrapeMsg] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [langFilter, setLangFilter] = useState("all");

  const activeWebsites = websites.filter((w) => w.is_active);
  const multiOptions = activeWebsites.map((w) => ({
    value: w.id,
    label: `${w.name} (${w.language})`,
    badge: w.language,
  }));

  const allLanguages = [...new Set(websites.map((w) => w.language))].sort();
  const filtered = langFilter === "all" ? websites : websites.filter((w) => w.language === langFilter);
  const groupedByLang = allLanguages
    .filter((l) => langFilter === "all" || l === langFilter)
    .map((lang) => ({ lang, items: filtered.filter((w) => w.language === lang) }))
    .filter(({ items }) => items.length > 0);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await createWebsite(form).unwrap();
      setForm(EMPTY_FORM);
    } catch (err) {
      setFormError(err?.data?.detail || "Failed to add website");
    }
  };

  const handleScrape = async () => {
    setScrapeMsg("");
    try {
      const res = await triggerScrape(selectedIds).unwrap();
      setScrapeMsg(res.message);
    } catch {
      setScrapeMsg("Failed to trigger scrape.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Scraping</h1>
        <p>Manage news sources and trigger scraping jobs</p>
      </div>

      {/* ── Trigger scrape ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">Trigger Scrape</div>
        <div className="card-body" style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div className="form-label">Select active websites to scrape (leave empty = all active)</div>
            <MultiSelect
              options={multiOptions}
              value={selectedIds}
              onChange={setSelectedIds}
              placeholder="All active websites"
            />
          </div>
          <button className="btn btn-primary" onClick={handleScrape} disabled={scraping || !canEdit}>
            {scraping ? "Enqueueing…" : "Run Scrape Now"}
          </button>
        </div>
        {scrapeMsg && <div style={{ padding: "0 20px 16px", color: "var(--color-success)", fontSize: 13 }}>{scrapeMsg}</div>}
      </div>

      {/* ── Add website ── */}
      {canEdit && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">Add Website</div>
          <div className="card-body">
            {formError && <div className="error-msg">{formError}</div>}
            <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: 12, alignItems: "flex-end" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Times of India" required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Website URL</label>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://timesofindia.com" required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">RSS Feed URL</label>
                <input value={form.rss_url} onChange={(e) => setForm({ ...form, rss_url: e.target.value })} placeholder="https://…/rss.xml" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Language</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} style={{ width: 130 }}>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" type="submit" disabled={creating} style={{ marginBottom: 0 }}>
                {creating ? "Adding…" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Website list ── */}
      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Websites ({websites.length})</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["all", ...allLanguages].map((l) => (
              <button key={l} className={`btn btn-sm ${langFilter === l ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setLangFilter(l)} style={{ textTransform: "capitalize" }}>
                {l === "all" ? `All (${websites.length})` : l}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <p className="loading">Loading websites…</p>}

        {groupedByLang.map(({ lang, items }) => (
            <div key={lang}>
              <div style={{ padding: "8px 20px", background: "var(--color-bg)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--color-text-muted)", borderBottom: "1px solid var(--color-border)" }}>
                {lang} ({items.length})
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>URL</th>
                      <th>RSS Feed</th>
                      <th>Status</th>
                      {canEdit && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((site) => (
                      <tr key={site.id}>
                        <td style={{ fontWeight: 500 }}>{site.name}</td>
                        <td><a href={site.url} target="_blank" rel="noreferrer" className="text-sm">{site.url}</a></td>
                        <td className="text-sm text-muted">{site.rss_url || <span style={{ color: "var(--color-border)" }}>—</span>}</td>
                        <td>
                          <span className={`badge ${site.is_active ? "badge-positive" : "badge-neutral"}`}>
                            {site.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        {canEdit && (
                          <td style={{ display: "flex", gap: 6 }}>
                            <button
                              className={`btn btn-sm ${site.is_active ? "btn-secondary" : "btn-primary"}`}
                              onClick={() => toggleWebsite(site.id)}
                            >
                              {site.is_active ? "Deactivate" : "Activate"}
                            </button>
                            {user?.role === "admin" && (
                              <button className="btn btn-sm btn-danger" onClick={() => deleteWebsite(site.id)}>
                                Delete
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
