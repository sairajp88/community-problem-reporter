import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import SeverityBadge from "../../components/ui/SeverityBadge";
import IssuePopup from "../../components/IssuePopup";

const ResidentDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

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
      } catch {
        setError("Failed to load your issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Issues">
        <p className="text-gray-500">Loading your issues…</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="My Issues">
        <p className="text-red-600">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Issues">
      {issues.length === 0 ? (
        <p className="text-gray-500">
          You haven’t reported any issues yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Severity</th>
                <th className="p-3 border-b">Action</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{issue.title}</td>

                  <td className="p-3 border-b">
                    <StatusBadge status={issue.status} />
                  </td>

                  <td className="p-3 border-b">
                    <SeverityBadge severity={issue.severity} />
                  </td>

                  <td className="p-3 border-b">
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedIssue && (
        <IssuePopup
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default ResidentDashboard;
