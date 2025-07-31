const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
