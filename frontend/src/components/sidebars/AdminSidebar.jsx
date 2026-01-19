const AdminSidebar = ({ issues = [], onSelectIssue }) => {
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
      <h3 style={{ fontWeight: 600, marginBottom: 16 }}>
        Admin Overview
      </h3>

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

      <ul style={{ fontSize: 14 }}>
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
