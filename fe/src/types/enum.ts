// News Status Enum
export enum NewsStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  LOCKED = "locked"
}

// Product Status Enum
export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock"
}

// Booking Status Enum
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// User Role Enum
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

// Login Provider Enum
export enum LoginProvider {
  LOCAL = 'local',
  GOOGLE = 'google'
}

// Permission Enums - Organized by modules
export enum DashboardPermissions {
  VIEW = "dashboard.view",
  STATS_VIEW = "dashboard.stats.view"
}

export enum UserPermissions {
  VIEW = "users.view",
  SEARCH = "users.search",
  EDIT = "users.edit",
  STATUS_UPDATE = "users.status.update",
  ROLE_VIEW = "users.role.view",
  ROLE_UPDATE = "users.role.update"
}

export enum ProductPermissions {
  VIEW = "products.view",
  CREATE = "products.create",
  EDIT = "products.edit",
  DELETE = "products.delete",
  SEARCH = "products.search",
  FAVORITES_VIEW = "products.favorites.view"
}

export enum CategoryPermissions {
  VIEW = "categories.view",
  CREATE = "categories.create",
  EDIT = "categories.edit",
  DELETE = "categories.delete",
  REORDER = "categories.reorder",
  VISIBILITY_TOGGLE = "categories.visibility.toggle",
  HIERARCHY_MANAGE = "categories.hierarchy.manage"
}

export enum ServicePermissions {
  VIEW = "services.view",
  CREATE = "services.create",
  EDIT = "services.edit",
  DELETE = "services.delete",
  MEDIA_UPLOAD = "services.media.upload"
}

export enum BookingPermissions {
  VIEW = "bookings.view",
  DETAILS_VIEW = "bookings.details.view",
  SEARCH = "bookings.search",
  STATUS_UPDATE = "bookings.status.update",
  DELETE = "bookings.delete",
  SERVICE_TYPES_MANAGE = "bookings.service_types.manage"
}

export enum NewsPermissions {
  VIEW = "news.view",
  CREATE = "news.create",
  EDIT = "news.edit",
  DELETE = "news.delete",
  PREVIEW = "news.preview",
  SEARCH = "news.search",
  MEDIA_UPLOAD = "news.media.upload"
}

export enum PricingPermissions {
  VIEW = "pricing.view",
  CREATE = "pricing.create",
  EDIT = "pricing.edit",
  DELETE = "pricing.delete",
  DETAILS_VIEW = "pricing.details.view",
  FEATURES_MANAGE = "pricing.features.manage",
  DOCUMENTS_MANAGE = "pricing.documents.manage",
  SEARCH = "pricing.search"
}

export enum SettingsPermissions {
  VIEW = "settings.view",
  UPDATE = "settings.update",
  LOCATIONS_MANAGE = "settings.locations.manage",
  SLIDES_MANAGE = "settings.slides.manage",
  CONTACT_UPDATE = "settings.contact.update",
  SEO_UPDATE = "settings.seo.update"
}

export enum PermissionManagementPermissions {
  VIEW = "permissions.view",
  CREATE = "permissions.create",
  EDIT = "permissions.edit",
  DELETE = "permissions.delete",
  ASSIGN = "permissions.assign",
  REVOKE = "permissions.revoke"
}

// All permissions combined for easy access
export const AllPermissions = {
  ...DashboardPermissions,
  ...UserPermissions,
  ...ProductPermissions,
  ...CategoryPermissions,
  ...ServicePermissions,
  ...BookingPermissions,
  ...NewsPermissions,
  ...PricingPermissions,
  ...SettingsPermissions,
  ...PermissionManagementPermissions
} as const;

// Permission module categories (keys for organization)
export enum PermissionModules {
  DASHBOARD = "dashboard",
  USERS = "users", 
  PRODUCTS = "products",
  CATEGORIES = "categories",
  SERVICES = "services",
  BOOKINGS = "bookings",
  NEWS = "news",
  PRICING = "pricing",
  SETTINGS = "settings",
  PERMISSIONS = "permissions"
}

// Permission groups for organization
export enum PermissionGroups {
  DASHBOARD = "Thống kê",
  USERS = "Người Dùng",
  PRODUCTS = "Sản Phẩm",
  CATEGORIES = "Danh Mục",
  SERVICES = "Dịch Vụ",
  BOOKINGS = "Đặt Chỗ",
  NEWS = "Tin Tức",
  PRICING = "Bảng Giá",
  SETTINGS = "Cài Đặt",
  PERMISSIONS = "Phân quyền"
} 