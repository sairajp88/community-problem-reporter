import MapView from "../components/Map/Mapview";

const Home = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <h1 style={{ textAlign: "center", padding: "10px" }}>
        Community Problem Reporter
      </h1>

      <div
        id="map"
        style={{
          width: "100%",
          height: "90vh",
          border: "2px solid red",
        }}
      ></div>

      <MapView />
    </div>
  );
};

export default Home;
