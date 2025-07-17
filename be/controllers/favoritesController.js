const Favorites = require('../models/Favorites');
const Product = require('../models/Product');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// @desc    Get user's favorites
// @route   GET /api/yeu-thich
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorites.findOne({ UserID: req.user._id, Status: 'active' })
      .populate({
        path: 'items.ProductID',
        select: 'Product_Name Price Main_Image'
      });

    if (!favorites) {
      // Create new favorites if none exists
      const newFavorites = new Favorites({
        UserID: req.user._id,
        Status: 'active',
        items: []
      });
      await newFavorites.save();
      return successResponse(res, newFavorites);
    }

    successResponse(res, favorites);
  } catch (error) {
    console.error('Error getting favorites:', error);
    errorResponse(res, 'Lỗi khi lấy thông tin yêu thích', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Add item to favorites
// @route   POST /api/yeu-thich/items
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 'Sản phẩm không tồn tại', HTTP_STATUS.NOT_FOUND);
    }

    // Get or create favorites
    let favorites = await Favorites.findOne({ UserID: req.user._id, Status: 'active' });
    if (!favorites) {
      favorites = new Favorites({
        UserID: req.user._id,
        Status: 'active',
        items: []
      });
    }

    // Check if item already exists in favorites
    const existingItem = favorites.items.find(item => item.ProductID.toString() === productId);

    if (existingItem) {
      return errorResponse(res, 'Sản phẩm đã có trong danh sách yêu thích', HTTP_STATUS.BAD_REQUEST);
    }

    // Add new item to embedded items array
    favorites.items.push({
      ProductID: productId,
      Image: product.Main_Image
    });

    await favorites.save();

    // Return updated favorites with populated product details
    const updatedFavorites = await Favorites.findById(favorites._id)
      .populate({
        path: 'items.ProductID',
        select: 'Product_Name Price Main_Image'
      });

    successResponse(res, updatedFavorites, 'Đã thêm sản phẩm vào danh sách yêu thích');
  } catch (error) {
    console.error('Error adding to favorites:', error);
    errorResponse(res, 'Lỗi khi thêm sản phẩm vào danh sách yêu thích', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Remove item from favorites
// @route   DELETE /api/yeu-thich/items/:itemId
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the user's active favorites
    const favorites = await Favorites.findOne({ UserID: req.user._id, Status: 'active' });

    if (!favorites) {
      return errorResponse(res, 'Không tìm thấy danh sách yêu thích', HTTP_STATUS.NOT_FOUND);
    }

    // Find the embedded item by its _id
    const itemToRemove = favorites.items.id(itemId);

    if (!itemToRemove) {
      return errorResponse(res, 'Không tìm thấy sản phẩm trong danh sách yêu thích', HTTP_STATUS.NOT_FOUND);
    }

    // Remove the item from the embedded array
    favorites.items.pull(itemId);

    // Save the updated favorites document
    await favorites.save();

    // Return updated favorites with populated product details
    const updatedFavorites = await Favorites.findById(favorites._id)
      .populate({
        path: 'items.ProductID',
        select: 'Product_Name Price Main_Image'
      });

    successResponse(res, updatedFavorites, 'Đã xóa sản phẩm khỏi danh sách yêu thích');
  } catch (error) {
    console.error('Error removing from favorites:', error);
    errorResponse(res, 'Lỗi khi xóa sản phẩm khỏi danh sách yêu thích', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Clear favorites
// @route   DELETE /api/yeu-thich
// @access  Private
const clearFavorites = async (req, res) => {
  try {
    const favorites = await Favorites.findOne({ UserID: req.user._id, Status: 'active' });
    if (!favorites) {
      return errorResponse(res, 'Không tìm thấy danh sách yêu thích', HTTP_STATUS.NOT_FOUND);
    }

    // Clear favorites items array
    favorites.items = [];
    await favorites.save();

    successResponse(res, favorites, 'Đã xóa tất cả sản phẩm khỏi danh sách yêu thích');
  } catch (error) {
    console.error('Error clearing favorites:', error);
    errorResponse(res, 'Lỗi khi xóa danh sách yêu thích', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// @desc    Check if product is in favorites
// @route   GET /api/yeu-thich/check/:productId
// @access  Private
const checkFavoriteStatus = async (req, res) => {
  try {
    const { productId } = req.params;

    const favorites = await Favorites.findOne({ UserID: req.user._id, Status: 'active' });
    
    if (!favorites) {
      return successResponse(res, { isFavorite: false });
    }

    const isFavorite = favorites.items.some(item => item.ProductID.toString() === productId);
    
    successResponse(res, { isFavorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    errorResponse(res, 'Lỗi khi kiểm tra trạng thái yêu thích', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  checkFavoriteStatus
}; 