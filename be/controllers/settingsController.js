const Setting = require("../models/Setting");
const {
  successResponse,
  errorResponse,
  HTTP_STATUS,
} = require("../utils/responseHandler");
const Location = require("../models/Location");
const Slide = require("../models/Slide");

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
    errorResponse(
      res,
      "Lỗi lấy cài đặt",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
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
    successResponse(res, settings, "Cập nhật cài đặt thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi cập nhật cài đặt",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
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
    // Lấy danh sách locations và slides
    const locations = await Location.find();
    const slides = await Slide.find({ isActive: true }).sort({ order: 1 });
    // Chỉ trả về thông tin cần thiết cho frontend
    const publicSettings = {
      companyName: settings.companyName,
      phone: settings.phone,
      email: settings.email,
      workingHours: settings.workingHours,
      logo: settings.logo,
      facebook: settings.facebook,
      youtube: settings.youtube,
      tiktok: settings.tiktok,
      zaloUrl: settings.zaloUrl,
      facebookMessengerUrl: settings.facebookMessengerUrl,
      description: settings.description,
      keywords: settings.keywords,
      locations, // thêm danh sách địa chỉ vào public settings
      slides, // thêm danh sách slides vào public settings
    };
    successResponse(res, publicSettings);
  } catch (error) {
    errorResponse(
      res,
      "Lỗi lấy cài đặt",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Lấy tất cả địa chỉ
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    successResponse(res, locations);
  } catch (error) {
    errorResponse(
      res,
      "Lỗi lấy danh sách địa chỉ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Thêm địa chỉ mới
const createLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    successResponse(res, location, "Thêm địa chỉ thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi thêm địa chỉ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Cập nhật địa chỉ
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!location) {
      return errorResponse(
        res,
        "Không tìm thấy địa chỉ",
        HTTP_STATUS.NOT_FOUND
      );
    }
    successResponse(res, location, "Cập nhật địa chỉ thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi cập nhật địa chỉ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Xóa địa chỉ
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return errorResponse(
        res,
        "Không tìm thấy địa chỉ",
        HTTP_STATUS.NOT_FOUND
      );
    }
    successResponse(res, location, "Xóa địa chỉ thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi xóa địa chỉ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Lấy tất cả slides
const getAllSlides = async (req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1 });
    successResponse(res, slides);
  } catch (error) {
    errorResponse(
      res,
      "Lỗi lấy danh sách slides",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Thêm slide mới
const createSlide = async (req, res) => {
  try {
    const slide = new Slide(req.body);
    await slide.save();
    successResponse(res, slide, "Thêm slide thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi thêm slide",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Cập nhật slide
const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await Slide.findByIdAndUpdate(id, req.body, { new: true });
    if (!slide) {
      return errorResponse(res, "Không tìm thấy slide", HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, slide, "Cập nhật slide thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi cập nhật slide",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Xóa slide
const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await Slide.findByIdAndDelete(id);
    if (!slide) {
      return errorResponse(res, "Không tìm thấy slide", HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, slide, "Xóa slide thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi xóa slide",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
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
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};
