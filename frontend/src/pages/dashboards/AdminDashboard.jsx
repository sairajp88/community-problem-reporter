import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import SeverityBadge from "../../components/ui/SeverityBadge";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [zoneManagers, setZoneManagers] = useState([]);
  const [zones, setZones] = useState([]);

  const [selectedManager, setSelectedManager] = useState("");
  const [selectedZones, setSelectedZones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [issuesRes, usersRes, zonesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/issues", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/zones", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setIssues(issuesRes.data);
        setZoneManagers(
          usersRes.data.filter(
            (u) => u.role === "zone_manager"
          )
        );
        setZones(zonesRes.data);
      } catch (err) {
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ---------- ASSIGN ZONES ---------- */
  const assignZones = async () => {
    if (!selectedManager) {
      alert("Select a zone manager");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/users/${selectedManager}/assign-zones`,
        { zoneIds: selectedZones },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Zones assigned successfully");
      setSelectedZones([]);
    } catch {
      alert("Failed to assign zones");
    }
  };

  /* ---------- ISSUE STATUS ---------- */
  const updateStatus = async (issueId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/issues/${issueId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId
            ? { ...issue, status: newStatus }
            : issue
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <p className="text-gray-500">Loading…</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <p className="text-red-600">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* 🔵 ZONE ASSIGNMENT */}
      <div className="mb-8 p-4 border rounded bg-white">
        <h2 className="text-lg font-semibold mb-3">
          Assign Zones to Zone Manager
        </h2>

        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
          className="border p-2 mb-3 w-full"
        >
          <option value="">Select Zone Manager</option>
          {zoneManagers.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <div className="max-h-40 overflow-y-auto border p-2 mb-3">
          {zones.map((zone) => (
            <label
              key={zone._id}
              className="flex items-center gap-2 mb-1"
            >
              <input
                type="checkbox"
                checked={selectedZones.includes(zone._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedZones((prev) => [
                      ...prev,
                      zone._id,
                    ]);
                  } else {
                    setSelectedZones((prev) =>
                      prev.filter((id) => id !== zone._id)
                    );
                  }
                }}
              />
              {zone.name}
            </label>
          ))}
        </div>

        <button
          onClick={assignZones}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Assign Zones
        </button>
      </div>

      {/* 🔵 ISSUES TABLE (EXISTING FUNCTIONALITY) */}
      {issues.length === 0 ? (
        <p className="text-gray-500">No issues found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Severity</th>
                <th className="p-3 border-b">Zone</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{issue.title}</td>

                  <td className="p-3 border-b">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={issue.status} />
                      <select
                        value={issue.status}
                        onChange={(e) =>
                          updateStatus(issue._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="open">open</option>
                        <option value="in-progress">in-progress</option>
                        <option value="resolved">resolved</option>
                      </select>
                    </div>
                  </td>

                  <td className="p-3 border-b">
                    <SeverityBadge severity={issue.severity} />
                  </td>

                  <td className="p-3 border-b">
                    {issue.zone?.name || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
