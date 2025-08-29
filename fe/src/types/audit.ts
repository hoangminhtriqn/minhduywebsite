// Keep FE audit event keys in sync with BE (be/utils/enums.js AUDIT_EVENTS)
export enum AuditEvents {
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
  USER_STATUS_CHANGED = "user.status.changed",
  USER_PASSWORD_RESET = "user.password.reset",

  EMPLOYEE_CREATED = "employee.created",
  EMPLOYEE_UPDATED = "employee.updated",
  EMPLOYEE_DELETED = "employee.deleted",

  PERMISSIONS_ASSIGNED = "permissions.assigned",
  PERMISSIONS_REVOKED = "permissions.revoked",

  // Bookings
  BOOKING_STATUS_CHANGED = "booking.status.changed",
  BOOKING_DELETED = "booking.deleted",
  BOOKING_RESTORED = "booking.restored",
  BOOKING_PURGED = "booking.purged",
}

// Vietnamese labels for displaying actions
export const AUDIT_EVENT_LABELS: Record<string, string> = {
  [AuditEvents.USER_CREATED]: "Tạo người dùng",
  [AuditEvents.USER_UPDATED]: "Cập nhật người dùng",
  [AuditEvents.USER_DELETED]: "Xóa người dùng",
  [AuditEvents.USER_STATUS_CHANGED]: "Đổi trạng thái người dùng",
  [AuditEvents.USER_PASSWORD_RESET]: "Cấp lại mật khẩu người dùng",

  [AuditEvents.EMPLOYEE_CREATED]: "Thêm nhân viên",
  [AuditEvents.EMPLOYEE_UPDATED]: "Cập nhật nhân viên",
  [AuditEvents.EMPLOYEE_DELETED]: "Xóa nhân viên",

  [AuditEvents.PERMISSIONS_ASSIGNED]: "Cấp quyền",
  [AuditEvents.PERMISSIONS_REVOKED]: "Thu hồi quyền",

  [AuditEvents.BOOKING_STATUS_CHANGED]: "Đổi trạng thái booking",
  [AuditEvents.BOOKING_DELETED]: "Xóa booking",
  [AuditEvents.BOOKING_RESTORED]: "Khôi phục booking",
  [AuditEvents.BOOKING_PURGED]: "Xóa vĩnh viễn booking",
};

// Optional: shared FE enum for entity types if needed for UI logic
export enum AuditEntityTypes {
  USER = "User",
  EMPLOYEE = "Employee",
  ROLE = "Role",
  PERMISSION = "Permission",
  PRODUCT = "Product",
  CATEGORY = "Category",
  SERVICE = "Service",
  BOOKING = "Booking",
  NEWS = "NewsEvent",
  PRICING = "Pricing",
}


