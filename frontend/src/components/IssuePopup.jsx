import { useEffect, useState } from "react";
import axios from "axios";

const IssuePopup = ({ issue, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!issue) return;

    const fetchComments = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/issues/${issue._id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(res.data);
    };

    fetchComments();
  }, [issue]);

  const submitComment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    await axios.post(
      `http://localhost:5000/api/issues/${issue._id}/comments`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setText("");
    setLoading(false);

    // Re-fetch comments
    const res = await axios.get(
      `http://localhost:5000/api/issues/${issue._id}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setComments(res.data);
  };

  if (!issue) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        width: 340,
        maxHeight: 420,
        overflowY: "auto",
        background: "white",
        padding: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        borderRadius: 6,
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{issue.title}</strong>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Meta */}
      <div style={{ fontSize: 13, marginTop: 6 }}>
        <strong>Status:</strong> {issue.status}
      </div>

      <div
        style={{
          marginTop: 6,
          display: "inline-block",
          padding: "4px 8px",
          background:
            issue.severity === "emergency" ? "#ff4d4d" : "#e0e0e0",
          color: issue.severity === "emergency" ? "white" : "black",
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        {issue.severity.toUpperCase()}
      </div>

      {/* Description */}
      <p style={{ marginTop: 8, fontSize: 14 }}>
        {issue.description}
      </p>

      {/* Comments */}
      <div style={{ marginTop: 12 }}>
        <strong>Comments</strong>

        {comments.length === 0 && (
          <p style={{ fontSize: 13, color: "#666" }}>
            No comments yet
          </p>
        )}

        {comments.map((c) => (
          <div
            key={c._id}
            style={{
              marginTop: 6,
              paddingBottom: 6,
              borderBottom: "1px solid #eee",
              fontSize: 13,
            }}
          >
            <strong>{c.user.name}</strong>
            <div>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Add comment */}
      <div style={{ marginTop: 10 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Add a comment..."
          style={{ width: "100%" }}
        />
        <button
          onClick={submitComment}
          disabled={loading}
          style={{ marginTop: 6 }}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
};

export default IssuePopup;
