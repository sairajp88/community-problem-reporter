const ZoneManagerSidebar = ({ issues = [], onSelectIssue }) => {
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
        Zone Dashboard
      </h3>

      <div style={{ marginBottom: 12 }}>
        <strong>Active Issues:</strong> {openIssues.length}
      </div>

      <hr style={{ margin: "12px 0" }} />

      <ul style={{ fontSize: 14 }}>
        {openIssues.map((issue) => (
          <li
            key={issue._id}
            style={{
              marginBottom: 8,
              cursor: "pointer",
            }}
            onClick={() => onSelectIssue?.(issue)}
          >
            • {issue.title}
          </li>
        ))}
      </ul>

      {openIssues.length === 0 && (
        <p style={{ fontSize: 13, color: "#666" }}>
          No active issues in your zones
        </p>
      )}
    </div>
  );
};

export default ZoneManagerSidebar;
