import { useEffect, useState } from "react";
import axios from "axios";
import MapView from "../components/Map/MapView";
import { Link } from "react-router-dom";

const Home = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/issues").then((res) => {
      setIssues(res.data);
    });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-3 bg-white shadow">
        <h1 className="font-semibold text-lg">
          Community Problem Reporter
        </h1>

        <div className="space-x-4">
          <Link to="/login" className="text-blue-600">Login</Link>
          <Link to="/signup" className="text-blue-600">Signup</Link>
        </div>
      </header>

      {/* Map */}
      <div className="flex-1">
        <MapView issues={issues} />
      </div>
    </div>
  );
};

export default Home;
