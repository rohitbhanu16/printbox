const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

connectDB();

const server = http.createServer(app);

// ✅ WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 WebSocket Connected:", socket.id);

  // ✅ Handle Joining Rooms
  socket.on("joinRoom", (stationaryId, callback) => {
    socket.join(stationaryId);
    console.log(`🏠 Stationary ${stationaryId} joined WebSocket room`);
    
    // ✅ Log current clients in room
    const clients = io.sockets.adapter.rooms.get(stationaryId);
    console.log(`👥 Clients in Room ${stationaryId}:`, clients ? [...clients] : "No clients");

    // Send acknowledgment to frontend
    if (callback) callback(`Joined room ${stationaryId}`);
  });

  // ✅ Handle Getting Active Rooms
  socket.on("getRooms", () => {
    const rooms = io.sockets.adapter.rooms;
    console.log("📌 Active Rooms:", rooms);
    socket.emit("roomList", [...rooms.keys()]);
  });

  // ✅ Handle Order Notifications
  socket.on("newOrder", (order) => {
    console.log("📩 New Order Received:", order);
    io.to(order.stationary.toString()).emit("orderNotification", order); // ✅ Notify stationaries
  });

  socket.on("disconnect", () => {
    console.log("🔴 WebSocket Disconnected:", socket.id);
  });
});

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const stationaryRoutes = require("./routes/stationaryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stationary", stationaryRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
