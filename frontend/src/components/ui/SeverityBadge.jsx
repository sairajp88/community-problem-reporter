const SeverityBadge = ({ severity }) => {
  return (
    <span
      className={`px-2 py-1 rounded text-sm ${
        severity === "emergency"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {severity}
    </span>
  );
};

export default SeverityBadge;
