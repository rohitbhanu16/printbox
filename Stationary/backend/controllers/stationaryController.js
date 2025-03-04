const Stationary = require('../models/Stationary');
const bcrypt = require('bcryptjs');

//Get stationary details
exports.getStationaryDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if(!id){
      return res.status(400).json({ error: 'Stationary ID is required' });
    }

    const stationary = await Stationary.findById(id).select('-password');

    if(!stationary) {
      return res.status(404).json({ message: 'Stationary not found' });
    }
    res.status(200).json(stationary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStationaryProfile = async (req, res) => {
  try {
    const { shopName, ownerName, address, phone } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const updatedData = { shopName, ownerName, address, phone };

    const stationary = await Stationary.findByIdAndUpdate(req.user.id, updatedData, { new: true }).select("-password");

    if (!stationary) {
      return res.status(404).json({ message: "Stationary not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", stationary });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message });
  }
};
