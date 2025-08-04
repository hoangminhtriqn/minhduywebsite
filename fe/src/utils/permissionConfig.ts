import {
  AllPermissions,
  PermissionGroups,
  DashboardPermissions,
  UserPermissions,
  ProductPermissions,
  CategoryPermissions,
  ServicePermissions,
  BookingPermissions,
  NewsPermissions,
  PricingPermissions,
  SettingsPermissions,
  PermissionManagementPermissions
} from '@/types/enum';
import { PermissionConfig } from '@/types';

// Permission labels mapping - centralized configuration
export const PERMISSION_LABELS: PermissionConfig = {
  // Dashboard
  [DashboardPermissions.VIEW]: { 
    label: "Xem Bảng Điều Khiển", 
    group: PermissionGroups.DASHBOARD,
    description: "Quyền xem trang bảng điều khiển chính"
  },
  [DashboardPermissions.STATS_VIEW]: { 
    label: "Xem Thống Kê", 
    group: PermissionGroups.DASHBOARD,
    description: "Quyền xem các thống kê và báo cáo"
  },

  // Users
  [UserPermissions.VIEW]: {
    label: "Xem Danh Sách Người Dùng",
    group: PermissionGroups.USERS,
    description: "Quyền xem danh sách tất cả người dùng"
  },
  [UserPermissions.SEARCH]: { 
    label: "Tìm Kiếm Người Dùng", 
    group: PermissionGroups.USERS,
    description: "Quyền tìm kiếm và lọc người dùng"
  },
  [UserPermissions.EDIT]: { 
    label: "Chỉnh Sửa Người Dùng", 
    group: PermissionGroups.USERS,
    description: "Quyền chỉnh sửa thông tin người dùng"
  },
  [UserPermissions.STATUS_UPDATE]: {
    label: "Cập Nhật Trạng Thái Người Dùng",
    group: PermissionGroups.USERS,
    description: "Quyền thay đổi trạng thái hoạt động của người dùng"
  },
  [UserPermissions.ROLE_VIEW]: {
    label: "Xem Vai Trò Người Dùng",
    group: PermissionGroups.USERS,
    description: "Quyền xem vai trò và quyền hạn của người dùng"
  },
  [UserPermissions.ROLE_UPDATE]: {
    label: "Cập Nhật Vai Trò Người Dùng",
    group: PermissionGroups.USERS,
    description: "Quyền thay đổi vai trò của người dùng"
  },

  // Products
  [ProductPermissions.VIEW]: {
    label: "Xem Danh Sách Sản Phẩm",
    group: PermissionGroups.PRODUCTS,
    description: "Quyền xem danh sách tất cả sản phẩm"
  },
  [ProductPermissions.CREATE]: { 
    label: "Thêm Sản Phẩm", 
    group: PermissionGroups.PRODUCTS,
    description: "Quyền tạo sản phẩm mới"
  },
  [ProductPermissions.EDIT]: { 
    label: "Chỉnh Sửa Sản Phẩm", 
    group: PermissionGroups.PRODUCTS,
    description: "Quyền chỉnh sửa thông tin sản phẩm"
  },
  [ProductPermissions.DELETE]: { 
    label: "Xóa Sản Phẩm", 
    group: PermissionGroups.PRODUCTS,
    description: "Quyền xóa sản phẩm khỏi hệ thống"
  },
  [ProductPermissions.SEARCH]: { 
    label: "Tìm Kiếm Sản Phẩm", 
    group: PermissionGroups.PRODUCTS,
    description: "Quyền tìm kiếm và lọc sản phẩm"
  },
  [ProductPermissions.FAVORITES_VIEW]: {
    label: "Xem Sản Phẩm Yêu Thích",
    group: PermissionGroups.PRODUCTS,
    description: "Quyền xem danh sách sản phẩm được yêu thích"
  },

  // Categories
  [CategoryPermissions.VIEW]: { 
    label: "Xem Danh Mục", 
    group: PermissionGroups.CATEGORIES,
    description: "Quyền xem danh sách danh mục"
  },
  [CategoryPermissions.CREATE]: { 
    label: "Thêm Danh Mục", 
    group: PermissionGroups.CATEGORIES,
    description: "Quyền tạo danh mục mới"
  },
  [CategoryPermissions.EDIT]: { 
    label: "Chỉnh Sửa Danh Mục", 
    group: PermissionGroups.CATEGORIES,
    description: "Quyền chỉnh sửa thông tin danh mục"
  },
  [CategoryPermissions.DELETE]: { 
    label: "Xóa Danh Mục", 
    group: PermissionGroups.CATEGORIES,
    description: "Quyền xóa danh mục khỏi hệ thống"
  },
  [CategoryPermissions.REORDER]: {
    label: "Sắp Xếp Danh Mục",
    group: PermissionGroups.CATEGORIES,
    description: "Quyền thay đổi thứ tự hiển thị danh mục"
  },
  [CategoryPermissions.VISIBILITY_TOGGLE]: {
    label: "Ẩn/Hiện Danh Mục",
    group: PermissionGroups.CATEGORIES,
    description: "Quyền ẩn hoặc hiện danh mục"
  },
  [CategoryPermissions.HIERARCHY_MANAGE]: {
    label: "Quản Lý Cấu Trúc Danh Mục",
    group: PermissionGroups.CATEGORIES,
    description: "Quyền quản lý cấu trúc phân cấp danh mục"
  },

  // Services
  [ServicePermissions.VIEW]: { 
    label: "Xem Dịch Vụ", 
    group: PermissionGroups.SERVICES,
    description: "Quyền xem danh sách dịch vụ"
  },
  [ServicePermissions.CREATE]: { 
    label: "Thêm Dịch Vụ", 
    group: PermissionGroups.SERVICES,
    description: "Quyền tạo dịch vụ mới"
  },
  [ServicePermissions.EDIT]: { 
    label: "Chỉnh Sửa Dịch Vụ", 
    group: PermissionGroups.SERVICES,
    description: "Quyền chỉnh sửa thông tin dịch vụ"
  },
  [ServicePermissions.DELETE]: { 
    label: "Xóa Dịch Vụ", 
    group: PermissionGroups.SERVICES,
    description: "Quyền xóa dịch vụ khỏi hệ thống"
  },
  [ServicePermissions.MEDIA_UPLOAD]: {
    label: "Tải Lên Phương Tiện Dịch Vụ",
    group: PermissionGroups.SERVICES,
    description: "Quyền tải lên hình ảnh, video cho dịch vụ"
  },

  // Bookings
  [BookingPermissions.VIEW]: { 
    label: "Xem Đặt Chỗ", 
    group: PermissionGroups.BOOKINGS,
    description: "Quyền xem danh sách đặt chỗ"
  },
  [BookingPermissions.DETAILS_VIEW]: {
    label: "Xem Chi Tiết Đặt Chỗ",
    group: PermissionGroups.BOOKINGS,
    description: "Quyền xem thông tin chi tiết của đặt chỗ"
  },
  [BookingPermissions.SEARCH]: { 
    label: "Tìm Kiếm Đặt Chỗ", 
    group: PermissionGroups.BOOKINGS,
    description: "Quyền tìm kiếm và lọc đặt chỗ"
  },
  [BookingPermissions.STATUS_UPDATE]: {
    label: "Cập Nhật Trạng Thái Đặt Chỗ",
    group: PermissionGroups.BOOKINGS,
    description: "Quyền thay đổi trạng thái đặt chỗ"
  },
  [BookingPermissions.DELETE]: { 
    label: "Xóa Đặt Chỗ", 
    group: PermissionGroups.BOOKINGS,
    description: "Quyền xóa đặt chỗ khỏi hệ thống"
  },
  [BookingPermissions.SERVICE_TYPES_MANAGE]: {
    label: "Quản Lý Loại Dịch Vụ Đặt Chỗ",
    group: PermissionGroups.BOOKINGS,
    description: "Quyền quản lý các loại dịch vụ có thể đặt"
  },

  // News
  [NewsPermissions.VIEW]: { 
    label: "Xem Tin Tức", 
    group: PermissionGroups.NEWS,
    description: "Quyền xem danh sách tin tức"
  },
  [NewsPermissions.CREATE]: { 
    label: "Thêm Tin Tức", 
    group: PermissionGroups.NEWS,
    description: "Quyền tạo bài viết tin tức mới"
  },
  [NewsPermissions.EDIT]: { 
    label: "Chỉnh Sửa Tin Tức", 
    group: PermissionGroups.NEWS,
    description: "Quyền chỉnh sửa bài viết tin tức"
  },
  [NewsPermissions.DELETE]: { 
    label: "Xóa Tin Tức", 
    group: PermissionGroups.NEWS,
    description: "Quyền xóa bài viết tin tức"
  },
  [NewsPermissions.PREVIEW]: { 
    label: "Xem Trước Tin Tức", 
    group: PermissionGroups.NEWS,
    description: "Quyền xem trước bài viết trước khi xuất bản"
  },
  [NewsPermissions.SEARCH]: { 
    label: "Tìm Kiếm Tin Tức", 
    group: PermissionGroups.NEWS,
    description: "Quyền tìm kiếm và lọc tin tức"
  },
  [NewsPermissions.MEDIA_UPLOAD]: {
    label: "Tải Lên Phương Tiện Tin Tức",
    group: PermissionGroups.NEWS,
    description: "Quyền tải lên hình ảnh, video cho tin tức"
  },

  // Pricing
  [PricingPermissions.VIEW]: { 
    label: "Xem Bảng Giá", 
    group: PermissionGroups.PRICING,
    description: "Quyền xem danh sách bảng giá"
  },
  [PricingPermissions.CREATE]: { 
    label: "Thêm Bảng Giá", 
    group: PermissionGroups.PRICING,
    description: "Quyền tạo bảng giá mới"
  },
  [PricingPermissions.EDIT]: { 
    label: "Chỉnh Sửa Bảng Giá", 
    group: PermissionGroups.PRICING,
    description: "Quyền chỉnh sửa thông tin bảng giá"
  },
  [PricingPermissions.DELETE]: { 
    label: "Xóa Bảng Giá", 
    group: PermissionGroups.PRICING,
    description: "Quyền xóa bảng giá khỏi hệ thống"
  },
  [PricingPermissions.DETAILS_VIEW]: {
    label: "Xem Chi Tiết Bảng Giá",
    group: PermissionGroups.PRICING,
    description: "Quyền xem thông tin chi tiết bảng giá"
  },
  [PricingPermissions.FEATURES_MANAGE]: {
    label: "Quản Lý Tính Năng Bảng Giá",
    group: PermissionGroups.PRICING,
    description: "Quyền quản lý các tính năng trong bảng giá"
  },
  [PricingPermissions.DOCUMENTS_MANAGE]: {
    label: "Quản Lý Tài Liệu Bảng Giá",
    group: PermissionGroups.PRICING,
    description: "Quyền quản lý tài liệu đính kèm bảng giá"
  },
  [PricingPermissions.SEARCH]: { 
    label: "Tìm Kiếm Bảng Giá", 
    group: PermissionGroups.PRICING,
    description: "Quyền tìm kiếm và lọc bảng giá"
  },

  // Settings
  [SettingsPermissions.VIEW]: { 
    label: "Xem Cài Đặt", 
    group: PermissionGroups.SETTINGS,
    description: "Quyền xem các cài đặt hệ thống"
  },
  [SettingsPermissions.UPDATE]: { 
    label: "Cập Nhật Cài Đặt", 
    group: PermissionGroups.SETTINGS,
    description: "Quyền thay đổi cài đặt hệ thống"
  },
  [SettingsPermissions.LOCATIONS_MANAGE]: {
    label: "Quản Lý Địa Điểm",
    group: PermissionGroups.SETTINGS,
    description: "Quyền quản lý danh sách địa điểm"
  },
  [SettingsPermissions.SLIDES_MANAGE]: {
    label: "Quản Lý Trình Chiếu",
    group: PermissionGroups.SETTINGS,
    description: "Quyền quản lý slide trình chiếu"
  },
  [SettingsPermissions.CONTACT_UPDATE]: {
    label: "Cập Nhật Thông Tin Liên Hệ",
    group: PermissionGroups.SETTINGS,
    description: "Quyền cập nhật thông tin liên hệ"
  },
  [SettingsPermissions.SEO_UPDATE]: {
    label: "Cập Nhật Tối Ưu Hóa Tìm Kiếm",
    group: PermissionGroups.SETTINGS,
    description: "Quyền cập nhật cài đặt SEO"
  },

  // Permissions
  [PermissionManagementPermissions.VIEW]: { 
    label: "Xem Quyền Hạn", 
    group: PermissionGroups.PERMISSIONS,
    description: "Quyền xem danh sách quyền hạn"
  },
  [PermissionManagementPermissions.CREATE]: { 
    label: "Tạo Quyền Hạn", 
    group: PermissionGroups.PERMISSIONS,
    description: "Quyền tạo quyền hạn mới"
  },
  [PermissionManagementPermissions.EDIT]: {
    label: "Chỉnh Sửa Quyền Hạn",
    group: PermissionGroups.PERMISSIONS,
    description: "Quyền chỉnh sửa quyền hạn"
  },
  [PermissionManagementPermissions.DELETE]: { 
    label: "Xóa Quyền Hạn", 
    group: PermissionGroups.PERMISSIONS,
    description: "Quyền xóa quyền hạn"
  },
  [PermissionManagementPermissions.ASSIGN]: { 
    label: "Gán Quyền Hạn", 
    group: PermissionGroups.PERMISSIONS,
    description: "Quyền gán quyền hạn cho người dùng"
  },
  [PermissionManagementPermissions.REVOKE]: {
    label: "Thu Hồi Quyền Hạn",
    group: PermissionGroups.PERMISSIONS,
    description: "Quyền thu hồi quyền hạn từ người dùng"
  },
};

// Helper function to get permission label
export const getPermissionLabel = (permission: string): string => {
  return PERMISSION_LABELS[permission]?.label || permission;
};

// Helper function to get permission group
export const getPermissionGroup = (permission: string): string => {
  return PERMISSION_LABELS[permission]?.group || "Khác";
};

// Helper function to get permission description
export const getPermissionDescription = (permission: string): string => {
  return PERMISSION_LABELS[permission]?.description || "";
};

// Helper function to group permissions by their groups
export const groupPermissionsByGroup = (permissions: string[]): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {};
  
  permissions.forEach(permission => {
    const group = getPermissionGroup(permission);
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(permission);
  });
  
  return grouped;
};

// Get all available permissions as array
export const getAllPermissions = (): string[] => {
  return Object.values(AllPermissions);
};

// Get permissions by group
export const getPermissionsByGroup = (group: PermissionGroups): string[] => {
  return Object.keys(PERMISSION_LABELS).filter(
    permission => PERMISSION_LABELS[permission].group === group
  );
};