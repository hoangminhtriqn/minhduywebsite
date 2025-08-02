const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse, HTTP_STATUS } = require("../utils/responseHandler");
const { USER_ROLES } = require("../models/User");

// Middleware to protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check JWT_SECRET
  if (!process.env.JWT_SECRET) {
    return errorResponse(
      res,
      "Server configuration error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  // Check for token in headers (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token payload and attach to request (excluding password)
      req.user = await User.findById(decoded.userId).select("-Password");

      if (!req.user) {
        return errorResponse(res, "User not found", HTTP_STATUS.UNAUTHORIZED);
      }

      // Kiểm tra trạng thái tài khoản
      if (req.user.Status !== "active") {
        return errorResponse(
          res,
          "Tài khoản đã bị khóa",
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      next(); // Move to the next middleware/route handler
    } catch (error) {
      errorResponse(
        res,
        "Không được phép truy cập (token lỗi hoặc hết hạn)",
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  } else {
    errorResponse(
      res,
      "Không có token, không được phép truy cập",
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};

// Middleware to authorize users based on roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is attached by the protect middleware
    if (!req.user || !roles.includes(req.user.Role)) {
      return errorResponse(
        res,
        `Người dùng với vai trò ${
          req.user ? req.user.Role : "không xác định"
        } không được phép truy cập tài nguyên này`,
        HTTP_STATUS.FORBIDDEN
      );
    }
    next(); // User has the required role(s), move to the next middleware/route handler
  };
};

module.exports = {
  protect,
  authorize,
};
