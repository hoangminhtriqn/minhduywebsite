const Pricing = require("../models/Pricing");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// Get all pricing items with pagination (public)
const getAllPricing = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 6, 
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [pricing, total] = await Promise.all([
      Pricing.find({ status: "active" })
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Pricing.countDocuments({ status: "active" }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const result = {
      docs: pricing,
      totalDocs: total,
      limit: limitNum,
      totalPages,
      page: parseInt(page),
      pagingCounter: skip + 1,
      hasPrevPage: parseInt(page) > 1,
      hasNextPage: parseInt(page) < totalPages,
      prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : null,
      nextPage: parseInt(page) < totalPages ? parseInt(page) + 1 : null,
    };

    return successResponse(res, result, "Lấy danh sách báo giá thành công");
  } catch (error) {
    console.error("Error getting pricing:", error);
    return errorResponse(res, "Lỗi khi lấy danh sách báo giá", 500);
  }
};

// Get all pricing items for admin with search and filter
const getAllPricingAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "",
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [pricing, total] = await Promise.all([
      Pricing.find(filter).sort(sort).skip(skip).limit(limitNum),
      Pricing.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const result = {
      pricing,
      total,
      page: parseInt(page),
      limit: limitNum,
      totalPages,
    };

    return successResponse(res, result, "Lấy danh sách báo giá thành công");
  } catch (error) {
    console.error("Error getting pricing admin:", error);
    return errorResponse(res, "Lỗi khi lấy danh sách báo giá", 500);
  }
};

// Get pricing by ID
const getPricingById = async (req, res) => {
  try {
    const { id } = req.params;

    const pricing = await Pricing.findById(id);
    if (!pricing) {
      return errorResponse(res, "Không tìm thấy báo giá", 404);
    }

    return successResponse(res, pricing, "Lấy thông tin báo giá thành công");
  } catch (error) {
    console.error("Error getting pricing by ID:", error);
    return errorResponse(res, "Lỗi khi lấy thông tin báo giá", 500);
  }
};

// Create new pricing
const createPricing = async (req, res) => {
  try {
    const pricingData = req.body;

    const pricing = new Pricing(pricingData);
    await pricing.save();

    return successResponse(res, pricing, "Tạo báo giá thành công", 201);
  } catch (error) {
    console.error("Error creating pricing:", error);
    return errorResponse(res, "Lỗi khi tạo báo giá", 500);
  }
};

// Update pricing
const updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const pricing = await Pricing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!pricing) {
      return errorResponse(res, "Không tìm thấy báo giá", 404);
    }

    return successResponse(res, pricing, "Cập nhật báo giá thành công");
  } catch (error) {
    console.error("Error updating pricing:", error);
    return errorResponse(res, "Lỗi khi cập nhật báo giá", 500);
  }
};

// Delete pricing
const deletePricing = async (req, res) => {
  try {
    const { id } = req.params;

    const pricing = await Pricing.findByIdAndDelete(id);
    if (!pricing) {
      return errorResponse(res, "Không tìm thấy báo giá", 404);
    }

    return successResponse(res, null, "Xóa báo giá thành công");
  } catch (error) {
    console.error("Error deleting pricing:", error);
    return errorResponse(res, "Lỗi khi xóa báo giá", 500);
  }
};

// Get pricing categories
const getPricingCategories = async (req, res) => {
  try {
    const categories = await Pricing.distinct("category", { status: "active" });

    return successResponse(
      res,
      categories,
      "Lấy danh sách danh mục báo giá thành công"
    );
  } catch (error) {
    console.error("Error getting pricing categories:", error);
    return errorResponse(res, "Lỗi khi lấy danh sách danh mục báo giá", 500);
  }
};

module.exports = {
  getAllPricing,
  getAllPricingAdmin,
  getPricingById,
  createPricing,
  updatePricing,
  deletePricing,
  getPricingCategories,
};
