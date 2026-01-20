import express from "express";
import cors from "cors";

import zoneRoutes from "./routes/zoneRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});
app.use("/api/users", userRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

export default app;
