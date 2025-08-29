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
const { requirePermissions } = require("../middleware/permissionMiddleware");

// Permission catalog (can be public if used for UI; keep open or protect as needed)
router.get("/available", getAvailablePermissions);

// Route to get user permissions (requires authentication but not admin)
router.get("/user/:userId", protect, getUserPermissions);

// Employee management routes: protect then check fine-grained permissions
router.use(protect);

// List employees (permissions.view)
router.get(
  "/employees",
  requirePermissions("permissions.view"),
  getAllEmployees
);

// Create employee (permissions.create)
router.post(
  "/employees",
  requirePermissions("permissions.create"),
  createEmployee
);

// Update employee (permissions.edit), Delete (permissions.delete)
router.put(
  "/employees/:id",
  requirePermissions("permissions.edit"),
  updateEmployee
);
router.delete(
  "/employees/:id",
  requirePermissions("permissions.delete"),
  deleteEmployee
);

// View/Assign permissions for one employee (permissions.assign)
router.get(
  "/employees/:id/permissions",
  requirePermissions("permissions.assign"),
  getEmployeePermissions
);
router.put(
  "/employees/:id/permissions",
  requirePermissions("permissions.assign"),
  updateEmployeePermissions
);

module.exports = router;
