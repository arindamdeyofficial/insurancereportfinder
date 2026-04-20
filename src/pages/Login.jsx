import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, useGetMeQuery } from "../api/authApi";
import { setCredentials } from "../store/slices/authSlice";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { access_token } = await login({ email, password }).unwrap();
      // store token first so RTK Query sends it in the /me request
      dispatch(setCredentials({ token: access_token, user: null }));
      const meResp = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!meResp.ok) throw new Error("Failed to fetch user profile");
      const user = await meResp.json();
      dispatch(setCredentials({ token: access_token, user }));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.data?.detail || err?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Insurance Report Finder</h1>
        <p className="login-subtitle">Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
