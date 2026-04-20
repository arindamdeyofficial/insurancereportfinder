import { useState } from "react";
import { useGetUsersQuery, useCreateUserMutation, useTriggerScrapeMutation } from "../api/adminApi";

export function Admin() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [triggerScrape, { isLoading: scraping }] = useTriggerScrapeMutation();

  const [form, setForm] = useState({ email: "", password: "", role: "viewer" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      await createUser(form).unwrap();
      setFormSuccess(`User ${form.email} created.`);
      setForm({ email: "", password: "", role: "viewer" });
    } catch (err) {
      setFormError(err?.data?.detail || "Failed to create user.");
    }
  };

  const handleScrape = async () => {
    await triggerScrape();
    alert("Scrape job enqueued. Results will appear shortly.");
  };

  return (
    <div>
      <div className="page-header">
        <h1>Admin</h1>
        <p>User management and manual controls</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">Create User</div>
          <div className="card-body">
            {formError && <div className="error-msg">{formError}</div>}
            {formSuccess && <div style={{ color: "var(--color-success)", marginBottom: 12 }}>{formSuccess}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="viewer">Viewer</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit">Create User</button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Manual Scrape</div>
          <div className="card-body">
            <p className="text-muted" style={{ marginBottom: 16 }}>
              Trigger a manual news scrape outside the scheduled 30-minute cycle.
            </p>
            <button className="btn btn-secondary" onClick={handleScrape} disabled={scraping}>
              {scraping ? "Enqueueing…" : "Trigger Scrape Now"}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Users</div>
        {isLoading && <p className="loading">Loading users…</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="text-muted text-sm">{u.id}</td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-neutral">{u.role}</span></td>
                  <td className="text-muted text-sm">{u.created_at?.slice(0, 10) || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
