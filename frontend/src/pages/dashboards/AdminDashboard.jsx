import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
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

  if (loading) return <p>Loading issues...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {issues.length === 0 ? (
        <p>No issues found</p>
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

                <td>{issue.zone?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
