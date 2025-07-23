const Product = require('../models/Product');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// Lấy danh sách sản phẩm
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments()
    ]);

    return res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return errorResponse(res, 'Không tìm thấy sản phẩm', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, product);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy thông tin sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    successResponse(res, product, 'Tạo sản phẩm thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    errorResponse(res, 'Lỗi tạo sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (!product) {
      return errorResponse(res, 'Không tìm thấy sản phẩm', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, product, 'Cập nhật sản phẩm thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi cập nhật sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
      return errorResponse(res, 'Không tìm thấy sản phẩm', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, null, 'Xóa sản phẩm thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi xóa sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 