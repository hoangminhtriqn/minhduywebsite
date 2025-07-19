const express = require('express');
const router = express.Router();
const { getAllPricing } = require('../controllers/pricingController');

// Public routes
router.get('/', getAllPricing);

module.exports = router; 