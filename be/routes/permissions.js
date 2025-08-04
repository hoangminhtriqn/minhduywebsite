const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeePermissions,
  getAvailablePermissions,
  getEmployeePermissions,
  getUserPermissions,
} = require("../controllers/permissionsController");
const {
  protect,
  authorize,
  authorizeAdminPanel,
  authorizeAdminOnly,
} = require("../middleware/authMiddleware");

// Permission management routes (public - needed for frontend to load permission list)
router.get("/available", getAvailablePermissions);

// Route to get user permissions (requires authentication but not admin)
router.get("/user/:userId", protect, getUserPermissions);

// Employee management routes require admin only access
router.use(protect, authorizeAdminOnly);

// Employee management routes
router.route("/employees").get(getAllEmployees).post(createEmployee);

router.route("/employees/:id").put(updateEmployee).delete(deleteEmployee);
router.get("/employees/:id/permissions", getEmployeePermissions);
router.put("/employees/:id/permissions", updateEmployeePermissions);

module.exports = router;
