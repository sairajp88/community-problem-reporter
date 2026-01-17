import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import MapView from "../components/Map/MapView";
import ResidentPanel from "../components/panels/ResidentPanel";
import ReportIssueFAB from "../components/ui/ReportIssueFAB";
import ReportIssueModal from "../components/modals/ReportIssueModal";

const HEADER_HEIGHT = 56;

const AppShell = () => {
  const { user, logout } = useAuth();

  const [issues, setIssues] = useState([]);
  const [focusedIssue, setFocusedIssue] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLocation, setReportLocation] = useState(null);

  const fetchIssues = async () => {
    const res = await axios.get("http://localhost:5000/api/issues");
    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // 🔴 ROBUST FILTER (handles populated & non-populated createdBy)
  const myIssues = issues.filter((i) => {
    if (!i.createdBy) return false;

    if (typeof i.createdBy === "string") {
      return i.createdBy === user._id;
    }

    return i.createdBy._id === user._id;
  });

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

      {/* BODY */}
      <div
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          display: "flex",
          width: "100%",
          minHeight: 0,
        }}
      >
        {/* RESIDENT PANEL */}
        {user.role === "resident" && (
          <div
            style={{
              width: 320,
              height: "100%",
              borderRight: "1px solid #eee",
              flexShrink: 0,
            }}
          >
            <ResidentPanel
              issues={myIssues}
              onSelectIssue={setFocusedIssue}
            />
          </div>
        )}

        {/* MAP */}
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
            onMapClick={(coords) => setReportLocation(coords)}
          />

          {/* REPORT ISSUE */}
          {user.role === "resident" && (
            <>
              <ReportIssueFAB
                onClick={() => setShowReportModal(true)}
              />

              <ReportIssueModal
                open={showReportModal}
                location={reportLocation}
                onClose={() => setShowReportModal(false)}
                onCreated={() => {
                  // 🔴 delay ensures backend save + zone detection completed
                  setTimeout(fetchIssues, 300);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppShell;
