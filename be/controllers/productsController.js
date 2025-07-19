const Product = require('../models/Product');
const Category = require('../models/Category');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');
// const { cloudinary } = require('../config/cloudinary'); // Xóa import Cloudinary

// Hàm helper để xóa ảnh từ Cloudinary (sẽ xóa sau khi không còn sử dụng)
// const deleteImageFromCloudinary = async (imageUrl) => {
//   if (!imageUrl) return;
//   try {
//     const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
//     await cloudinary.uploader.destroy(publicId);
//   } catch (error) {
//     console.error('Error deleting image from Cloudinary:', error);
//   }
// };

// Lấy danh sách sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('CategoryID', 'Category_Name')
      .sort({ createdAt: -1 });
    successResponse(res, products);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy danh sách sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Lấy thông tin sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;


    const product = await Product.findById(productId)
      .populate('CategoryID', 'Category_Name');

    
    
    if (!product) {
      console.warn(`Product with ID ${productId} not found in DB.`); // Log cảnh báo nếu không tìm thấy
      return errorResponse(res, 'Không tìm thấy sản phẩm', HTTP_STATUS.NOT_FOUND);
    }
    successResponse(res, product);
  } catch (error) {
    console.error(`Error fetching product with ID ${req.params.productId}:`, error); // Log lỗi chi tiết
    errorResponse(res, 'Lỗi lấy thông tin sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const {
      Product_Name,
      CategoryID,
      Description,
      Price,
      Specifications,
      TestDriveStartDate,
      TestDriveEndDate,
      Status,
      Main_Image, // Lấy URL ảnh chính từ body
      List_Image // Lấy danh sách URLs ảnh phụ từ body
    } = req.body;

    // Kiểm tra xem có URL ảnh chính được gửi lên không
    if (!Main_Image) {
      return errorResponse(res, 'URL hình ảnh chính là bắt buộc', HTTP_STATUS.BAD_REQUEST);
    }

    // Tạo ngày mặc định cho test drive nếu không được cung cấp
    const defaultStartDate = TestDriveStartDate ? new Date(TestDriveStartDate) : new Date();
    const defaultEndDate = TestDriveEndDate ? new Date(TestDriveEndDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 ngày từ hiện tại

    // Map status từ frontend sang backend
    const mapStatus = (status) => {
      if (status === 'available') return 'active';
      if (status === 'sold_out') return 'expired';
      return 'active';
    };

    const product = new Product({
      Product_Name,
      CategoryID,
      Description,
      Price,
      Main_Image: Main_Image, // Lưu URL ảnh chính
      List_Image: List_Image || [], // Lưu danh sách URLs ảnh phụ
      Specifications: Specifications || {},
      TestDriveStartDate: defaultStartDate,
      TestDriveEndDate: defaultEndDate,
      Status: mapStatus(Status)
    });

    await product.save();
    successResponse(res, product, 'Tạo sản phẩm thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    // Ghi log lỗi chi tiết hơn để debug
    console.error('Error creating product:', error);
    errorResponse(res, 'Lỗi tạo sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    // Lấy tất cả các trường từ body, không kiểm tra sự tồn tại
    const {
      Product_Name,
      CategoryID,
      Description,
      Price,
      Specifications,
      TestDriveStartDate,
      TestDriveEndDate,
      Status,
      Main_Image, // Lấy URL ảnh chính từ body
      List_Image // Lấy danh sách URLs ảnh phụ từ body
    } = req.body;

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return errorResponse(res, 'Không tìm thấy sản phẩm', HTTP_STATUS.NOT_FOUND);
    }

    // Xử lý ngày test drive
    const updatedStartDate = TestDriveStartDate ? new Date(TestDriveStartDate) : product.TestDriveStartDate;
    const updatedEndDate = TestDriveEndDate ? new Date(TestDriveEndDate) : product.TestDriveEndDate;

    // Map status từ frontend sang backend
    const mapStatus = (status) => {
      if (status === 'available') return 'active';
      if (status === 'sold_out') return 'expired';
      return 'active';
    };

    // Cập nhật tất cả các thông tin từ body
    product.Product_Name = Product_Name || product.Product_Name;
    product.CategoryID = CategoryID || product.CategoryID;
    product.Description = Description || product.Description;
    product.Price = Price !== undefined ? Price : product.Price;
    product.Specifications = Specifications || product.Specifications;
    product.TestDriveStartDate = updatedStartDate;
    product.TestDriveEndDate = updatedEndDate;
    product.Status = Status ? mapStatus(Status) : product.Status;
    product.Main_Image = Main_Image || product.Main_Image;
    product.List_Image = List_Image || product.List_Image;

    await product.save();
    successResponse(res, product, 'Cập nhật sản phẩm thành công');
  } catch (error) {
    // Ghi log lỗi chi tiết hơn để debug
    console.error('Error updating product:', error);
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

    // Không cần xóa hình ảnh từ Cloudinary nữa
    // Bỏ qua phần xóa ảnh

    successResponse(res, null, 'Xóa sản phẩm thành công');
  } catch (error) {
    // Ghi log lỗi chi tiết hơn để debug
    console.error('Error deleting product:', error);
    errorResponse(res, 'Lỗi xóa sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Lấy sản phẩm theo danh mục
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ CategoryID: req.params.categoryId })
      .populate('CategoryID', 'Category_Name')
      .sort({ createdAt: -1 });
    successResponse(res, products);
  } catch (error) {
    errorResponse(res, 'Lỗi lấy sản phẩm theo danh mục', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Get all products with pagination, search and filters
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      minPrice,
      maxPrice,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    // Search by product name
    if (search) {
      query.Product_Name = { $regex: search, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      const categoryIds = category.split(',');
      console.log('Original category filter:', categoryIds);
      
      // Tìm tất cả subcategories của các category group được chọn (ParentID = category group ID)
      const subcategories = await Category.find({
        ParentID: { $in: categoryIds },
        Status: 'active'
      }).select('_id Name ParentID');
      
      // Lấy tất cả ID của subcategories
      const subcategoryIds = subcategories.map(sub => sub._id);
      console.log('Subcategories found:', subcategories.map(sub => ({ id: sub._id, name: sub.Name, parentId: sub.ParentID })));
      
      // Kiểm tra xem có category nào là subcategory không (có ParentID)
      const directSubcategories = await Category.find({
        _id: { $in: categoryIds },
        ParentID: { $ne: null },
        Status: 'active'
      }).select('_id Name ParentID');
      
      const directSubcategoryIds = directSubcategories.map(cat => cat._id);
      console.log('Direct subcategories found:', directSubcategories.map(sub => ({ id: sub._id, name: sub.Name, parentId: sub.ParentID })));
      
      // Kết hợp cả subcategories từ category groups và direct subcategories
      const allCategoryIds = [...subcategoryIds, ...directSubcategoryIds];
      
      // Chỉ query nếu có categories hợp lệ
      if (allCategoryIds.length > 0) {
        query.CategoryID = { $in: allCategoryIds };
        console.log('Final category filter:', {
          originalCategoryIds: categoryIds,
          subcategoryIds,
          directSubcategoryIds,
          allCategoryIds
        });
      } else {
        console.log('No valid categories found for filtering');
      }
    }
    
    // Filter by status
    if (status) {
      query.Status = { $in: status.split(',') };
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.Price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.Price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.Price.$lte = Number(maxPrice);
      }
    }

    // Map frontend field names to database field names
    const fieldMapping = {
      'Name': 'Product_Name',
      'Price': 'Price',
      'createdAt': 'createdAt'
    };

    const sortField = fieldMapping[sortBy] || sortBy;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ [sortField]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('CategoryID'),
      Product.countDocuments(query)
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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getAllProducts
}; 