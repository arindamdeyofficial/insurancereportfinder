import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials, selectCurrentUser } from "../store/slices/authSlice";
import { useLogoutMutation } from "../api/authApi";

export function Layout({ children }) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* ── Left sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">Guardian Insurance</div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard"  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Dashboard</NavLink>
          <NavLink to="/incidents"  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Incidents</NavLink>
          <NavLink to="/sentiments" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Sentiment</NavLink>
          <NavLink to="/rival-ads"  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Rival Ads</NavLink>
          {(user?.role === "admin" || user?.role === "analyst") && (
            <NavLink to="/scraping" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Scraping</NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Admin</NavLink>
          )}
        </nav>
      </aside>

      {/* ── Right column: topbar + scrollable content ── */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-user">
            <div className="topbar-avatar">{user?.email?.[0]?.toUpperCase()}</div>
            <div className="topbar-info">
              <span className="topbar-email">{user?.email}</span>
              <span className="topbar-role">{user?.role}</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
