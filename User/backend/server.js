const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const { setupWebSocket } = require("./websocket");
const passport = require("passport");
require("./middleware/googleAuth");
require("./middleware/githubAuth");

dotenv.config();

// Create Express App & HTTP Server
const app = express();
const httpServer = require("http").createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// API Routes
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const stationaryRoutes = require("./routes/stationaryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stationary", stationaryRoutes);
app.use("/api/uploads", uploadRoutes);


// ✅ Setup WebSockets
setupWebSocket(httpServer);

// Start the Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
