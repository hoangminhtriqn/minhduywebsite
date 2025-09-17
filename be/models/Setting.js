const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    companyName: {
      type: String,
      default: "Minh Duy Technology",
    },
    phone: {
      type: String,
      default: "0123456789",
    },
    email: {
      type: String,
      default: "info@minhduy.com",
    },
    workingHours: {
      type: String,
      default: "8:00 - 18:00 (Thứ 2 - Thứ 7)",
    },
    logo: {
      type: String,
      default: "/images/logo.png",
    },
    serviceOverviewImage: {
      type: String,
      default: "/images/service_overview.jpg",
    },

    // Mạng xã hội
    facebook: {
      type: String,
      default: "https://facebook.com",
    },
    youtube: {
      type: String,
      default: "https://youtube.com",
    },
    tiktok: {
      type: String,
      default: "https://tiktok.com",
    },

    // Liên hệ trực tiếp
    zaloUrl: {
      type: String,
      default: "https://zalo.me/0123456789",
    },
    facebookMessengerUrl: {
      type: String,
      default: "https://m.me/your-facebook-page",
    },

    // Meta thông tin
    description: {
      type: String,
      default: "Công ty thiết bị công nghệ hàng đầu tại Việt Nam",
    },
    keywords: {
      type: String,
      default: "laptop, máy tính, thiết bị công nghệ",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
