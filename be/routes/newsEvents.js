const express = require('express');
const router = express.Router();
const newsEventsController = require('../controllers/newsEventsController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); // Import upload middleware

// Routes for News & Events Management
// Use middleware where needed (e.g., authorize for admin actions)

// Specific routes must come before parameterized routes
router.get('/popular', newsEventsController.getPopularNewsEvents); // Public - Get popular news

router.get('/', newsEventsController.getAllNewsEvents); // Public
router.post('/', protect, authorize('admin'), upload.single('ImageUrl'), newsEventsController.createNewsEvent); // Admin only

router.get('/:newsEventId', newsEventsController.getNewsEventById); // Public
router.put('/:newsEventId', protect, authorize('admin'), upload.single('ImageUrl'), newsEventsController.updateNewsEvent); // Admin only
router.delete('/:newsEventId', protect, authorize('admin'), newsEventsController.deleteNewsEvent); // Admin only

module.exports = router; 