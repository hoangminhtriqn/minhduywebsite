const User = require('../models/User');
const Booking = require('../models/Booking');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

const getDashboard = async (req, res) => {
  try {
    // Booking stats
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ Status: 'pending' }),
      Booking.countDocuments({ Status: 'confirmed' }),
      Booking.countDocuments({ Status: 'completed' }),
      Booking.countDocuments({ Status: 'cancelled' })
    ]);
    
    const bookingStats = {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings
    };

    // User stats
    const [totalUsers, adminCount, employeeCount, userCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ Role: 'admin' }),
      User.countDocuments({ Role: 'employee' }),
      User.countDocuments({ Role: 'user' })
    ]);
    
    const userStats = { 
      totalUsers, 
      adminCount, 
      employeeCount,
      userCount 
    };

    successResponse(res, {
      userStats,
      bookingStats
    });
  } catch (error) {
    errorResponse(res, 'Lỗi thống kê dashboard', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  getDashboard
};
