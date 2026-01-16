// import { useEffect, useState } from "react";
// import axios from "axios";
// import MapView from "../components/Map/MapView";

// const Home = () => {
//   const [issues, setIssues] = useState([]);

//   useEffect(() => {
//     const fetchIssues = async () => {
//       const token = localStorage.getItem("token");

//       const res = await axios.get("http://localhost:5000/api/issues", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setIssues(res.data);
//     };

//     fetchIssues();
//   }, []);

//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <h1 style={{ textAlign: "center", padding: "10px" }}>
//         Community Problem Reporter
//       </h1>

//       <div
//         id="map"
//         style={{
//           width: "100%",
//           height: "90vh",
//           border: "2px solid red",
//         }}
//       ></div>

//       <MapView issues={issues} />
//     </div>
//   );
// };

// export default Home;

import { useEffect, useState } from "react";
import axios from "axios";
import MapView from "../components/Map/MapView";

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
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <h1 style={{ textAlign: "center", padding: "10px" }}>
        Community Problem Reporter
      </h1>

      {/* MAP LIVES INSIDE MapView ONLY */}
      <div style={{ width: "100%", height: "90vh" }}>
        <MapView issues={issues} />
      </div>
    </div>
  );
};

export default Home;
