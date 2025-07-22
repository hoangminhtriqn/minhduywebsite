const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    type: String,
    trim: true,
  },
  mapUrl: {
    type: String,
    trim: true,
  },
  isMainAddress: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Location', locationSchema); 