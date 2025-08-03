const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  partNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  datasheetLink: {
    type: String,
    trim: true
  },
  unitPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  criticalThreshold: {
    type: Number,
    min: 0,
    default: 5
  },
  qrCode: {
    type: String,
    required: true
  },
  lastOutwardedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
componentSchema.index({ category: 1, partNumber: 1, location: 1 });

module.exports = mongoose.model('Component', componentSchema); 