const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stationary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stationary',
    required: true,
  },
  documents: { type: [String], required: true },
  preferences: {
    size: { type: String, enum: ["A4", "A3", "Letter"], required: true },
    color: { type: String, enum: ["color", "b&w"], required: true },
    numberofCopies: { type: Number, required: true },
    sides: { type: String, enum: ["single", "double"], required: true },
    urgency: { type: String, enum: ["normal", "urgent"], required: true },
  },
  notes: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
