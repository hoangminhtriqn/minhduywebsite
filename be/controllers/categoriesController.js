const Category = require('../models/Category');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');
const Product = require('../models/Product');

// Lấy danh sách categories với cấu trúc phân cấp (cho frontend)
const getCategoriesHierarchy = async (req, res) => {
  try {
    // Lấy group categories (cấp cha) - chỉ lấy những category có status 'active'
    const groupCategories = await Category.find({ 
      ParentID: null,
      Status: 'active'
    })
      .populate({
        path: 'subcategories',
        select: 'Name Description Status Order',
        match: { Status: 'active' } // Chỉ lấy subcategories có status 'active'
      })
      .sort({ Order: 1 });

    // Format dữ liệu cho frontend
    const formattedCategories = groupCategories.map(group => ({
      id: group._id,
      name: group.Name,
      icon: group.Icon || '📁',
      subCategories: group.subcategories.map(sub => sub.Name)
    }));

    successResponse(res, formattedCategories);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy danh sách danh mục', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Lấy danh sách tất cả categories (cho admin) - không phân trang, không search
const getAllCategories = async (req, res) => {
  try {
    // Lấy tất cả categories không phân trang
    const categories = await Category.find({})
      .populate('ParentID', 'Name')
      .sort({ Order: 1 });

    res.json({
      categories,
      total: categories.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin danh mục theo ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('ParentID', 'Name');
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, category);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy thông tin danh mục', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Tạo danh mục mới
const createCategory = async (req, res) => {
  try {
    const { Name, Description, ParentID, Order, Status, Icon } = req.body;

    // Kiểm tra danh mục đã tồn tại
    const existingCategory = await Category.findOne({ Name });
    if (existingCategory) {
      return errorResponse(res, 'Tên danh mục đã tồn tại', HTTP_STATUS.BAD_REQUEST);
    }

    const category = new Category({
      Name,
      Description,
      ParentID,
      Order: Order || 0,
      Status: Status || 'active',
      Icon: Icon || null
    });

    await category.save();
    successResponse(res, category, 'Tạo danh mục thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    errorResponse(res, 'Lỗi tạo danh mục', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
  try {
    const { Name, Description, ParentID, Order, Status, Icon } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', HTTP_STATUS.NOT_FOUND);
    }

    // Kiểm tra tên danh mục mới có bị trùng không
    if (Name && Name !== category.Name) {
      const existingCategory = await Category.findOne({ Name });
      if (existingCategory) {
        return errorResponse(res, 'Tên danh mục đã tồn tại', HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Cập nhật thông tin
    if (Name) category.Name = Name;
    if (Description) category.Description = Description;
    if (ParentID !== undefined) category.ParentID = ParentID;
    if (Order !== undefined) category.Order = Order;
    if (Status) category.Status = Status;
    if (Icon !== undefined) category.Icon = Icon;

    await category.save();
    successResponse(res, category, 'Cập nhật danh mục thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi cập nhật danh mục', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, null, 'Xóa danh mục thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi xóa danh mục', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ CategoryID: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments({ CategoryID: req.params.id })
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API cập nhật icon riêng biệt
const updateCategoryIcon = async (req, res) => {
  try {
    const { icon } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', HTTP_STATUS.NOT_FOUND);
    }
    category.Icon = icon;
    await category.save();
    successResponse(res, category, 'Cập nhật icon thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi cập nhật icon', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// API cập nhật đầy đủ thông tin
const updateCategoryFull = async (req, res) => {
  try {
    const { Name, Description, ParentID, Order, Status, Icon } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', HTTP_STATUS.NOT_FOUND);
    }
    if (Name) category.Name = Name;
    if (Description) category.Description = Description;
    if (ParentID !== undefined) category.ParentID = ParentID;
    if (Order !== undefined) category.Order = Order;
    if (Status) category.Status = Status;
    if (Icon) category.Icon = Icon;
    await category.save();
    successResponse(res, category, 'Cập nhật danh mục thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi cập nhật danh mục', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  getCategoriesHierarchy,
  getCategories: getCategoriesHierarchy, // Alias for backward compatibility
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getProductsByCategory,
  updateCategoryIcon,
  updateCategoryFull,
}; 