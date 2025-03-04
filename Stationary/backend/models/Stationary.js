const mongoose = require("mongoose");

const StationarySchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Stationary", StationarySchema);
