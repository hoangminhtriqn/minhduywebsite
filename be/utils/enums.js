// News Status Enum
const NEWS_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  LOCKED: "locked",
};

// Product Status Enum
const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_OF_STOCK: "out_of_stock",
};

// Booking Status Enum
const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Audit modules and events
const AUDIT_MODULES = {
  USERS: "users",
  PERMISSIONS: "permissions",
  BOOKINGS: "bookings",
};

const AUDIT_EVENTS = {
  // Users
  USER_CREATED: "user.created",
  USER_UPDATED: "user.updated",
  USER_DELETED: "user.deleted",
  USER_STATUS_CHANGED: "user.status.changed",
  USER_PASSWORD_RESET: "user.password.reset",

  // Permissions (future)
  PERMISSIONS_ASSIGNED: "permissions.assigned",
  PERMISSIONS_REVOKED: "permissions.revoked",
  EMPLOYEE_CREATED: "employee.created",
  EMPLOYEE_UPDATED: "employee.updated",
  EMPLOYEE_DELETED: "employee.deleted",

  // Bookings
  BOOKING_STATUS_CHANGED: "booking.status.changed",
  BOOKING_DELETED: "booking.deleted",
  BOOKING_RESTORED: "booking.restored",
  BOOKING_PURGED: "booking.purged",
};

// Message templates
// Use placeholders like {actor}, {target}, {extra}
const AUDIT_TEMPLATES = {
  [AUDIT_EVENTS.USER_CREATED]: "{actor} đã tạo người dùng {target}",
  [AUDIT_EVENTS.USER_UPDATED]:
    "{actor} đã cập nhật người dùng {target}: {changes}",
  [AUDIT_EVENTS.USER_DELETED]: "{actor} đã xóa người dùng {target}",
  [AUDIT_EVENTS.USER_STATUS_CHANGED]:
    "{actor} đã đổi trạng thái người dùng {target} thành {status}",
  [AUDIT_EVENTS.USER_PASSWORD_RESET]:
    "{actor} đã cấp lại mật khẩu cho {target}",

  [AUDIT_EVENTS.PERMISSIONS_ASSIGNED]:
    "{actor} đã cập nhật quyền cho {target}. Thêm: {added}. Bỏ: {removed}",
  [AUDIT_EVENTS.PERMISSIONS_REVOKED]: "{actor} đã thu hồi quyền của {target}",
  [AUDIT_EVENTS.EMPLOYEE_CREATED]: "{actor} đã thêm nhân viên {target}",
  [AUDIT_EVENTS.EMPLOYEE_UPDATED]: "{actor} đã cập nhật nhân viên {target}",
  [AUDIT_EVENTS.EMPLOYEE_DELETED]: "{actor} đã xóa nhân viên {target}",

  [AUDIT_EVENTS.BOOKING_STATUS_CHANGED]:
    "{actor} đã đổi trạng thái booking {target} thành {status}",
  [AUDIT_EVENTS.BOOKING_DELETED]: "{actor} đã xóa booking {target}",
  [AUDIT_EVENTS.BOOKING_RESTORED]: "{actor} đã khôi phục booking {target}",
  [AUDIT_EVENTS.BOOKING_PURGED]: "{actor} đã xóa vĩnh viễn booking {target}",
};

// Audit entity types (for entityType field)
const AUDIT_ENTITY_TYPES = {
  USER: "User",
  EMPLOYEE: "Employee",
  ROLE: "Role",
  PERMISSION: "Permission",
  PRODUCT: "Product",
  CATEGORY: "Category",
  SERVICE: "Service",
  BOOKING: "Booking",
  NEWS: "NewsEvent",
  PRICING: "Pricing",
};

module.exports = {
  NEWS_STATUS,
  PRODUCT_STATUS,
  BOOKING_STATUS,
  AUDIT_MODULES,
  AUDIT_EVENTS,
  AUDIT_TEMPLATES,
  AUDIT_ENTITY_TYPES,
};
