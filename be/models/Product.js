const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    Product_Name: {
      type: String,
      required: [true, "Tên thiết bị là bắt buộc"],
      trim: true,
    },
    CategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Danh mục thiết bị là bắt buộc"],
    },
    Description: {
      type: String,
      trim: true,
    },
    Price: {
      type: Number,
      required: [true, "Giá thuê thiết bị là bắt buộc"],
      min: [0, "Giá thuê không được âm"],
    },
    Main_Image: {
      type: String,
      required: [true, "Hình ảnh chính là bắt buộc"],
    },
    List_Image: [
      {
        type: String,
      },
    ],
    Specifications: {
      type: Map,
      of: String,
    },

    Stock: {
      type: Number,
      default: 1,
      min: [0, "Số lượng không được âm"],
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index cho tìm kiếm
productSchema.index({ Product_Name: "text", Description: "text" });

// Virtual populate cho danh mục
productSchema.virtual("category", {
  ref: "Category",
  localField: "CategoryID",
  foreignField: "_id",
  justOne: true,
});

// Middleware trước khi lưu để đảm bảo URL ảnh hợp lệ
// productSchema.pre('save', function(next) {
//   if (this.isModified('Main_Image') && !this.Main_Image.startsWith('https://res.cloudinary.com/')) {
//     next(new Error('URL hình ảnh chính không hợp lệ'));
//   }

//   if (this.isModified('List_Image')) {
//     const invalidImages = this.List_Image.filter(img => !img.startsWith('https://res.cloudinary.com/'));
//     if (invalidImages.length > 0) {
//       next(new Error('Có URL hình ảnh phụ không hợp lệ'));
//     }
//   }

//   next();
// }); // Bỏ toàn bộ middleware pre('save') này

// Cấu hình để virtual fields được trả về trong JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
