import Home from "./pages/Home";
import AdminZones from "./pages/AdminZones";

function App() {
  const isAdmin = true; // temporary flag

  return isAdmin ? <AdminZones /> : <Home />;
}

export default App;
