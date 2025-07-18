const Setting = require('../models/Setting');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

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
      instagram: settings.instagram,
      twitter: settings.twitter,
      linkedin: settings.linkedin,
      description: settings.description,
      keywords: settings.keywords
    };
    
    successResponse(res, publicSettings);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy cài đặt', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getPublicSettings
}; 