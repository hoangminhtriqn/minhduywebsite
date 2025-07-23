const Setting = require('../models/Setting');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');
const Location = require('../models/Location');

// Lấy tất cả settings
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    // Nếu chưa có settings, tạo mặc định
    if (!settings) {
      settings = new Setting();
      await settings.save();
    }
    
    successResponse(res, settings);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy cài đặt', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Cập nhật settings
const updateSettings = async (req, res) => {
  try {
    const updateData = req.body;
    
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting(updateData);
    } else {
      Object.assign(settings, updateData);
    }
    
    await settings.save();
    successResponse(res, settings, 'Cập nhật cài đặt thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi cập nhật cài đặt', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Lấy settings cho frontend (public)
const getPublicSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
      await settings.save();
    }
    
    // Chỉ trả về thông tin cần thiết cho frontend
    const publicSettings = {
      companyName: settings.companyName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      workingHours: settings.workingHours,
      logo: settings.logo,
      facebook: settings.facebook,
      youtube: settings.youtube,
      tiktok: settings.tiktok, // thêm tiktok
      description: settings.description,
      keywords: settings.keywords
    };
    
    successResponse(res, publicSettings);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy cài đặt', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Lấy tất cả địa chỉ
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    successResponse(res, locations);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy danh sách địa chỉ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Thêm địa chỉ mới
const createLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    successResponse(res, location, 'Thêm địa chỉ thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi thêm địa chỉ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Cập nhật địa chỉ
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndUpdate(id, req.body, { new: true });
    if (!location) {
      return errorResponse(res, 'Không tìm thấy địa chỉ', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, location, 'Cập nhật địa chỉ thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi cập nhật địa chỉ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Xóa địa chỉ
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return errorResponse(res, 'Không tìm thấy địa chỉ', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, location, 'Xóa địa chỉ thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi xóa địa chỉ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getPublicSettings,
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
}; 