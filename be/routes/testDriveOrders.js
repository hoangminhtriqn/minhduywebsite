const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const TestDriveOrder = require('../models/OrderTestDrive');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders
} = require('../controllers/testDriveOrdersController');

// Get all orders (admin only)
router.get('/', auth, getAllOrders);

// Get order by ID
router.get('/:orderId', auth, getOrderById);

// Create new order
router.post('/', auth, createOrder);

// Update order
router.put('/:orderId', auth, updateOrder);

// Update order status
router.put('/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ 
        success: false,
        message: 'Status is required' 
      });
    }

    const order = await TestDriveOrder.findByIdAndUpdate(
      req.params.orderId,
      { Status: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Delete order
router.delete('/:orderId', auth, deleteOrder);

// Get user orders
router.get('/user/:userId', auth, getUserOrders);

module.exports = router; 