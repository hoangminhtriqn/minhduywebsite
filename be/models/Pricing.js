const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['pdf', 'word', 'excel'],
      required: true
    },
    size: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  color: {
    type: String,
    enum: [
      'blue', 'green', 'purple', 'orange', 'red', 'teal',
      'indigo', 'pink', 'yellow', 'cyan', 'lime', 'amber',
      'emerald', 'violet', 'rose', 'sky', 'slate', 'zinc',
      'neutral', 'stone', 'gray', 'cool-gray', 'warm-gray'
    ],
    default: 'blue'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
pricingSchema.index({ category: 1, status: 1 });
pricingSchema.index({ order: 1 });

module.exports = mongoose.model('Pricing', pricingSchema); 