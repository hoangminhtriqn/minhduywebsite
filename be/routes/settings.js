const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getPublicSettings,
  getAllLocations, createLocation, updateLocation, deleteLocation } = require('../controllers/settingsController');
const { auth, adminAuth } = require('../middleware/auth');
const { USER_ROLES } = require('../models/User');

// Public route để lấy settings cho frontend
router.get('/public', getPublicSettings);

// Admin routes (cần authentication)
router.get('/', auth, adminAuth, getSettings);
router.put('/', auth, adminAuth, updateSettings);

// Địa chỉ (locations) - quản trị
router.get('/locations', auth, adminAuth, getAllLocations);
router.post('/locations', auth, adminAuth, createLocation);
router.put('/locations/:id', auth, adminAuth, updateLocation);
router.delete('/locations/:id', auth, adminAuth, deleteLocation);

module.exports = router; 