const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
  componentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['inward', 'outward'],
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
stockLogSchema.index({ componentId: 1, date: -1 });
stockLogSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('StockLog', stockLogSchema); 