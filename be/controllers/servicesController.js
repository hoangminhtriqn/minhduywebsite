const Service = require('../models/Service');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    successResponse(res, services);
  } catch (error) {
    console.error('Error fetching services:', error);
    errorResponse(res, 'Lỗi khi lấy danh sách dịch vụ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return errorResponse(res, 'Không tìm thấy dịch vụ', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, service);
  } catch (error) {
    console.error(`Error fetching service by ID: ${req.params.id}`, error);
    errorResponse(res, 'Lỗi khi lấy chi tiết dịch vụ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};


// @desc    Create a new service (Admin)
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res) => {
  try {
    const { title, description, icon, isFeatured } = req.body;
    
    const service = new Service({
      title,
      description,
      icon,
      isFeatured
    });
    
    const createdService = await service.save();
    successResponse(res, createdService, 'Đã tạo dịch vụ thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    console.error('Error creating service:', error);
    errorResponse(res, 'Lỗi khi tạo dịch vụ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Update a service by ID (Admin)
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res) => {
  try {
    const { title, description, icon, isFeatured } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return errorResponse(res, 'Không tìm thấy dịch vụ để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.icon = icon || service.icon;
    service.isFeatured = isFeatured !== undefined ? isFeatured : service.isFeatured;

    const updatedService = await service.save();
    successResponse(res, updatedService, 'Đã cập nhật dịch vụ thành công');
  } catch (error) {
    console.error(`Error updating service with ID ${req.params.id}:`, error);
    errorResponse(res, 'Lỗi khi cập nhật dịch vụ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Delete a service by ID (Admin)
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return errorResponse(res, 'Không tìm thấy dịch vụ để xóa', HTTP_STATUS.NOT_FOUND);
    }

    successResponse(res, null, 'Đã xóa dịch vụ thành công');
  } catch (error) {
    console.error(`Error deleting service with ID ${req.params.id}:`, error);
    errorResponse(res, 'Lỗi khi xóa dịch vụ', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};