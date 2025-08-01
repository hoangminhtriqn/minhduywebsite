const express = require("express");
const router = express.Router();
const {
  getAllPricing,
  getAllPricingAdmin,
  getPricingById,
  createPricing,
  updatePricing,
  deletePricing,
} = require("../controllers/pricingController");
const { auth, adminAuth } = require("../middleware/auth");

// Public routes
router.get("/", getAllPricing);

// Admin routes (protected)
router.get("/admin", auth, adminAuth, getAllPricingAdmin);
router.get("/admin/:id", auth, adminAuth, getPricingById);
router.post("/admin", auth, adminAuth, createPricing);
router.put("/admin/:id", auth, adminAuth, updatePricing);
router.delete("/admin/:id", auth, adminAuth, deletePricing);

module.exports = router;
