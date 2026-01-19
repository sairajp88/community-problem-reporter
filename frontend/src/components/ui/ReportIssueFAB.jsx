const ReportIssueFAB = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        bottom: 96,        // 🔑 move ABOVE cancel pin button
        right: 24,
        width: 56,
        height: 56,
        borderRadius: "50%",
        backgroundColor: "#2563eb",
        color: "white",
        fontSize: 28,
        boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
        zIndex: 200,       // 🔑 higher than cancel pin button
        cursor: "pointer",
      }}
      title="Create Issue"
    >
      +
    </button>
  );
};

export default ReportIssueFAB;
