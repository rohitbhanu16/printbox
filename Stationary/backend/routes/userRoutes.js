const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { updateFcmToken } = require("../controllers/userController");

const router = express.Router();

router.put("/update-fcm", authMiddleware, updateFcmToken);

module.exports = router;
