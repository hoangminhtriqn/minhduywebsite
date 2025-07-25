const express = require('express');
const router = express.Router();
const { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryTree,
  updateCategoryIcon,
  updateCategoryFull,
  getCategoriesForFilter,
  getCategoriesHierarchy
} = require('../controllers/categoriesController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getCategoriesHierarchy);
router.get('/hierarchy', getCategoriesHierarchy);
router.get('/filter', getCategoriesForFilter);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategoryById);

// Protected routes (Admin only)
router.get('/admin/all', protect, authorize('admin'), getAllCategories);
router.post('/', protect, authorize('admin'), upload.single('Image'), createCategory);
router.put('/:id', protect, authorize('admin'), upload.single('Image'), updateCategory);
router.put('/:id/icon', protect, authorize('admin'), updateCategoryIcon);
router.put('/:id/full', protect, authorize('admin'), updateCategoryFull);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router; 