const AdminSidebar = ({ issues = [] }) => {
  const total = issues.length;
  const emergency = issues.filter(
    (i) => i.severity === "emergency"
  ).length;

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

      <div style={{ marginBottom: 12 }}>
        <strong>Total Issues:</strong> {total}
      </div>

      <div style={{ marginBottom: 12, color: "#dc2626" }}>
        <strong>Emergency Issues:</strong> {emergency}
      </div>

      <hr style={{ margin: "16px 0" }} />

      <p style={{ fontSize: 14, color: "#555" }}>
        Detailed controls will be added in later phases.
      </p>
    </div>
  );
};

export default AdminSidebar;
