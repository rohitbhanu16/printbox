const { io } = require('../server'); // Import WebSocket instance

// Notify a specific user
const notifyUser = (userName, event, data) => {
  const userSocketId = global.connectedUsers[userName]; // Map of connected users by username
  if (userSocketId) {
    io.to(userSocketId).emit(event, data);
    console.log(`Notified user ${userName}:`, data);
  } else {
    console.log(`User ${userName} is not connected.`);
  }
};

// Notify all connected clients (optional)
const notifyAll = (event, data) => {
  io.emit(event, data);
};

module.exports = { notifyUser, notifyAll };
