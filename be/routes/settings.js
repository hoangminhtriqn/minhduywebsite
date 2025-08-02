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
const { USER_ROLES } = require("../models/User");

// Public route để lấy settings cho frontend
router.get("/public", getPublicSettings);

// Admin routes (cần authentication)
router.get("/", auth, adminAuth, getSettings);
router.put("/", auth, adminAuth, updateSettings);

// Địa chỉ (locations) - quản trị
router.get("/locations", auth, adminAuth, getAllLocations);
router.post("/locations", auth, adminAuth, createLocation);
router.put("/locations/:id", auth, adminAuth, updateLocation);
router.delete("/locations/:id", auth, adminAuth, deleteLocation);

// Slides - quản trị
router.get("/slides", auth, adminAuth, getAllSlides);
router.post("/slides", auth, adminAuth, createSlide);
router.put("/slides/:id", auth, adminAuth, updateSlide);
router.delete("/slides/:id", auth, adminAuth, deleteSlide);

module.exports = router;
