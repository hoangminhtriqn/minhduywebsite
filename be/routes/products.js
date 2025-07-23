const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getRelatedProducts } = require('../controllers/productsController');

// Public routes
router.get('/', getProducts);
router.get('/:productId', getProductById);
router.get('/:productId/related', getRelatedProducts);

// Protected routes (nếu cần, có thể thêm middleware protect ở đây)
router.post('/', createProduct);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router; 