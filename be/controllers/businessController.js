const OrderTestDrive = require('../models/OrderTestDrive');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// Đặt lịch lái thử
const bookTestDrive = async (req, res) => {
  try {
    const { userId } = req.params;
    const { Test_Drive_Date, Address, Notes, CarModel } = req.body;
    
    // Tạo lịch lái thử
    const order = new OrderTestDrive({
      UserID: userId,
      Order_Date: new Date(),
      Test_Drive_Date,
      Address,
      Notes,
      CarModel,
      Total_Amount: 0 // Lái thử miễn phí
    });
    await order.save();
    
    successResponse(res, order, 'Đặt lịch lái thử thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    errorResponse(res, 'Lỗi đặt lịch lái thử', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Cập nhật trạng thái lịch lái thử
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { Status } = req.body;
    const order = await OrderTestDrive.findById(orderId);
    if (!order) {
      return errorResponse(res, 'Không tìm thấy lịch lái thử', HTTP_STATUS.NOT_FOUND);
    }
    order.Status = Status;
    await order.save();
    successResponse(res, order, 'Cập nhật trạng thái thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi cập nhật trạng thái', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  bookTestDrive,
  updateOrderStatus
}; 