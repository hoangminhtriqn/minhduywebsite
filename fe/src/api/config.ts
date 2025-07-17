// API Configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDevelopment ? "http://localhost:3000/api" : "/api");

// API timeout
export const API_TIMEOUT = 10000; // 10 seconds

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  PROFILE: '/users/profile',
  
  // Products
  PRODUCTS: '/xe',
  PRODUCT_DETAIL: '/xe',
  
  // Categories
  CATEGORIES: '/danh-muc',
  
  // Favorites
  FAVORITES: '/yeu-thich',
  
  // Services
  SERVICES: '/dich-vu',
  
  // News & Events
  NEWS_EVENTS: '/tin-tuc-su-kien',
  
  // Test Drive Orders
  TEST_DRIVE_ORDERS: '/test-drive-orders',
  
  // Files
  FILES: '/files',
  
  // Statistics
  STATISTICS: '/thong-ke',
  
  // Business
  BUSINESS: '/business'
} as const; 