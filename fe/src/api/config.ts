// API Configuration
// Base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// API timeout - increased for Render server
export const API_TIMEOUT = 30000; // 30 seconds for production

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  PROFILE: '/users/profile',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Favorites
  FAVORITES: '/yeu-thich',
  
  // Services
  SERVICES: '/dich-vu',
  
  // News & Events
  NEWS_EVENTS: '/tin-tuc-su-kien',
  

  
  // Files
  FILES: '/files',
  
  // Statistics
  STATISTICS: '/thong-ke',
  
  // Business
  BUSINESS: '/business'
} as const; 