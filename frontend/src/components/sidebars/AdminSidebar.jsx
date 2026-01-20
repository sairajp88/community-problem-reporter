import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ issues = [], onSelectIssue }) => {
  const navigate = useNavigate();

  const emergencyIssues = issues.filter(
    (i) => i.severity === "emergency"
  );

  const openIssues = issues.filter(
    (i) => i.status !== "resolved"
  );

  return (
    <div
      style={{
        width: 320,
        height: "100%",
        borderRight: "1px solid #eee",
        padding: 16,
        background: "#fafafa",
        overflowY: "auto",
      }}
    >
      {/* HEADER */}
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>
        Admin Overview
      </h3>

      {/* 🔵 NAVIGATION TO ADMIN DASHBOARD */}
      <button
        onClick={() => navigate("/app/admin")}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: 16,
          background: "#2563eb",
          color: "white",
          borderRadius: 6,
          fontWeight: 500,
          border: "none",
          cursor: "pointer",
        }}
      >
        Manage Zones & Issues
      </button>

      {/* STATS */}
      <div style={{ marginBottom: 16 }}>
        <div>
          <strong>Total Issues:</strong> {issues.length}
        </div>
        <div>
          <strong>Open Issues:</strong> {openIssues.length}
        </div>
        <div style={{ color: "#dc2626" }}>
          <strong>Emergency:</strong> {emergencyIssues.length}
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      {/* EMERGENCY LIST */}
      <h4 style={{ marginBottom: 8, color: "#dc2626" }}>
        Emergency Issues
      </h4>

      {emergencyIssues.length === 0 && (
        <p style={{ fontSize: 13, color: "#666" }}>
          No emergency issues 🎉
        </p>
      )}

      <ul style={{ fontSize: 14, paddingLeft: 16 }}>
        {emergencyIssues.map((issue) => (
          <li
            key={issue._id}
            style={{
              marginBottom: 8,
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => onSelectIssue?.(issue)}
          >
            {issue.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
