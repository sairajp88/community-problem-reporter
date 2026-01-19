import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import MapView from "../components/Map/MapView";
import ResidentPanel from "../components/panels/ResidentPanel";
import AdminSidebar from "../components/sidebars/AdminSidebar";
import ZoneManagerSidebar from "../components/sidebars/ZoneManagerSidebar";
import ReportIssueModal from "../components/modals/ReportIssueModal"; // ✅ ensure this import exists

const HEADER_HEIGHT = 56;
const SIDEBAR_WIDTH = 320;

const AppShell = () => {
  const { user, logout } = useAuth();

  const [issues, setIssues] = useState([]);
  const [focusedIssue, setFocusedIssue] = useState(null);

  const [pinMode, setPinMode] = useState(false);
  const [draftLocation, setDraftLocation] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);

  const fetchIssues = async () => {
    const res = await axios.get("http://localhost:5000/api/issues");
    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const myIssues = issues.filter((i) => {
    if (!i.createdBy) return false;
    if (typeof i.createdBy === "string") return i.createdBy === user._id;
    return i.createdBy._id === user._id;
  });

  /* ---------- SIDEBAR SELECTOR ---------- */
  const renderSidebar = () => {
    if (user.role === "resident") {
      return (
        <ResidentPanel
          issues={myIssues}
          onSelectIssue={setFocusedIssue}
        />
      );
    }

    if (user.role === "admin") {
      return (
        <AdminSidebar
          issues={issues}
          onSelectIssue={setFocusedIssue}
        />
      );
    }

    if (user.role === "zone_manager") {
      return (
        <ZoneManagerSidebar
          issues={issues}
          onSelectIssue={setFocusedIssue}
        />
      );
    }

    return null;
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
          <span>{user.role.replace("_", " ")}</span>
          <button onClick={logout} style={{ color: "red" }}>
            Logout
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* LEFT SIDEBAR */}
        {renderSidebar() && (
          <div
            style={{
              width: SIDEBAR_WIDTH,
              borderRight: "1px solid #eee",
            }}
          >
            {renderSidebar()}
          </div>
        )}

        {/* MAP */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapView
            issues={issues}
            focusedIssue={focusedIssue}
            pinMode={pinMode}
            draftLocation={draftLocation}
            onMapClick={(coords) => {
              console.log("🟢 onMapClick received:", coords);
              setDraftLocation(coords);
              setShowReportModal(true);
            }}
          />

          {/* PIN BUTTON */}
          <button
            onClick={() => {
              console.log("🟢 TOGGLE PIN MODE");
              setPinMode((v) => !v);
              setDraftLocation(null);
              setShowReportModal(false);
            }}
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              zIndex: 100,
              padding: "14px 18px",
              borderRadius: 999,
              background: pinMode ? "#6b7280" : "#2563eb",
              color: "white",
              fontWeight: 500,
            }}
          >
            {pinMode ? "✕ Cancel Pin" : "📍 Drop Pin"}
          </button>

          {/* ✅ REPORT MODAL */}
          <ReportIssueModal
            open={showReportModal}
            location={draftLocation}
            onClose={() => {
              setShowReportModal(false);
              setPinMode(false);
              setDraftLocation(null);
            }}
            onCreated={() => {}}
            onIssueCreated={fetchIssues} // ✅ PHASE 5 FIX
          />
        </div>
      </div>
    </div>
  );
};

export default AppShell;
