const mongoose = require('mongoose');

const deviceRentalSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID người dùng là bắt buộc']
  },
  ProductID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'ID thiết bị là bắt buộc']
  },
  Order_Date: {
    type: Date,
    required: [true, 'Ngày đặt thuê là bắt buộc']
  },
  Rental_Start_Date: {
    type: Date,
    required: [true, 'Ngày bắt đầu thuê là bắt buộc']
  },
  Rental_End_Date: {
    type: Date,
    required: [true, 'Ngày kết thúc thuê là bắt buộc']
  },
  Address: {
    type: String,
    required: [true, 'Địa chỉ giao hàng là bắt buộc']
  },
  Status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'returned', 'cancelled'],
    default: 'pending'
  },
  Notes: {
    type: String
  },
  Total_Amount: {
    type: Number,
    required: [true, 'Tổng tiền thuê là bắt buộc'],
    min: [0, 'Tổng tiền không được âm']
  },
  Quantity: {
    type: Number,
    default: 1,
    min: [1, 'Số lượng tối thiểu là 1']
  },
  ImageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Virtual populate cho người dùng
deviceRentalSchema.virtual('user', {
  ref: 'User',
  localField: 'UserID',
  foreignField: '_id',
  justOne: true
});

// Virtual populate cho thiết bị
deviceRentalSchema.virtual('product', {
  ref: 'Product',
  localField: 'ProductID',
  foreignField: '_id',
  justOne: true
});

// Cấu hình để virtual fields được trả về trong JSON
deviceRentalSchema.set('toJSON', { virtuals: true });
deviceRentalSchema.set('toObject', { virtuals: true });

const DeviceRental = mongoose.model('DeviceRental', deviceRentalSchema);

module.exports = DeviceRental;
