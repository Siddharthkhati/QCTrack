const mongoose = require('mongoose');

// Define a schema for status/comments objects
const StatusCommentSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    default: ''
  }
}, { _id: false });

// Define the main QC Inspection Schema
const InspectionSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
    trim: true
  },
  shipmentId: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  deliveryDateTime: {
    type: Date,
    required: true
  },
  totalUnits: {
    type: Number,
    required: true
  },
  packagingCondition: {
    type: StatusCommentSchema,
    required: true
  },
  quantityMatch: {
    type: StatusCommentSchema,
    required: true
  },
  outerBoxDamage: {
    type: StatusCommentSchema,
    required: true
  },
  invoiceMatching: {
    type: StatusCommentSchema,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

InspectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inspection', InspectionSchema);
