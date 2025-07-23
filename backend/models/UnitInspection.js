const mongoose = require('mongoose');

// Define the schema for individual unit inspections
const UnitInspectionSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    trim: true
  },
  barcodeScanned: {
    type: String,
    required: true,
    trim: true
  },
  labelCondition: {
    type: String, 
    required: true
  },
  manufacturingDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  shipmentId: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UnitInspectionSchema.index({ shipmentId: 1 });

module.exports = mongoose.model('UnitInspection', UnitInspectionSchema);
