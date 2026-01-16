import { useEffect, useState } from "react";
import axios from "axios";
import MapView from "../components/Map/MapView";
import socket from "../socket";

const Home = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/issues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIssues(res.data);
    };

    fetchIssues();

    // 🔌 CONNECT SOCKET
    socket.connect();

    // 🔔 New issue
    socket.on("issue:new", (issue) => {
      setIssues((prev) => [...prev, issue]);
    });

    // 🚨 Emergency issue
    socket.on("issue:emergency", (issue) => {
      alert("🚨 Emergency issue reported!");
      setIssues((prev) => [...prev, issue]);
    });

    // 🔄 Status update
    socket.on("issue:status", ({ issueId, status }) => {
      setIssues((prev) =>
        prev.map((i) =>
          i._id === issueId ? { ...i, status } : i
        )
      );
    });

    return () => {
      socket.off("issue:new");
      socket.off("issue:emergency");
      socket.off("issue:status");
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <h1 style={{ textAlign: "center", padding: "10px" }}>
        Community Problem Reporter
      </h1>

      <div style={{ width: "100%", height: "90vh" }}>
        <MapView issues={issues} />
      </div>
    </div>
  );
};

export default Home;
