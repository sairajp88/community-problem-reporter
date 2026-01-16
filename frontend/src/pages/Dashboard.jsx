import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  if (user.role === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (user.role === "zone_manager" || user.role === "subzone_manager") {
    return <Navigate to="/dashboard/zone" replace />;
  }

  return <Navigate to="/dashboard/resident" replace />;
};

export default Dashboard;
