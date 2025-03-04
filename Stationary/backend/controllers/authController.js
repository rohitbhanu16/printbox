const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Stationary = require('../models/Stationary');

exports.register = async (req, res) => {
  try {
    console.log("📨 Incoming Signup Request:", req.body); // ✅ Debugging log

    const { shopName, ownerName, address, phone, email, password } = req.body;

    // ✅ Ensure phone is provided
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const stationary = await Stationary.create({
      shopName,
      ownerName,
      address,
      phone, // ✅ Ensure phone is saved in DB
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Registered successfully", stationary });

  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginStationary = async (req, res) => {
  try {
    const { email, password } = req.body;
    const stationary = await Stationary.findOne({ email });
    if(!stationary || !(await bcrypt.compare(password, stationary.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: stationary._id}, process.env.JWT_SECRET, { expiresIn: "15d" });

    res.json({
      token,
      stationary: {
        _id: stationary._id,
        shopName: stationary.shopName,
        ownerName: stationary.ownerName,
        email: stationary.email,
        phone: stationary.phone,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}