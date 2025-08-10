const Booking = require("../models/Booking");
const {
  successResponse,
  errorResponse,
  HTTP_STATUS,
} = require("../utils/responseHandler");

// Lấy danh sách booking
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    const query = {};

    // Tìm kiếm theo tên, email, số điện thoại
    if (search) {
      query.$or = [
        { FullName: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
        { Phone: { $regex: search, $options: "i" } },
      ];
    }

    // Lọc theo trạng thái
    if (status) {
      query.Status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate("ServiceTypes", "name")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    successResponse(res, {
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    errorResponse(
      res,
      "Lỗi lấy danh sách booking",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Lấy thông tin booking theo ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate(
      "ServiceTypes",
      "name"
    );
    if (!booking) {
      return errorResponse(
        res,
        "Không tìm thấy booking",
        HTTP_STATUS.NOT_FOUND
      );
    }
    successResponse(res, booking);
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    errorResponse(
      res,
      "Lỗi lấy thông tin booking",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Cập nhật trạng thái booking
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return errorResponse(
        res,
        "Không tìm thấy booking",
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return errorResponse(
        res,
        "Trạng thái không hợp lệ",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    booking.Status = status;
    await booking.save();

    successResponse(res, booking, "Cập nhật trạng thái booking thành công");
  } catch (error) {
    console.error("Error updating booking status:", error);
    errorResponse(
      res,
      "Lỗi cập nhật trạng thái booking",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// Xóa booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.bookingId);
    if (!booking) {
      return errorResponse(
        res,
        "Không tìm thấy booking",
        HTTP_STATUS.NOT_FOUND
      );
    }
    successResponse(res, null, "Xóa booking thành công");
  } catch (error) {
    console.error("Error deleting booking:", error);
    errorResponse(res, "Lỗi xóa booking", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// API endpoint cho khách hàng tạo booking mới
const createBooking = async (req, res) => {
  try {
    const {
      FullName,
      Email,
      Phone,
      Address,
      ServiceTypes,
      BookingDate,
      BookingTime,
      Notes,
    } = req.body;

    const newBooking = new Booking({
      FullName,
      Email,
      Phone,
      Address,
      ServiceTypes,
      BookingDate,
      BookingTime,
      Notes,
    });

    await newBooking.save();

    successResponse(
      res,
      newBooking,
      "Đăng ký booking thành công",
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return errorResponse(res, messages.join(", "), HTTP_STATUS.BAD_REQUEST);
    }
    errorResponse(
      res,
      "Lỗi đăng ký booking",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  createBooking,
};
