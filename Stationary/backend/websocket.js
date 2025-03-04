const { Server } = require("socket.io");

let io;

const setupWebSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 User Connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      console.log(`User ${userId} joined room`);
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User Disconnected: ${socket.id}`);
    });
  });

  return { io, notifyUser };
};

const notifyUser = (userId, event, data) => {
  if (!io) {
    console.error("WebSocket server not initialized");
    return;
  }

  if (!userId) {
    console.error("❌ Cannot send notification: userId is undefined");
    return;
  }

  console.log(`📩 Notifying User ${userId}: Event ${event}`);
  io.to(userId.toString()).emit(event, data);
};


module.exports = { setupWebSocket, notifyUser };
