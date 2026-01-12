import { useEffect, useState } from "react";
import axios from "axios";

const AdminZones = () => {
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({
    name: "",
    level: "city",
    parentZone: "",
    geometry: "",
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    const res = await axios.get("http://localhost:5000/api/zones");
    setZones(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      level: form.level,
      parentZone: form.parentZone || null,
      geometry: JSON.parse(form.geometry),
    };

    await axios.post("http://localhost:5000/api/zones", payload);

    setForm({
      name: "",
      level: "city",
      parentZone: "",
      geometry: "",
    });

    fetchZones();
    alert("Zone added");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Zone Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          name="name"
          placeholder="Zone name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select name="level" value={form.level} onChange={handleChange}>
          <option value="city">City</option>
          <option value="sector">Sector</option>
          <option value="area">Area</option>
          <option value="society">Society</option>
        </select>

        <select
          name="parentZone"
          value={form.parentZone}
          onChange={handleChange}
        >
          <option value="">No parent</option>
          {zones.map((z) => (
            <option key={z._id} value={z._id}>
              {z.name} ({z.level})
            </option>
          ))}
        </select>

        <textarea
          name="geometry"
          placeholder='GeoJSON geometry only (e.g. {"type":"Polygon","coordinates":[...]})'
          value={form.geometry}
          onChange={handleChange}
          rows={6}
          required
        />

        <button type="submit">Add Zone</button>
      </form>

      <h3>Existing Zones</h3>
      <ul>
        {zones.map((zone) => (
          <li key={zone._id}>
            {zone.name} — {zone.level}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminZones;
