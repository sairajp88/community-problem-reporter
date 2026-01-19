const ZoneManagerSidebar = ({ issues = [] }) => {
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
        <strong>Issues in your zones:</strong> {issues.length}
      </div>

      <ul style={{ fontSize: 14 }}>
        {issues.slice(0, 5).map((issue) => (
          <li key={issue._id} style={{ marginBottom: 8 }}>
            • {issue.title}
          </li>
        ))}
      </ul>

      {issues.length > 5 && (
        <p style={{ fontSize: 12, color: "#666" }}>
          Showing first 5 issues
        </p>
      )}
    </div>
  );
};

export default ZoneManagerSidebar;
