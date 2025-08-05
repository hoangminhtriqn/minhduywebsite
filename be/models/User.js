const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Enum for user roles
const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  EMPLOYEE: "employee",
};

const LOGIN_PROVIDERS = {
  LOCAL: "local",
  GOOGLE: "google",
};

const userSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: function() {
        return this.LoginProvider === LOGIN_PROVIDERS.LOCAL;
      },
      unique: true,
      sparse: true, // Allows null/undefined values but ensures uniqueness when present
      trim: true,
    },
    Password: {
      type: String,
      required: function() {
        return this.LoginProvider === LOGIN_PROVIDERS.LOCAL;
      },
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    Email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Email không hợp lệ",
      ],
    },
    Phone: {
      type: String,
      required: function() {
        return this.LoginProvider === LOGIN_PROVIDERS.LOCAL;
      },
      match: [/^[0-9]{10}$/, "Số điện thoại không hợp lệ"],
      default: function() {
        return this.LoginProvider === LOGIN_PROVIDERS.GOOGLE ? '0000000000' : undefined;
      }
    },
    FullName: {
      type: String,
      trim: true,
    },
    Address: {
      type: String,
      trim: true,
    },
    Role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    Status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    Avatar: {
      type: String,
      trim: true,
      default: null,
    },
    // Google OAuth fields
    GoogleId: {
      type: String,
      sparse: true, // Allows null values but ensures uniqueness when present
      unique: true,
    },
    LoginProvider: {
      type: String,
      enum: Object.values(LOGIN_PROVIDERS),
      default: LOGIN_PROVIDERS.LOCAL,
    },
  },
  {
    timestamps: true,
  }
);

// Mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  // Only skip if password is not modified
  if (!this.isModified("Password")) return next();

  // Skip hashing if password is already hashed (starts with $2b$ bcrypt hash)
  if (this.Password && this.Password.startsWith('$2b$')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Phương thức so sánh mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
  // If user doesn't have a password set, return false
  if (!this.Password) return false;
  
  // Compare with hashed password
  return bcrypt.compare(candidatePassword, this.Password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.USER_ROLES = USER_ROLES;
module.exports.LOGIN_PROVIDERS = LOGIN_PROVIDERS;
