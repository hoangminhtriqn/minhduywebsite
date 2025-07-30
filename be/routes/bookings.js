const express = require("express");
const router = express.Router();
const bookingsController = require("../controllers/bookingsController");

// Route để khách hàng tạo booking mới
router.post("/", bookingsController.createBooking);

// Routes cho admin quản lý booking
router.get("/", bookingsController.getAllBookings);
router.get("/:bookingId", bookingsController.getBookingById);
router.put("/:bookingId/status", bookingsController.updateBookingStatus);
router.delete("/:bookingId", bookingsController.deleteBooking);

module.exports = router;
