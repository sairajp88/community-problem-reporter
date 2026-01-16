import { useEffect, useState } from "react";
import axios from "axios";

const ZoneDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading zone issues...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Zone Manager Dashboard</h2>

      {issues.length === 0 ? (
        <p>No issues in your zones</p>
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
              <th>Zone</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.title}</td>

                <td>
                  <select
                    value={issue.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const token = localStorage.getItem("token");

                      await axios.put(
                        `http://localhost:5000/api/issues/${issue._id}/status`,
                        { status: newStatus },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      setIssues((prev) =>
                        prev.map((i) =>
                          i._id === issue._id
                            ? { ...i, status: newStatus }
                            : i
                        )
                      );
                    }}
                  >
                    <option value="open">open</option>
                    <option value="in-progress">in-progress</option>
                    <option value="resolved">resolved</option>
                  </select>
                </td>

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

                <td>{issue.zone?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ZoneDashboard;
