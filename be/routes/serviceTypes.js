const express = require("express");
const router = express.Router();
const serviceTypesController = require("../controllers/serviceTypesController");
const { auth, adminPanelAuth } = require("../middleware/auth");
const {
  requirePermissions,
  requireAdminPanelAccess,
} = require("../middleware/permissionMiddleware");

// Routes cho admin quản lý service types
router.get(
  "/",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.service_types.manage"),
  serviceTypesController.getAllServiceTypes
);
// Public active list for FE dropdown
router.get("/active", serviceTypesController.getActiveServiceTypes);
router.get(
  "/:serviceTypeId",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.service_types.manage"),
  serviceTypesController.getServiceTypeById
);
router.post(
  "/",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.service_types.manage"),
  serviceTypesController.createServiceType
);
router.put(
  "/:serviceTypeId",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.service_types.manage"),
  serviceTypesController.updateServiceType
);
router.delete(
  "/:serviceTypeId",
  auth,
  requireAdminPanelAccess,
  requirePermissions("bookings.service_types.manage"),
  serviceTypesController.deleteServiceType
);

module.exports = router;
