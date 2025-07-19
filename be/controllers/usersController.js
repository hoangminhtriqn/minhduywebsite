const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse, HTTP_STATUS } = require('../utils/responseHandler');

// Đăng ký người dùng mới
const register = async (req, res) => {
  try {
    const { UserName, Password, Email, Phone, FullName, Address } = req.body;

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ $or: [{ UserName }, { Email }] });
    if (existingUser) {
      return errorResponse(res, 'Tên đăng nhập hoặc email đã tồn tại', HTTP_STATUS.BAD_REQUEST);
    }

    // Tạo user mới
    const user = new User({
      UserName,
      Password,
      Email,
      Phone,
      FullName,
      Address
    });

    await user.save();
    
    // Tạo token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    successResponse(res, { user, token }, 'Đăng ký thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    errorResponse(res, 'Lỗi đăng ký', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { UserName, Password } = req.body;

    console.log('🔍 Login attempt for user:', UserName);
    console.log('🔧 Environment variables:', {
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 'NOT SET'
    });

    // Tìm user
    const user = await User.findOne({ UserName });
    if (!user) {
      console.log('❌ User not found:', UserName);
      return errorResponse(res, 'Tên đăng nhập không tồn tại', HTTP_STATUS.UNAUTHORIZED);
    }

    console.log('✅ User found:', user.UserName);

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(Password);
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', UserName);
      return errorResponse(res, 'Mật khẩu không đúng', HTTP_STATUS.UNAUTHORIZED);
    }

    console.log('✅ Password verified for user:', UserName);

    // Tạo token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    console.log('✅ Token created successfully');

    const responseData = { user, token };
    console.log('📤 Sending response:', JSON.stringify(responseData, null, 2));

    successResponse(res, responseData, 'Đăng nhập thành công');
  } catch (error) {
    console.error('❌ Login error:', error);
    errorResponse(res, 'Lỗi đăng nhập', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Đăng xuất
const logout = async (req, res) => {
  try {
    // Trong thực tế, bạn có thể thêm token vào blacklist
    successResponse(res, null, 'Đăng xuất thành công');
  } catch (error) {
    errorResponse(res, 'Lỗi đăng xuất', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
  }
};

// Get all users with pagination and search
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const query = {};

    // Search by username, email or phone
    if (search) {
      query.$or = [
        { UserName: { $regex: search, $options: 'i' } },
        { Email: { $regex: search, $options: 'i' } },
        { Phone: { $regex: search, $options: 'i' } }
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
        .select('-Password') // Exclude password from response
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-Password');

    if (!user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Allow admin or the user themselves to get the user data
    if (req.user.role !== 'admin' && req.params.userId !== req.user._id.toString()) {
        return errorResponse(res, 'Không được phép truy cập thông tin người dùng này', HTTP_STATUS.FORBIDDEN);
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
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Update the user data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-Password');
    
    successResponse(res, updatedUser);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}; 