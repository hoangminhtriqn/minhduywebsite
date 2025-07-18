const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getPublicSettings } = require('../controllers/settingsController');
const { auth, adminAuth } = require('../middleware/auth');

// Public route để lấy settings cho frontend
router.get('/public', getPublicSettings);

// Admin routes (cần authentication)
router.get('/', auth, adminAuth, getSettings);
router.put('/', auth, adminAuth, updateSettings);

module.exports = router; 