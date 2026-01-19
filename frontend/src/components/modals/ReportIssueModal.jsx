import { useState } from "react";
import axios from "axios";

const ReportIssueModal = ({
  open,
  onClose,
  onCreated,
  onIssueCreated, // ✅ NEW CALLBACK
  location,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [severity, setSeverity] = useState("normal");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!title || !description) return;

    if (!location) {
      alert("Please click on the map to select a location");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("category", category);
      form.append("severity", severity);
      form.append("latitude", location.latitude);
      form.append("longitude", location.longitude);

      await axios.post("http://localhost:5000/api/issues", form);

      // ✅ PHASE 5 FIX — trigger re-fetch in AppShell
      onIssueCreated?.();

      onClose();
      onCreated?.();
    } catch {
      alert("Failed to create issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: 360,
          background: "white",
          padding: 20,
          borderRadius: 8,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Report Issue</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <textarea
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <option value="general">General</option>
          <option value="roads">Roads</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
        </select>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <option value="normal">Normal</option>
          <option value="emergency">Emergency</option>
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Posting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;
