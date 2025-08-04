const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getPublicSettings,
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} = require("../controllers/settingsController");
const { auth, adminAuth } = require("../middleware/auth");
const {
  requirePermissions,
  requireAdminPanelAccess,
} = require("../middleware/permissionMiddleware");
const { USER_ROLES } = require("../models/User");

// Public route để lấy settings cho frontend
router.get("/public", getPublicSettings);

// Admin routes (cần authentication và permissions)
router.get("/", auth, requirePermissions("settings.view"), getSettings);
router.put("/", auth, requirePermissions("settings.update"), updateSettings);

// Địa chỉ (locations) - quản trị
router.get(
  "/locations",
  auth,
  requirePermissions("settings.locations.manage"),
  getAllLocations
);
router.post(
  "/locations",
  auth,
  requirePermissions("settings.locations.manage"),
  createLocation
);
router.put(
  "/locations/:id",
  auth,
  requirePermissions("settings.locations.manage"),
  updateLocation
);
router.delete(
  "/locations/:id",
  auth,
  requirePermissions("settings.locations.manage"),
  deleteLocation
);

// Slides - quản trị
router.get(
  "/slides",
  auth,
  requirePermissions("settings.slides.manage"),
  getAllSlides
);
router.post(
  "/slides",
  auth,
  requirePermissions("settings.slides.manage"),
  createSlide
);
router.put(
  "/slides/:id",
  auth,
  requirePermissions("settings.slides.manage"),
  updateSlide
);
router.delete(
  "/slides/:id",
  auth,
  requirePermissions("settings.slides.manage"),
  deleteSlide
);

module.exports = router;
