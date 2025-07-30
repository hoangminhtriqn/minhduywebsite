// API Configuration
// Base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// API timeout - increased for Render server
export const API_TIMEOUT = 30000; // 30 seconds for production

// API endpoints
export const API_ENDPOINTS = {
  // ========================================
  // USER ENDPOINTS (Frontend User Services)
  // ========================================
  
  // Authentication & User Management
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  LOGOUT: '/users/logout',
  REFRESH_TOKEN: '/users/refresh-token',
  USERS: '/users',
  
  // Products & Categories (User)
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products',
  CATEGORIES: '/categories',
  CATEGORIES_FILTER: '/categories/filter',
  CATEGORIES_HIERARCHY: '/categories/hierarchy',
  
  // User Features
  FAVORITES: '/yeu-thich',
  ORDERS: '/orders',
  PRICING: '/pricing',
  NEWS_EVENTS: '/news-events',
  NEWS_EVENTS_POPULAR: '/news-events/popular',
  BOOKINGS: '/bookings',
  USER_SERVICE_TYPES: '/user/service-types',
  
  // Public Settings
  SETTINGS_PUBLIC: '/settings/public',
  
  // ========================================
  // ADMIN ENDPOINTS (Admin Panel Services)
  // ========================================
  
  // Dashboard & Statistics
  DASHBOARD: '/dashboard',
  
  // Admin User Management
  ADMIN_USERS: '/nguoi-dung',
  
  // Admin Categories Management
  CATEGORIES_ADMIN: '/categories/admin/all',
  
  // Admin Booking Management
  ADMIN_BOOKINGS: '/bookings',
  
  // Admin Service Types Management
  ADMIN_SERVICE_TYPES: '/service-types',
  ADMIN_SERVICE_TYPES_ACTIVE: '/service-types/active',
  
  // Admin Settings Management
  SETTINGS: '/settings',
  SETTINGS_LOCATIONS: '/settings/locations',
  
  // File Upload & Management
  FILES: '/files',
  FILES_UPLOAD: '/files/upload',
  FILES_UPLOAD_MULTIPLE: '/files/upload-multiple',
  FILES_SEARCH: '/files/search',
} as const; 