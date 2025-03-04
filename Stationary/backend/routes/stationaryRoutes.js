const express = require("express");
const { getStationaryDetails, updateStationaryProfile} = require("../controllers/stationaryController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/update", authenticateToken, updateStationaryProfile);

router.get("/profile/:id", getStationaryDetails)

module.exports = router;
