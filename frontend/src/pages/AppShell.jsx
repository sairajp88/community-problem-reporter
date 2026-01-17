import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import MapView from "../components/Map/MapView";
import ResidentPanel from "../components/panels/ResidentPanel";

const HEADER_HEIGHT = 56;

const AppShell = () => {
  const { user, logout } = useAuth();

  const [issues, setIssues] = useState([]);
  const [focusedIssue, setFocusedIssue] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      const res = await axios.get("http://localhost:5000/api/issues");
      setIssues(res.data);
    };

    fetchIssues();
  }, []);

  const handleSelectIssue = (issue) => {
    setFocusedIssue(issue);
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* TOP BAR */}
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

      {/* MAIN AREA */}
      <div
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          display: "flex",
          width: "100%",
        }}
      >
        {/* RESIDENT PANEL */}
        {user.role === "resident" && (
          <div style={{ width: 320 }}>
            <ResidentPanel
              issues={issues.filter(
                (i) => i.createdBy?._id === user._id
              )}
              onSelectIssue={handleSelectIssue}
            />
          </div>
        )}

        {/* MAP */}
        <div style={{ flex: 1 }}>
          <MapView
            issues={issues}
            focusedIssue={focusedIssue}
          />
        </div>
      </div>
    </div>
  );
};

export default AppShell;
