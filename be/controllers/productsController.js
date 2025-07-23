const Product = require('../models/Product');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// Lấy danh sách sản phẩm
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = '',
      category = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Build filter object
    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    // --- CATEGORY FILTER IMPROVED ---
    if (category) {
      const Category = require('../models/Category');
      const mongoose = require('mongoose');
      // Tìm danh mục theo _id
      const selectedCategory = await Category.findById(category);
      if (selectedCategory) {
        if (!selectedCategory.ParentID) {
          // Nếu là cha, lấy tất cả _id con
          const childCategories = await Category.find({ ParentID: selectedCategory._id });
          const childIds = childCategories.map((cat) => cat._id);
          if (childIds.length > 0) {
            filter.CategoryID = { $in: childIds };
          } else {
            // Nếu không có con, filter theo chính nó (trường hợp cha không có con)
            filter.CategoryID = new mongoose.Types.ObjectId(category);
          }
        } else {
          // Nếu là con, filter như cũ
          filter.CategoryID = new mongoose.Types.ObjectId(category);
        }
      }
    }
    if (status) {
      filter.Status = status;
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort = { createdAt: -1 };
    }

    // Aggregate products with favorite info and category info
    const productsAgg = await Product.aggregate([
      { $match: filter },
      { $sort: sort },
      { $skip: skip },
      { $limit: limitNum },
      // Lookup category (child)
      {
        $lookup: {
          from: 'categories',
          localField: 'CategoryID',
          foreignField: '_id',
          as: 'categoryObj',
        },
      },
      { $unwind: { path: '$categoryObj', preserveNullAndEmptyArrays: true } },
      // Lookup parent category
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryObj.ParentID',
          foreignField: '_id',
          as: 'parentCategoryObj',
        },
      },
      { $unwind: { path: '$parentCategoryObj', preserveNullAndEmptyArrays: true } },
      // Lookup favorites
      {
        $lookup: {
          from: 'favorites',
          let: { productId: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            { $match: { $expr: { $eq: ['$items.ProductID', '$$productId'] } } },
            // Join with user
            {
              $lookup: {
                from: 'users',
                localField: 'UserID',
                foreignField: '_id',
                as: 'userInfo',
              },
            },
            { $unwind: '$userInfo' },
            {
              $project: {
                _id: 0,
                user: {
                  _id: '$userInfo._id',
                  UserName: '$userInfo.UserName',
                  FullName: '$userInfo.FullName',
                  Email: '$userInfo.Email',
                  Phone: '$userInfo.Phone',
                },
              },
            },
          ],
          as: 'favoritedUsers',
        },
      },
      // Add favorite count
      {
        $addFields: {
          favoriteCount: { $size: '$favoritedUsers' },
          CategoryID: {
            _id: '$categoryObj._id',
            Name: '$categoryObj.Name',
            ParentID: {
              _id: '$parentCategoryObj._id',
              Name: '$parentCategoryObj.Name',
            },
          },
        },
      },
      // Remove temp fields
      {
        $project: {
          categoryObj: 0,
          parentCategoryObj: 0,
        },
      },
    ]);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    return res.json({
      products: productsAgg,
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

// Lấy sản phẩm liên quan
const getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 4 } = req.query;
    
    // Tìm sản phẩm hiện tại
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return errorResponse(res, 'Không tìm thấy sản phẩm', HTTP_STATUS.NOT_FOUND);
    }

    // Tìm sản phẩm liên quan cùng danh mục, loại trừ sản phẩm hiện tại
    const relatedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $ne: currentProduct._id },
          CategoryID: currentProduct.CategoryID,
          Status: 'active'
        }
      },
      { $limit: parseInt(limit) },
      // Lookup category (child)
      {
        $lookup: {
          from: 'categories',
          localField: 'CategoryID',
          foreignField: '_id',
          as: 'categoryObj',
        },
      },
      { $unwind: { path: '$categoryObj', preserveNullAndEmptyArrays: true } },
      // Lookup parent category
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryObj.ParentID',
          foreignField: '_id',
          as: 'parentCategoryObj',
        },
      },
      { $unwind: { path: '$parentCategoryObj', preserveNullAndEmptyArrays: true } },
      // Lookup favorites
      {
        $lookup: {
          from: 'favorites',
          let: { productId: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            { $match: { $expr: { $eq: ['$items.ProductID', '$$productId'] } } },
            // Join with user
            {
              $lookup: {
                from: 'users',
                localField: 'UserID',
                foreignField: '_id',
                as: 'userInfo',
              },
            },
            { $unwind: '$userInfo' },
            {
              $project: {
                _id: 0,
                user: {
                  _id: '$userInfo._id',
                  UserName: '$userInfo.UserName',
                  FullName: '$userInfo.FullName',
                  Email: '$userInfo.Email',
                  Phone: '$userInfo.Phone',
                },
              },
            },
          ],
          as: 'favoritedUsers',
        },
      },
      // Add favorite count
      {
        $addFields: {
          favoriteCount: { $size: '$favoritedUsers' },
          CategoryID: {
            _id: '$categoryObj._id',
            Name: '$categoryObj.Name',
            ParentID: {
              _id: '$parentCategoryObj._id',
              Name: '$parentCategoryObj.Name',
            },
          },
        },
      },
      // Remove temp fields
      {
        $project: {
          categoryObj: 0,
          parentCategoryObj: 0,
        },
      },
    ]);

    successResponse(res, relatedProducts);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy sản phẩm liên quan', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts
}; 