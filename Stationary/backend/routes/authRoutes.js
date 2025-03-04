const express = require("express");
const { register, loginStationary } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", loginStationary);

module.exports = router;