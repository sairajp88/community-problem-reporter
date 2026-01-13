const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// 🔥 Zone APIs
app.use("/api/zones", require("./routes/zoneRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
