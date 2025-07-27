const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');



// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Chỉ chấp nhận file ảnh
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh!'), false);
  }
};



// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'test-drive-booking',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    resource_type: 'image'
  }
});

// Create multer upload instance with file size limit and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
});

// Wrapper function with error handling
const uploadWithErrorHandling = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File quá lớn. Kích thước tối đa: 5MB'
        });
      }
      
      if (err.message.includes('Chỉ chấp nhận file ảnh') || err.message.includes('not allowed')) {
        return res.status(400).json({
          success: false,
          message: 'Định dạng file không hợp lệ. Chỉ chấp nhận: jpg, jpeg, png, gif, webp'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi upload file: ' + err.message
      });
    }
    next();
  });
};

module.exports = {
  cloudinary,
  upload,
  uploadWithErrorHandling
}; 