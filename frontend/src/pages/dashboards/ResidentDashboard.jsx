import { useEffect, useState } from "react";
import axios from "axios";
import IssuePopup from "../../components/IssuePopup";

const ResidentDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/issues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIssues(res.data);
      setLoading(false);
    };

    fetchIssues();
  }, []);

  if (loading) return <p>Loading your issues...</p>;

  return (
    <div style={{ padding: 20, position: "relative" }}>
      <h2>My Reported Issues</h2>

      {issues.length === 0 ? (
        <p>You have not reported any issues yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            marginTop: 20,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th align="left">Title</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.title}</td>

                <td>{issue.status}</td>

                <td
                  style={{
                    color:
                      issue.severity === "emergency" ? "red" : "black",
                    fontWeight:
                      issue.severity === "emergency" ? "bold" : "normal",
                  }}
                >
                  {issue.severity}
                </td>

                <td>
                  <button onClick={() => setSelectedIssue(issue)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Issue Popup */}
      {selectedIssue && (
        <IssuePopup
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};

export default ResidentDashboard;
