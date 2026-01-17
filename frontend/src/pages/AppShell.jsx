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

  // 🟦 PHASE 2 STATE
  const [pinMode, setPinMode] = useState(false);
  const [draftPin, setDraftPin] = useState(null);

  const fetchIssues = async () => {
    const res = await axios.get("http://localhost:5000/api/issues");
    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Resident’s own issues (robust)
  const myIssues = issues.filter((i) => {
    if (!i.createdBy) return false;
    if (typeof i.createdBy === "string") return i.createdBy === user._id;
    return i.createdBy._id === user._id;
  });

  // 🗺️ MAP CLICK HANDLER (PIN MODE ONLY)
  const handleMapClick = (coords) => {
    if (!pinMode) return;
    setDraftPin(coords);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      {/* 🔹 HEADER */}
      <div
        style={{
          height: HEADER_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #ddd",
          background: "#fff",
          flexShrink: 0,
        }}
      >
        <strong>Community Problem Reporter</strong>

        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ textTransform: "capitalize" }}>
            {user.role.replace("_", " ")}
          </span>
          <button onClick={logout} style={{ color: "red" }}>
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 BODY */}
      <div
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          display: "flex",
          width: "100%",
          minHeight: 0,
        }}
      >
        {/* 👤 RESIDENT PANEL */}
        {user.role === "resident" && (
          <div
            style={{
              width: 320,
              height: "100%",
              borderRight: "1px solid #eee",
              flexShrink: 0,
              overflowY: "auto",
            }}
          >
            <ResidentPanel
              issues={myIssues}
              onSelectIssue={setFocusedIssue}
            />
          </div>
        )}

        {/* 🗺 MAP AREA */}
        <div
          style={{
            flex: 1,
            position: "relative",
            height: "100%",
            minHeight: 0,
          }}
        >
          <MapView
            issues={issues}
            focusedIssue={focusedIssue}
            pinMode={pinMode}
            draftPin={draftPin}
            onMapClick={handleMapClick}
          />

          {/* 📍 PIN CONTROLS */}
          {user.role === "resident" && (
            <div
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                zIndex: 50,
              }}
            >
              {!pinMode ? (
                <button
                  onClick={() => {
                    setPinMode(true);
                    setDraftPin(null);
                  }}
                  style={{
                    padding: "12px 16px",
                    background: "#2563eb",
                    color: "white",
                    borderRadius: 999,
                  }}
                >
                  📍 Drop Pin
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPinMode(false);
                    setDraftPin(null);
                  }}
                  style={{
                    padding: "12px 16px",
                    background: "#6b7280",
                    color: "white",
                    borderRadius: 999,
                  }}
                >
                  ✕ Cancel Pin
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppShell;
