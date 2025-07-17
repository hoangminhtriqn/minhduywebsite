const express = require('express');
const router = express.Router();
const {
  uploadFile,
  uploadMultipleFiles,
  getFileInfo,
  getAllFiles,
  deleteFile,
  deleteMultipleFiles,
  getFileUrl,
  searchFiles
} = require('../controllers/fileController');
const { upload } = require('../config/cloudinary');
const { protect, authorize } = require('../middleware/authMiddleware');

// Upload routes
router.post('/upload', protect, upload.single('file'), uploadFile);
router.post('/upload-multiple', protect, upload.array('files', 10), uploadMultipleFiles);

// Get file info and list
router.get('/', protect, getAllFiles);
router.get('/search', protect, searchFiles);
router.get('/:publicId', protect, getFileInfo);
router.get('/:publicId/url', protect, getFileUrl);

// Delete routes
router.delete('/:publicId', protect, authorize('admin'), deleteFile);
router.delete('/', protect, authorize('admin'), deleteMultipleFiles);

module.exports = router; 