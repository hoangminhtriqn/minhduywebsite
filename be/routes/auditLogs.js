const express = require("express");
const router = express.Router();
const {
  listAuditLogs,
  markLogsAsRead,
  deleteLogs,
} = require("../controllers/auditLogsController");
const { protect, authorizeAdminOnly } = require("../middleware/authMiddleware");

// Admin-only access to audit logs
router.get("/", protect, authorizeAdminOnly, listAuditLogs);
router.put("/mark-read", protect, authorizeAdminOnly, markLogsAsRead);
router.delete("/", protect, authorizeAdminOnly, deleteLogs);

module.exports = router;
