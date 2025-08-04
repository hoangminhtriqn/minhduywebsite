const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { USER_ROLES } = require("../models/User");

// Middleware xác thực JWT
const auth = async (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token xác thực",
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user từ token
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Thêm user vào request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

// Middleware kiểm tra quyền admin
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.Role !== USER_ROLES.ADMIN) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền truy cập",
        });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Xác thực thất bại",
    });
  }
};

// Middleware kiểm tra quyền admin panel (admin hoặc employee)
const adminPanelAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (
        req.user.Role !== USER_ROLES.ADMIN &&
        req.user.Role !== USER_ROLES.EMPLOYEE
      ) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền truy cập admin panel",
        });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Xác thực thất bại",
    });
  }
};

module.exports = {
  auth,
  adminAuth,
  adminPanelAuth,
};
