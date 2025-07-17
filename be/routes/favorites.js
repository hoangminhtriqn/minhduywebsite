const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  checkFavoriteStatus
} = require('../controllers/favoritesController');

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/yeu-thich
// @desc    Get user's favorites
// @access  Private
router.get('/', getFavorites);

// @route   POST /api/yeu-thich/items
// @desc    Add item to favorites
// @access  Private
router.post('/items', addToFavorites);

// @route   DELETE /api/yeu-thich/items/:itemId
// @desc    Remove item from favorites
// @access  Private
router.delete('/items/:itemId', removeFromFavorites);

// @route   DELETE /api/yeu-thich
// @desc    Clear all favorites
// @access  Private
router.delete('/', clearFavorites);

// @route   GET /api/yeu-thich/check/:productId
// @desc    Check if product is in favorites
// @access  Private
router.get('/check/:productId', checkFavoriteStatus);

module.exports = router; 