const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Thông tin cơ bản
  companyName: {
    type: String,
    default: 'Minh Duy Technology'
  },
  phone: {
    type: String,
    default: '0123456789'
  },
  email: {
    type: String,
    default: 'info@minhduy.com'
  },
  workingHours: {
    type: String,
    default: '8:00 - 18:00 (Thứ 2 - Thứ 7)'
  },
  logo: {
    type: String,
    default: '/images/logo.png'
  },
  
  // Mạng xã hội
  facebook: {
    type: String,
    default: 'https://facebook.com'
  },
  youtube: {
    type: String,
    default: 'https://youtube.com'
  },
  instagram: {
    type: String,
    default: 'https://instagram.com'
  },
  twitter: {
    type: String,
    default: 'https://twitter.com'
  },
  linkedin: {
    type: String,
    default: 'https://linkedin.com'
  },
  
  // Meta thông tin
  description: {
    type: String,
    default: 'Công ty thiết bị công nghệ hàng đầu tại Việt Nam'
  },
  keywords: {
    type: String,
    default: 'laptop, máy tính, thiết bị công nghệ'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema); 