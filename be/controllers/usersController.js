const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  successResponse,
  errorResponse,
  HTTP_STATUS,
} = require("../utils/responseHandler");
const AuditLog = require("../models/AuditLog");
const auditLogger = require("../utils/auditLogger");
const {
  AUDIT_EVENTS,
  AUDIT_MODULES,
  AUDIT_TEMPLATES,
} = require("../utils/enums");
const { AUDIT_ENTITY_TYPES } = require("../utils/enums");

// Đăng ký người dùng mới
const register = async (req, res) => {
  try {
    const { UserName, Password, Email, Phone, FullName, Address } = req.body;

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ $or: [{ UserName }, { Email }] });
    if (existingUser) {
      return errorResponse(
        res,
        "Tên đăng nhập hoặc email đã tồn tại",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Tạo user mới
    const user = new User({
      UserName,
      Password,
      Email,
      Phone,
      FullName,
      Address,
    });

    await user.save();

    // Create audit log (non-blocking)
    auditLogger.log({
      actor: {
        id: (req.user && req.user._id) || user._id,
        userName: (req.user && req.user.UserName) || user.UserName,
        role: (req.user && req.user.Role) || user.Role,
      },
      module: AUDIT_MODULES.USERS,
      event: AUDIT_EVENTS.USER_CREATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: user._id,
      entityName: user.UserName || user.Email,
      messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.USER_CREATED],
      messageParams: {
        actor: (req.user && req.user.UserName) || user.UserName,
        target: user.UserName || user.Email,
      },
      metadata: { body: { UserName, Email, Phone, FullName, Address } },
    });

    // Tạo access token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    // Tạo refresh token (7 ngày)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    successResponse(
      res,
      { user, token, refreshToken },
      "Đăng ký thành công",
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    errorResponse(res, "Lỗi đăng ký", HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { UserName, Password } = req.body;

    // Tìm user
    const user = await User.findOne({ UserName });
    if (!user) {
      return errorResponse(
        res,
        "Tên đăng nhập không tồn tại",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Kiểm tra trạng thái tài khoản
    if (user.Status !== "active") {
      return errorResponse(
        res,
        "Tài khoản đã bị khóa",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(Password);
    if (!isMatch) {
      return errorResponse(
        res,
        "Mật khẩu không đúng",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Tạo access token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
    // Tạo refresh token (7 ngày)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const responseData = { user, token, refreshToken };
    successResponse(res, responseData, "Đăng nhập thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi đăng nhập",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Đăng xuất
const logout = async (req, res) => {
  try {
    // Trong thực tế, bạn có thể thêm token vào blacklist
    successResponse(res, null, "Đăng xuất thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi đăng xuất",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Refresh token endpoint
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return errorResponse(res, "Thiếu refresh token", HTTP_STATUS.BAD_REQUEST);
    }
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      return errorResponse(
        res,
        "Refresh token không hợp lệ hoặc đã hết hạn",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Kiểm tra trạng thái tài khoản
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(
        res,
        "Người dùng không tồn tại",
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    if (user.Status !== "active") {
      return errorResponse(
        res,
        "Tài khoản đã bị khóa",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Tạo access token mới
    const token = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
    successResponse(res, { token }, "Làm mới access token thành công");
  } catch (error) {
    errorResponse(
      res,
      "Lỗi refresh token",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Get all users with pagination and search
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;
    const query = {};

    // Search by username, email or phone
    if (search) {
      query.$or = [
        { UserName: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
        { Phone: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      query.Role = role;
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute query
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-Password") // Exclude password from response
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-Password");

    if (!user) {
      return errorResponse(res, "User not found", HTTP_STATUS.NOT_FOUND);
    }

    // Allow admin or the user themselves to get the user data
    if (
      req.user.role !== "admin" &&
      req.params.userId !== req.user._id.toString()
    ) {
      return errorResponse(
        res,
        "Không được phép truy cập thông tin người dùng này",
        HTTP_STATUS.FORBIDDEN
      );
    }

    successResponse(res, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { Password, ...updateData } = req.body; // Prevent password update through this route

    // Find the user to update
    const user = await User.findById(req.params.userId);

    if (!user) {
      return errorResponse(res, "User not found", HTTP_STATUS.NOT_FOUND);
    }

    // Pre-check duplicate username or email (exclude current user)
    const duplicateConditions = [];
    if (updateData.UserName) {
      duplicateConditions.push({ UserName: updateData.UserName });
    }
    if (updateData.Email) {
      duplicateConditions.push({ Email: updateData.Email });
    }
    if (duplicateConditions.length > 0) {
      const existing = await User.findOne({
        $and: [
          { _id: { $ne: req.params.userId } },
          { $or: duplicateConditions },
        ],
      });
      if (existing) {
        if (updateData.UserName && existing.UserName === updateData.UserName) {
          return errorResponse(
            res,
            "Tên đăng nhập đã tồn tại",
            HTTP_STATUS.BAD_REQUEST
          );
        }
        if (updateData.Email && existing.Email === updateData.Email) {
          return errorResponse(
            res,
            "Email đã tồn tại",
            HTTP_STATUS.BAD_REQUEST
          );
        }
        return errorResponse(
          res,
          "Dữ liệu đã tồn tại",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Update the user data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-Password");

    // Audit (non-blocking) with detailed changes and status lock/unlock
    const toText = (v) => (v === undefined || v === null ? "" : String(v));
    const changes = [];
    const fieldsToDescribe = [
      "UserName",
      "Email",
      "Phone",
      "FullName",
      "Address",
      "Role",
      "Status",
    ];
    for (const f of fieldsToDescribe) {
      if (Object.prototype.hasOwnProperty.call(updateData, f)) {
        const before = toText(user && user[f]);
        const after = toText(updatedUser && updatedUser[f]);
        if (before !== after) {
          changes.push(`${f}: '${before}' -> '${after}'`);
        }
      }
    }

    const isStatusChange = Object.prototype.hasOwnProperty.call(
      updateData,
      "Status"
    );
    const isLock = isStatusChange && updateData.Status === "inactive";
    const isUnlock = isStatusChange && updateData.Status === "active";

    auditLogger.log({
      actor: {
        id: req.user && req.user._id,
        userName: req.user && req.user.UserName,
        role: req.user && req.user.Role,
      },
      module: AUDIT_MODULES.USERS,
      event: isLock
        ? AUDIT_EVENTS.USER_STATUS_CHANGED
        : isUnlock
        ? AUDIT_EVENTS.USER_STATUS_CHANGED
        : AUDIT_EVENTS.USER_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: updatedUser && updatedUser._id,
      entityName:
        (updatedUser && (updatedUser.UserName || updatedUser.Email)) ||
        undefined,
      messageTemplate: isStatusChange
        ? AUDIT_TEMPLATES[AUDIT_EVENTS.USER_STATUS_CHANGED]
        : AUDIT_TEMPLATES[AUDIT_EVENTS.USER_UPDATED],
      messageParams: {
        actor: req.user && req.user.UserName,
        target: updatedUser && (updatedUser.UserName || updatedUser.Email),
        status: isStatusChange ? updateData.Status : undefined,
        changes: changes.join(", ") || "-",
      },
      metadata: { updateData, changes },
    });

    successResponse(res, updatedUser);
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST, error);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Audit (non-blocking)
    auditLogger.log({
      actor: {
        id: req.user && req.user._id,
        userName: req.user && req.user.UserName,
        role: req.user && req.user.Role,
      },
      module: AUDIT_MODULES.USERS,
      event: AUDIT_EVENTS.USER_DELETED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: user && user._id,
      entityName: (user && (user.UserName || user.Email)) || undefined,
      messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.USER_DELETED],
      messageParams: {
        actor: req.user && req.user.UserName,
        target: user && (user.UserName || user.Email),
      },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword, username } =
      req.body;

    // Validate input
    if (!newPassword || !confirmPassword) {
      return errorResponse(
        res,
        "Mật khẩu mới và xác nhận mật khẩu là bắt buộc",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(
        res,
        "Mật khẩu mới và xác nhận mật khẩu không khớp",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (newPassword.length < 6) {
      return errorResponse(
        res,
        "Mật khẩu mới phải có ít nhất 6 ký tự",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Additional password strength validation
    if (newPassword.length > 128) {
      return errorResponse(
        res,
        "Mật khẩu mới không được quá 128 ký tự",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Check for common weak passwords
    const weakPasswords = [
      "123456",
      "password",
      "123123",
      "admin",
      "qwerty",
      "111111",
      "123456789",
    ];
    if (weakPasswords.includes(newPassword.toLowerCase())) {
      return errorResponse(
        res,
        "Mật khẩu quá yếu, vui lòng chọn mật khẩu khác",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(
        res,
        "Không tìm thấy người dùng",
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if user is Google user (no current password required)
    const isGoogleUser = user.LoginProvider === "google";

    // For non-Google users, verify current password
    if (!isGoogleUser) {
      if (!currentPassword) {
        return errorResponse(
          res,
          "Mật khẩu hiện tại là bắt buộc",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return errorResponse(
          res,
          "Mật khẩu hiện tại không đúng",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Check if new password is same as current password
      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return errorResponse(
          res,
          "Mật khẩu mới không được trùng với mật khẩu hiện tại",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Handle username for Google users who don't have one
    if (username && !user.UserName) {
      // Check if username already exists
      const existingUser = await User.findOne({
        UserName: username,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return errorResponse(
          res,
          "Tên đăng nhập đã tồn tại",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      if (username.length < 3) {
        return errorResponse(
          res,
          "Tên đăng nhập phải có ít nhất 3 ký tự",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      user.UserName = username;
    }

    // Update password
    user.Password = newPassword; // Will be hashed by pre-save middleware

    // For Google users, also update LoginProvider to allow both login methods
    if (isGoogleUser) {
      // Keep Google OAuth but also allow username/password login
      // Don't change LoginProvider, just add password capability
    }

    await user.save();

    // Audit (non-blocking)
    auditLogger.log({
      actor: {
        id: req.user && (req.user.id || req.user._id),
        userName: req.user && req.user.UserName,
        role: req.user && req.user.Role,
      },
      module: AUDIT_MODULES.USERS,
      event: AUDIT_EVENTS.USER_PASSWORD_RESET,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: user && user._id,
      entityName: (user && (user.UserName || user.Email)) || undefined,
      messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.USER_PASSWORD_RESET],
      messageParams: {
        actor: (req.user && req.user.UserName) || "system",
        target: user && (user.UserName || user.Email),
      },
    });

    successResponse(
      res,
      {
        message: "Thay đổi mật khẩu thành công",
        hasUsername: !!user.UserName,
      },
      "Thay đổi mật khẩu thành công"
    );
  } catch (error) {
    console.error("Change password error:", error);
    errorResponse(
      res,
      "Lỗi server khi thay đổi mật khẩu",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Admin: reset another user's password (no current password required)
const adminResetPassword = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return errorResponse(
        res,
        "Mật khẩu mới và xác nhận mật khẩu là bắt buộc",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (newPassword !== confirmPassword) {
      return errorResponse(
        res,
        "Mật khẩu mới và xác nhận mật khẩu không khớp",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (newPassword.length < 6) {
      return errorResponse(
        res,
        "Mật khẩu mới phải có ít nhất 6 ký tự",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (newPassword.length > 128) {
      return errorResponse(
        res,
        "Mật khẩu mới không được quá 128 ký tự",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const weakPasswords = [
      "123456",
      "password",
      "123123",
      "admin",
      "qwerty",
      "111111",
      "123456789",
    ];
    if (weakPasswords.includes(newPassword.toLowerCase())) {
      return errorResponse(
        res,
        "Mật khẩu quá yếu, vui lòng chọn mật khẩu khác",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return errorResponse(
        res,
        "Không tìm thấy người dùng",
        HTTP_STATUS.NOT_FOUND
      );
    }

    user.Password = newPassword;
    await user.save();

    // Audit (non-blocking)
    auditLogger.log({
      actor: {
        id: req.user && req.user._id,
        userName: req.user && req.user.UserName,
        role: req.user && req.user.Role,
      },
      module: AUDIT_MODULES.USERS,
      event: AUDIT_EVENTS.USER_PASSWORD_RESET,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: user && user._id,
      entityName: (user && (user.UserName || user.Email)) || undefined,
      messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.USER_PASSWORD_RESET],
      messageParams: {
        actor: req.user && req.user.UserName,
        target: user && (user.UserName || user.Email),
      },
    });

    return successResponse(
      res,
      { message: "Cấp lại mật khẩu thành công" },
      "Cấp lại mật khẩu thành công"
    );
  } catch (error) {
    return errorResponse(
      res,
      "Lỗi server khi cấp lại mật khẩu",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshToken,
  changePassword,
  adminResetPassword,
};
