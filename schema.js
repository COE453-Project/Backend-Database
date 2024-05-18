const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  description: String,
  productionDate: Date,
  expiryDate: Date,
  expiryStatus: String,
  storedAtTimestamp: Date,
  lastUpdatedAtTimestamp: Date
});

module.exports = mongoose.model('Medicine', MedicineSchema);