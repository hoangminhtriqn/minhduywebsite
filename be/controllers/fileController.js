const { cloudinary } = require('../config/cloudinary');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// @desc    Upload single file
// @route   POST /api/files/upload
// @access  Private
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Không có file được upload', HTTP_STATUS.BAD_REQUEST);
    }

    const result = {
      public_id: req.file.filename,
      url: req.file.path,
      secure_url: req.file.path,
      format: req.file.format,
      width: req.file.width,
      height: req.file.height,
      bytes: req.file.size,
      original_filename: req.file.originalname
    };

    successResponse(res, result, 'Upload file thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    console.error('Error uploading file:', error);
    errorResponse(res, 'Lỗi khi upload file', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Upload multiple files
// @route   POST /api/files/upload-multiple
// @access  Private
const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'Không có file nào được upload', HTTP_STATUS.BAD_REQUEST);
    }

    const results = req.files.map(file => ({
      public_id: file.filename,
      url: file.path,
      secure_url: file.path,
      format: file.format,
      width: file.width,
      height: file.height,
      bytes: file.size,
      original_filename: file.originalname
    }));

    successResponse(res, results, 'Upload nhiều file thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    errorResponse(res, 'Lỗi khi upload nhiều file', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Get file info by public_id
// @route   GET /api/files/:publicId
// @access  Private
const getFileInfo = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return errorResponse(res, 'Public ID là bắt buộc', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'image'
    });

    successResponse(res, result, 'Lấy thông tin file thành công');
  } catch (error) {
    console.error('Error getting file info:', error);
    if (error.http_code === 404) {
      return errorResponse(res, 'Không tìm thấy file', HTTP_STATUS.NOT_FOUND);
    }
    errorResponse(res, 'Lỗi khi lấy thông tin file', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Get all files from Cloudinary
// @route   GET /api/files
// @access  Private
const getAllFiles = async (req, res) => {
  try {
    const { max_results = 50, next_cursor } = req.query;

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'test-drive-booking',
      max_results: parseInt(max_results),
      next_cursor: next_cursor
    });

    successResponse(res, result, 'Lấy danh sách file thành công');
  } catch (error) {
    console.error('Error getting all files:', error);
    errorResponse(res, 'Lỗi khi lấy danh sách file', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Delete file by public_id
// @route   DELETE /api/files/:publicId
// @access  Private
const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return errorResponse(res, 'Public ID là bắt buộc', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    });

    if (result.result === 'ok') {
      successResponse(res, { public_id: publicId }, 'Xóa file thành công');
    } else {
      errorResponse(res, 'Lỗi khi xóa file', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    if (error.http_code === 404) {
      return errorResponse(res, 'Không tìm thấy file để xóa', HTTP_STATUS.NOT_FOUND);
    }
    errorResponse(res, 'Lỗi khi xóa file', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Delete multiple files
// @route   DELETE /api/files
// @access  Private
const deleteMultipleFiles = async (req, res) => {
  try {
    const { public_ids } = req.body;

    if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
      return errorResponse(res, 'Danh sách public IDs là bắt buộc', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await cloudinary.api.delete_resources(public_ids, {
      resource_type: 'image'
    });

    successResponse(res, result, 'Xóa nhiều file thành công');
  } catch (error) {
    console.error('Error deleting multiple files:', error);
    errorResponse(res, 'Lỗi khi xóa nhiều file', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Get file URL with transformations
// @route   GET /api/files/:publicId/url
// @access  Private
const getFileUrl = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { width, height, crop, quality, format } = req.query;

    if (!publicId) {
      return errorResponse(res, 'Public ID là bắt buộc', HTTP_STATUS.BAD_REQUEST);
    }

    const transformation = [];
    
    if (width || height) {
      transformation.push({ width: width ? parseInt(width) : undefined, height: height ? parseInt(height) : undefined, crop: crop || 'limit' });
    }
    
    if (quality) {
      transformation.push({ quality: parseInt(quality) });
    }
    
    if (format) {
      transformation.push({ fetch_format: format });
    }

    const url = cloudinary.url(publicId, {
      transformation: transformation,
      secure: true
    });

    successResponse(res, { url, public_id: publicId }, 'Lấy URL file thành công');
  } catch (error) {
    console.error('Error getting file URL:', error);
    errorResponse(res, 'Lỗi khi lấy URL file', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Search files
// @route   GET /api/files/search
// @access  Private
const searchFiles = async (req, res) => {
  try {
    const { query, max_results = 50, next_cursor } = req.query;

    if (!query) {
      return errorResponse(res, 'Query tìm kiếm là bắt buộc', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'test-drive-booking',
      max_results: parseInt(max_results),
      next_cursor: next_cursor,
      expression: query
    });

    successResponse(res, result, 'Tìm kiếm file thành công');
  } catch (error) {
    console.error('Error searching files:', error);
    errorResponse(res, 'Lỗi khi tìm kiếm file', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  getFileInfo,
  getAllFiles,
  deleteFile,
  deleteMultipleFiles,
  getFileUrl,
  searchFiles
}; 