const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

const getDashboard = async (req, res) => {
  try {
    // Service request stats
    const [
      totalRequests,
      pendingRequests,
      confirmedRequests,
      completedRequests,
      cancelledRequests
    ] = await Promise.all([
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ Status: 'pending' }),
      ServiceRequest.countDocuments({ Status: 'confirmed' }),
      ServiceRequest.countDocuments({ Status: 'completed' }),
      ServiceRequest.countDocuments({ Status: 'cancelled' })
    ]);
    
    const serviceRequestStats = {
      totalRequests,
      pendingRequests,
      confirmedRequests,
      completedRequests,
      cancelledRequests
    };

    // User stats
    const [totalUsers, adminCount, userCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ Role: 'admin' }),
      User.countDocuments({ Role: 'user' })
    ]);
    
    const userStats = { 
      totalUsers, 
      adminCount, 
      userCount 
    };

    successResponse(res, {
      userStats,
      serviceRequestStats
    });
  } catch (error) {
    errorResponse(res, 'Lỗi thống kê dashboard', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  getDashboard
}; 