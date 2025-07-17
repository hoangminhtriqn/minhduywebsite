const OrderTestDrive = require('../models/OrderTestDrive');
const User = require('../models/User');
const Product = require('../models/Product');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// Thống kê lịch lái thử
const getOrderStatistics = async (req, res) => {
  try {
    const totalOrders = await OrderTestDrive.countDocuments();
    const pendingOrders = await OrderTestDrive.countDocuments({ Status: 'pending' });
    const confirmedOrders = await OrderTestDrive.countDocuments({ Status: 'confirmed' });
    const completedOrders = await OrderTestDrive.countDocuments({ Status: 'completed' });
    const cancelledOrders = await OrderTestDrive.countDocuments({ Status: 'cancelled' });
    const totalAmount = await OrderTestDrive.aggregate([
      { $group: { _id: null, total: { $sum: '$Total_Amount' } } }
    ]);
    successResponse(res, {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      completedOrders,
      cancelledOrders,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    errorResponse(res, 'Lỗi thống kê lịch lái thử', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Thống kê người dùng
const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    // Số người dùng đã từng đặt lịch lái thử
    const usersWithOrders = await OrderTestDrive.distinct('UserID');
    const bookedUsers = usersWithOrders.length;
    successResponse(res, {
      totalUsers,
      bookedUsers
    });
  } catch (error) {
    errorResponse(res, 'Lỗi thống kê người dùng', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Thống kê sản phẩm
const getProductStatistics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    // Sản phẩm còn hàng: Stock > 0
    const availableProducts = await Product.countDocuments({ Stock: { $gt: 0 } });
    const outOfStockProducts = await Product.countDocuments({ Stock: 0 });
    successResponse(res, {
      totalProducts,
      availableProducts, // Sản phẩm còn hàng (Stock > 0)
      outOfStockProducts
    });
  } catch (error) {
    errorResponse(res, 'Lỗi thống kê sản phẩm', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Thống kê top 4 xe được lái thử nhiều nhất
const getTopTestDriveCars = async (req, res) => {
  try {
    const topCars = await OrderTestDrive.aggregate([
      { $group: { _id: '$ProductID', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'car'
        }
      },
      { $unwind: '$car' },
      { $project: { _id: 0, carName: '$car.Product_Name', count: 1 } }
    ]);
    successResponse(res, topCars);
  } catch (error) {
    errorResponse(res, 'Lỗi thống kê xe lái thử', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Thống kê số lượt đăng ký lái thử theo ngày
const getTestDriveRegistrationsByDate = async (req, res) => {
  try {
    const stats = await OrderTestDrive.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$CreatedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    successResponse(res, stats);
  } catch (error) {
    errorResponse(res, 'Lỗi thống kê đăng ký lái thử theo ngày', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// API tổng hợp dashboard
const getDashboardStatistics = async (req, res) => {
  try {
    // Order stats
    const totalOrders = await OrderTestDrive.countDocuments();
    const pendingOrders = await OrderTestDrive.countDocuments({ Status: 'pending' });
    const confirmedOrders = await OrderTestDrive.countDocuments({ Status: 'confirmed' });
    const completedOrders = await OrderTestDrive.countDocuments({ Status: 'completed' });
    const cancelledOrders = await OrderTestDrive.countDocuments({ Status: 'cancelled' });
    const totalTestDriveRevenue = await OrderTestDrive.aggregate([
      { $group: { _id: null, total: { $sum: '$Total_Amount' } } }
    ]);
    const orderStats = {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      completedOrders,
      cancelledOrders,
      totalTestDriveRevenue: totalTestDriveRevenue[0]?.total || 0 // Tổng doanh thu lái thử
    };

    // User stats
    const totalUsers = await User.countDocuments();
    const usersWithOrders = await OrderTestDrive.distinct('UserID');
    const bookedUsers = usersWithOrders.length;
    const userStats = { totalUsers, bookedUsers };

    // Product stats
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ Stock: { $gt: 0 } });
    const productStats = { totalProducts, availableProducts };

    // Top 4 test drive cars
    const topCars = await OrderTestDrive.aggregate([
      { $group: { _id: '$ProductID', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'car'
        }
      },
      { $unwind: '$car' },
      { $project: { _id: 0, carName: '$car.Product_Name', count: 1 } }
    ]);

    // Registrations by date
    const registrationsByDate = await OrderTestDrive.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    successResponse(res, {
      orderStats,
      userStats,
      productStats,
      topCars,
      registrationsByDate
    });
  } catch (error) {
    errorResponse(res, 'Lỗi thống kê dashboard', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  getOrderStatistics,
  getUserStatistics,
  getProductStatistics,
  getTopTestDriveCars,
  getTestDriveRegistrationsByDate,
  getDashboardStatistics
}; 