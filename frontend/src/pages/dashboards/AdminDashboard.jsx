import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import SeverityBadge from "../../components/ui/SeverityBadge";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/issues", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIssues(res.data);
      } catch (err) {
        setError("Failed to load issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const updateStatus = async (issueId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/issues/${issueId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        <p className="text-gray-500">Loading issues…</p>
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
