const jwt = require('jsonwebtoken');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// Google Auth Success - Handle successful Google OAuth callback
const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:9200'}/login?error=auth_failed`);
    }

    // Tạo JWT token giống như login thông thường
    const token = jwt.sign(
      { userId: req.user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    // Tạo refresh token
    const refreshToken = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect về frontend với token trong URL
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:9200';
          const redirectURL = `${frontendURL}/#/dang-nhap/thanh-cong?token=${token}&refreshToken=${refreshToken}`;
    
    res.redirect(redirectURL);
  } catch (error) {http://localhost:9200/dang-nhap/thanh-cong?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxODliNWU3YWU0Yjc4MWZhMDJiMTIiLCJpYXQiOjE3NTQzNzAxMTQsImV4cCI6MTc2MjE0NjExNH0.-uuvhzNO9sTj9qZNlWz_Sin0nQgso6hilJpwy-SOa1o&refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxODliNWU3YWU0Yjc4MWZhMDJiMTIiLCJpYXQiOjE3NTQzNzAxMTQsImV4cCI6MTc1NDk3NDkxNH0.ZNbyxhlTjX2c8OOZDppXiPppMImWozDK_NugHYkG0Ew
    console.error('Google Auth Success Error:', error);
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:9200';
    res.redirect(`${frontendURL}/#/dang-nhap?error=server_error`);
  }
};

// Google Auth Failure - Handle failed Google OAuth
const googleAuthFailure = async (req, res) => {
  console.error('Google Auth Failure');
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:9200';
  res.redirect(`${frontendURL}/#/dang-nhap?error=google_auth_failed`);
};

// Get current user info (for authenticated users)
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.UNAUTHORIZED);
    }

    // Remove sensitive information
    const userInfo = {
      _id: req.user._id,
      Email: req.user.Email,
      FullName: req.user.FullName,
      Avatar: req.user.Avatar,
      Role: req.user.Role,
      Status: req.user.Status,
      LoginProvider: req.user.LoginProvider,
    };

    successResponse(res, userInfo, 'User info retrieved successfully');
  } catch (error) {
    errorResponse(res, 'Error retrieving user info', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  googleAuthSuccess,
  googleAuthFailure,
  getCurrentUser
};