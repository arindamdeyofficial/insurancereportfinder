import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "./store/slices/authSlice";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Incidents } from "./pages/Incidents";
import { Sentiments } from "./pages/Sentiments";
import { RivalAds } from "./pages/RivalAds";
import { Scraping } from "./pages/Scraping";
import { Admin } from "./pages/Admin";

function AppRoutes() {
  const token = useSelector(selectCurrentToken);
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout><Dashboard /></Layout>} path="/dashboard" />
        <Route element={<Layout><Incidents /></Layout>} path="/incidents" />
        <Route element={<Layout><Sentiments /></Layout>} path="/sentiments" />
        <Route element={<Layout><RivalAds /></Layout>} path="/rival-ads" />
        <Route element={<ProtectedRoute requiredRoles={["admin", "analyst"]} />}>
          <Route element={<Layout><Scraping /></Layout>} path="/scraping" />
        </Route>
        <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
          <Route element={<Layout><Admin /></Layout>} path="/admin" />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default AppRoutes;
