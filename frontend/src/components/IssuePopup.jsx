const IssuePopup = ({ issue, onClose }) => {
  if (!issue) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        width: 300,
        background: "white",
        padding: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        borderRadius: 6,
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{issue.title}</strong>
        <button onClick={onClose} style={{ cursor: "pointer" }}>
          ✕
        </button>
      </div>

      <p style={{ marginTop: 8, fontSize: 14 }}>
        {issue.description}
      </p>

      <div style={{ marginTop: 8, fontSize: 13 }}>
        <strong>Category:</strong> {issue.category}
      </div>

      <div style={{ marginTop: 4, fontSize: 13 }}>
        <strong>Status:</strong> {issue.status}
      </div>

      <div
        style={{
          marginTop: 8,
          padding: "4px 8px",
          display: "inline-block",
          background:
            issue.severity === "emergency" ? "#ff4d4d" : "#e0e0e0",
          color: issue.severity === "emergency" ? "white" : "black",
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        {issue.severity.toUpperCase()}
      </div>
    </div>
  );
};

export default IssuePopup;
