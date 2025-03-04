const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  documents: [{ type: String, required: true }], //URLs to documents in S3
  preferences: {
    size: { type: String, required: true },
    color: { type: String, required: true },
    copies: { type: Number, required: true },
    sides: { type: String, required: true },
    urgency: { type: String, required: true },
  },
  notes: { type: String },
  stationary: { type: mongoose.Schema.Types.ObjectId, ref: 'Stationary', required: true }, // Correct field name
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
