import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AdminDashboard from "./dashboards/AdminDashboard";
import ZoneDashboard from "./dashboards/ZoneDashboard";
import ResidentDashboard from "./dashboards/ResidentDashboard";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  return (
    <Routes>
      {/* Admin */}
      {user.role === "admin" && (
        <>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="admin" replace />} />
        </>
      )}

      {/* Zone Manager */}
      {(user.role === "zone_manager" ||
        user.role === "subzone_manager") && (
        <>
          <Route path="zone" element={<ZoneDashboard />} />
          <Route path="*" element={<Navigate to="zone" replace />} />
        </>
      )}

      {/* Resident */}
      {user.role === "resident" && (
        <>
          <Route path="resident" element={<ResidentDashboard />} />
          <Route path="*" element={<Navigate to="resident" replace />} />
        </>
      )}
    </Routes>
  );
};

export default Dashboard;
