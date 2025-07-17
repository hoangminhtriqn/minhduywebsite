const express = require('express');
const router = express.Router();
const { bookTestDrive, updateOrderStatus } = require('../controllers/businessController');

router.post('/nguoi-dung/:userId/dat-lich', bookTestDrive);
router.put('/lich-lai-thu/:orderId/trang-thai', updateOrderStatus);

module.exports = router;
