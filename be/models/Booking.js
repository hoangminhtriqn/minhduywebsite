const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    Phone: {
      type: String,
      required: true,
      match: [/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"],
    },
    Address: {
      type: String,
      required: true,
      trim: true,
    },
    CarModel: {
      type: String,
      required: true,
      trim: true,
    },
    TestDriveDate: {
      type: Date,
      required: true,
    },
    TestDriveTime: {
      type: String,
      required: true,
      enum: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
      ],
    },
    Notes: {
      type: String,
      trim: true,
    },
    Status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
      validate: {
        validator: function (value) {
          return ["pending", "confirmed", "completed", "cancelled"].includes(
            value
          );
        },
        message: "Trạng thái không hợp lệ",
      },
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
