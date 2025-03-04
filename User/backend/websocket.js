const { Server } = require("socket.io");

let io; // ✅ Store io globally

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
      console.log(`🏠 User ${userId} joined WebSocket room`);
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User Disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if(!io) {
    throw new Error("Websocket server not initialized");
  }
  return io;
}

// ✅ Function to Notify User via WebSocket
const notifyUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
  } else {
    console.error("❌ WebSocket Server Not Initialized");
  }
};

// ✅ Function to Notify Stationary via WebSocket
const notifyStationary = (stationaryId, event, data) => {
  if (io) {
    const clients = io.sockets.adapter.rooms.get(stationaryId);

    if (clients && clients.size > 0) {
      console.log(`✅ Sending ${event} to Stationary ${stationaryId}`, data);
      io.to(stationaryId).emit(event, data);
    } else {
      console.error(`❌ No clients in room ${stationaryId}. Notification not sent.`);
    }
  } else {
    console.error("❌ WebSocket Server Not Initialized");
  }
};

module.exports = { setupWebSocket, notifyUser, notifyStationary, getIO };
