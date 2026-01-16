import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import socketAuth from "./socket/socketAuth.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.use(socketAuth);

io.on("connection", (socket) => {
  const user = socket.user;

  console.log("🔌 Socket connected:", socket.id, user.name);

  // Join personal room
  socket.join(`user:${user._id}`);

  // Join zone rooms
  if (user.zones && user.zones.length > 0) {
    user.zones.forEach((zone) => {
      socket.join(`zone:${zone._id}`);
    });
  }

  // Admin room
  if (user.role === "admin") {
    socket.join("admin");
  }

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
