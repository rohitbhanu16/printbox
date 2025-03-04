const express = require("express");
const { getOrders, markOrderReady } = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get Orders for a Stationary
router.get("/", authenticateToken, getOrders);


// ✅ Mark Order as Ready
router.put("/:id/ready", markOrderReady);

module.exports = router;
