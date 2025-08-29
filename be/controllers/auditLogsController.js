const AuditLog = require("../models/AuditLog");
const {
  successResponse,
  errorResponse,
  HTTP_STATUS,
} = require("../utils/responseHandler");

// GET /api/audit-logs?search=&page=1&limit=10&read=
const listAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", read } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { module: { $regex: search, $options: "i" } },
        { event: { $regex: search, $options: "i" } },
        { actorUserName: { $regex: search, $options: "i" } },
        { entityName: { $regex: search, $options: "i" } },
      ];
    }
    if (read === "true") query.read = true;
    if (read === "false") query.read = false;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AuditLog.countDocuments(query),
    ]);

    return successResponse(res, {
      items,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    return errorResponse(
      res,
      "Không thể tải nhật ký hệ thống",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// PUT /api/audit-logs/mark-read
const markLogsAsRead = async (req, res) => {
  try {
    const { ids } = req.body; // array of ids
    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, "Thiếu danh sách ID", HTTP_STATUS.BAD_REQUEST);
    }
    await AuditLog.updateMany({ _id: { $in: ids } }, { $set: { read: true } });
    return successResponse(res, { updated: ids.length }, "Đã đánh dấu đã xem");
  } catch (error) {
    return errorResponse(
      res,
      "Không thể đánh dấu đã xem",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// DELETE /api/audit-logs  body: { ids: [], purge?: boolean, restore?: boolean }
const deleteLogs = async (req, res) => {
  try {
    const { ids, purge = false, restore = false } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, "Thiếu danh sách ID", HTTP_STATUS.BAD_REQUEST);
    }
    // Optionally restore or purge related bookings based on selected logs
    if (purge || restore) {
      try {
        const Booking = require("../models/Booking");
        const {
          AUDIT_EVENTS,
          AUDIT_TEMPLATES,
          AUDIT_ENTITY_TYPES,
          AUDIT_MODULES,
        } = require("../utils/enums");
        const auditLogger = require("../utils/auditLogger");
        const logs = await AuditLog.find({ _id: { $in: ids } });
        for (const log of logs) {
          if (log.entityType === "Booking" && log.entityId) {
            const booking = await Booking.findById(log.entityId);
            if (!booking) continue;
            if (restore && booking.Deleted) {
              const targetStr = `${booking.FullName || "Khách"}${
                booking.Phone ? " - " + booking.Phone : ""
              }`;
              booking.Deleted = false;
              booking.DeletedAt = null;
              await booking.save();
              auditLogger.log({
                actor: {
                  id: req.user && req.user._id,
                  userName: req.user && req.user.UserName,
                  role: req.user && req.user.Role,
                },
                module: AUDIT_MODULES.BOOKINGS,
                event: AUDIT_EVENTS.BOOKING_RESTORED,
                entityType: AUDIT_ENTITY_TYPES.BOOKING,
                entityId: booking._id,
                entityName: targetStr,
                messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.BOOKING_RESTORED],
                messageParams: {
                  actor: (req.user && req.user.UserName) || "system",
                  target: targetStr,
                },
              });
            }
            if (purge) {
              const targetStr = `${booking.FullName || "Khách"}${
                booking.Phone ? " - " + booking.Phone : ""
              }`;
              await Booking.deleteOne({ _id: booking._id });
              auditLogger.log({
                actor: {
                  id: req.user && req.user._id,
                  userName: req.user && req.user.UserName,
                  role: req.user && req.user.Role,
                },
                module: AUDIT_MODULES.BOOKINGS,
                event: AUDIT_EVENTS.BOOKING_PURGED,
                entityType: AUDIT_ENTITY_TYPES.BOOKING,
                entityId: booking._id,
                entityName: targetStr,
                messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.BOOKING_PURGED],
                messageParams: {
                  actor: (req.user && req.user.UserName) || "system",
                  target: targetStr,
                },
              });
            }
          }
        }
      } catch (_) {}
    }
    const result = await AuditLog.deleteMany({ _id: { $in: ids } });
    return successResponse(
      res,
      { deleted: result.deletedCount },
      "Đã xóa nhật ký"
    );
  } catch (error) {
    return errorResponse(
      res,
      "Không thể xóa nhật ký",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

module.exports = { listAuditLogs, markLogsAsRead, deleteLogs };
