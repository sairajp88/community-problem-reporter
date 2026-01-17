import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import MapView from "../components/Map/MapView";

const HEADER_HEIGHT = 56; // px

const AppShell = () => {
  const { user, logout } = useAuth();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const res = await axios.get("http://localhost:5000/api/issues");
      setIssues(res.data);
    };
    fetchIssues();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* HEADER */}
      <div
        style={{
          height: HEADER_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #ddd",
          background: "#fff",
        }}
      >
        <strong>Community Problem Reporter</strong>

        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontSize: 14, textTransform: "capitalize" }}>
            {user.role.replace("_", " ")}
          </span>
          <button onClick={logout} style={{ color: "red" }}>
            Logout
          </button>
        </div>
      </div>

      {/* MAP AREA (🔥 EXPLICIT HEIGHT) */}
      <div
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          width: "100%",
          position: "relative",
        }}
      >
        <MapView issues={issues} />
      </div>
    </div>
  );
};

export default AppShell;
