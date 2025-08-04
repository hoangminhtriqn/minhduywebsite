const { USER_ROLES } = require("../models/User");
const RoleUser = require("../models/RoleUser");

/**
 * Middleware to check if user has specific permissions
 * @param {string|string[]} requiredPermissions - Permission(s) required to access the route
 * @returns {Function} Express middleware function
 */
const requirePermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Người dùng chưa được xác thực",
        });
      }

      // Convert single permission to array
      const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      let userPermissions = [];

      // Admin has all permissions
      if (user.Role === USER_ROLES.ADMIN) {
        // Admin automatically has all permissions
        return next();
      }
      // Employee - check their assigned permissions
      else if (user.Role === USER_ROLES.EMPLOYEE) {
        const roleUser = await RoleUser.findOne({ UserID: user._id }).populate(
          "RoleID"
        );
        userPermissions = roleUser?.RoleID?.Permissions || [];
      }
      // Regular users have no admin permissions
      else {
        return res.status(403).json({
          success: false,
          message: "Không có quyền truy cập",
        });
      }

      // Check if user has all required permissions
      const hasAllPermissions = permissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: "Không có quyền truy cập",
          required: permissions,
          userPermissions: userPermissions,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi kiểm tra quyền hạn",
        error: error.message,
      });
    }
  };
};

/**
 * Middleware to check if user can access admin panel (admin or employee)
 */
const requireAdminPanelAccess = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Người dùng chưa được xác thực",
      });
    }

    if (user.Role !== USER_ROLES.ADMIN && user.Role !== USER_ROLES.EMPLOYEE) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập admin panel",
      });
    }

    next();
  } catch (error) {
    console.error("Admin panel access check error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kiểm tra quyền truy cập",
      error: error.message,
    });
  }
};

module.exports = {
  requirePermissions,
  requireAdminPanelAccess,
};
