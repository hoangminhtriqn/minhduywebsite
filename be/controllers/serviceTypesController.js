const ServiceType = require("../models/ServiceType");
const {
  successResponse,
  errorResponse,
  HTTP_STATUS,
} = require("../utils/responseHandler");

// Lấy danh sách service types
const getAllServiceTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    const query = {};

    // Tìm kiếm theo tên
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Lọc theo trạng thái
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const serviceTypes = await ServiceType.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ServiceType.countDocuments(query);

    successResponse(res, {
      serviceTypes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching service types:", error);
    errorResponse(
      res,
      "Lỗi lấy danh sách loại dịch vụ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Lấy tất cả service types active (cho dropdown)
const getActiveServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find({ status: "active" }).sort({
      name: 1,
    });

    successResponse(res, serviceTypes);
  } catch (error) {
    console.error("Error fetching active service types:", error);
    errorResponse(
      res,
      "Lỗi lấy danh sách loại dịch vụ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Lấy thông tin service type theo ID
const getServiceTypeById = async (req, res) => {
  try {
    const serviceType = await ServiceType.findById(req.params.serviceTypeId);
    if (!serviceType) {
      return errorResponse(
        res,
        "Không tìm thấy loại dịch vụ",
        HTTP_STATUS.NOT_FOUND
      );
    }
    successResponse(res, serviceType);
  } catch (error) {
    console.error("Error fetching service type by ID:", error);
    errorResponse(
      res,
      "Lỗi lấy thông tin loại dịch vụ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Tạo service type mới
const createServiceType = async (req, res) => {
  try {
    const { name, description, status = "active" } = req.body;

    // Kiểm tra tên đã tồn tại chưa
    const existingServiceType = await ServiceType.findOne({ name });
    if (existingServiceType) {
      return errorResponse(
        res,
        "Tên loại dịch vụ đã tồn tại",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const newServiceType = new ServiceType({
      name,
      description,
      status,
    });

    await newServiceType.save();

    successResponse(
      res,
      newServiceType,
      "Tạo loại dịch vụ thành công",
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    console.error("Error creating service type:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return errorResponse(res, messages.join(", "), HTTP_STATUS.BAD_REQUEST);
    }
    errorResponse(
      res,
      "Lỗi tạo loại dịch vụ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Cập nhật service type
const updateServiceType = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const serviceType = await ServiceType.findById(req.params.serviceTypeId);
    if (!serviceType) {
      return errorResponse(
        res,
        "Không tìm thấy loại dịch vụ",
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Kiểm tra tên đã tồn tại chưa (trừ chính nó)
    if (name && name !== serviceType.name) {
      const existingServiceType = await ServiceType.findOne({ name });
      if (existingServiceType) {
        return errorResponse(
          res,
          "Tên loại dịch vụ đã tồn tại",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    serviceType.name = name || serviceType.name;
    serviceType.description =
      description !== undefined ? description : serviceType.description;
    serviceType.status = status || serviceType.status;

    await serviceType.save();

    successResponse(res, serviceType, "Cập nhật loại dịch vụ thành công");
  } catch (error) {
    console.error("Error updating service type:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return errorResponse(res, messages.join(", "), HTTP_STATUS.BAD_REQUEST);
    }
    errorResponse(
      res,
      "Lỗi cập nhật loại dịch vụ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Xóa service type
const deleteServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.findById(req.params.serviceTypeId);
    if (!serviceType) {
      return errorResponse(
        res,
        "Không tìm thấy loại dịch vụ",
        HTTP_STATUS.NOT_FOUND
      );
    }

    await ServiceType.findByIdAndDelete(req.params.serviceTypeId);

    successResponse(res, null, "Xóa loại dịch vụ thành công");
  } catch (error) {
    console.error("Error deleting service type:", error);
    errorResponse(
      res,
      "Lỗi xóa loại dịch vụ",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  getAllServiceTypes,
  getActiveServiceTypes,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType,
};
