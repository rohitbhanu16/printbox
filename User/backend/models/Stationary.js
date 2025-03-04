const mongoose = require('mongoose');

const StationarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, default: 'open' },
});

module.exports = mongoose.model('Stationary', StationarySchema);
