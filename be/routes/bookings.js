const express = require("express");
const router = express.Router();
const bookingsController = require("../controllers/bookingsController");
const { auth, adminPanelAuth } = require("../middleware/auth");
const {
  requirePermissions,
  requireAdminPanelAccess,
} = require("../middleware/permissionMiddleware");

// Route để khách hàng tạo booking mới
router.post("/", bookingsController.createBooking);

// Routes cho admin quản lý booking
router.get(
  "/",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.view"),
  bookingsController.getAllBookings
);
router.get(
  "/:bookingId",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.details.view"),
  bookingsController.getBookingById
);
router.put(
  "/:bookingId/status",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.status.update"),
  bookingsController.updateBookingStatus
);
router.delete(
  "/:bookingId",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.delete"),
  bookingsController.deleteBooking
);

module.exports = router;
