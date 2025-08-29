const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    Role_Name: {
      type: String,
      required: [true, "Tên vai trò là bắt buộc"],
      unique: true,
      trim: true,
    },
    Role_Description: {
      type: String,
      trim: true,
    },
    Permissions: [
      {
        type: String,
        enum: [
          // Dashboard
          "dashboard.view",
          "dashboard.stats.view",

          // Users
          "users.view",
          "users.edit",
          "users.status.update",
          "users.role.view",
          "users.role.update",

          // Products
          "products.view",
          "products.create",
          "products.edit",
          "products.delete",
          "products.favorites.view",

          // Categories
          "categories.view",
          "categories.create",
          "categories.edit",
          "categories.delete",
          "categories.reorder",
          "categories.visibility.toggle",
          "categories.hierarchy.manage",

          // Services
          "services.view",
          "services.create",
          "services.edit",
          "services.delete",
          "services.media.upload",

          // Bookings
          "bookings.view",
          "bookings.details.view",
          "bookings.status.update",
          "bookings.delete",
          "bookings.service_types.manage",

          // News
          "news.view",
          "news.create",
          "news.edit",
          "news.delete",
          "news.preview",
          "news.media.upload",

          // Pricing
          "pricing.view",
          "pricing.create",
          "pricing.edit",
          "pricing.delete",
          "pricing.details.view",
          "pricing.features.manage",
          "pricing.documents.manage",

          // Settings
          "settings.view",
          "settings.update",
          "settings.locations.manage",
          "settings.slides.manage",
          "settings.contact.update",
          "settings.seo.update",

          // Permissions
          "permissions.view",
          "permissions.create",
          "permissions.edit",
          "permissions.delete",
          "permissions.assign",
          "permissions.revoke",
        ],
      },
    ],
    Status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index cho tìm kiếm
roleSchema.index({ Role_Name: "text" });

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
