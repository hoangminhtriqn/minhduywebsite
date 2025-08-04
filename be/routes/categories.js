const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  updateCategoryIcon,
  updateCategoryFull,
  getCategoriesForFilter,
  getCategoriesHierarchy,
} = require("../controllers/categoriesController");
const {
  protect,
  authorize,
  authorizeAdminPanel,
  authorizeAdminOnly,
} = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

// Public routes
router.get("/", getCategoriesHierarchy);
router.get("/hierarchy", getCategoriesHierarchy);
router.get("/filter", getCategoriesForFilter);
router.get("/tree", getCategoryTree);
router.get("/:id", getCategoryById);

// Protected routes (Admin panel access)
router.get("/admin/all", protect, authorizeAdminPanel, getAllCategories);
router.post(
  "/",
  protect,
  authorizeAdminPanel,
  upload.single("Image"),
  createCategory
);
router.put(
  "/:id",
  protect,
  authorizeAdminPanel,
  upload.single("Image"),
  updateCategory
);
router.put("/:id/icon", protect, authorizeAdminPanel, updateCategoryIcon);
router.put("/:id/full", protect, authorizeAdminPanel, updateCategoryFull);
router.delete("/:id", protect, authorizeAdminOnly, deleteCategory);

module.exports = router;
