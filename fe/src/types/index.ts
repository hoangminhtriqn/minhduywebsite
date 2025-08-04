import { 
  ProductStatus, 
  BookingStatus, 
  UserRole
} from './enum';

// Re-export enums for easy access
export { 
  ProductStatus, 
  BookingStatus, 
  UserRole,
  DashboardPermissions,
  UserPermissions,
  ProductPermissions,
  CategoryPermissions,
  ServicePermissions,
  BookingPermissions,
  NewsPermissions,
  PricingPermissions,
  SettingsPermissions,
  PermissionManagementPermissions,
  AllPermissions,
  PermissionModules,
  PermissionGroups
} from './enum';

// User Types
export interface User {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
  FullName?: string;
  Address?: string;
  Role: UserRole;
  Status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Employee Types (extends User for admin management)
export interface Employee extends User {
  permissions?: string[];
}

// Permission Types
export interface Permission {
  key: string;
  label: string;
  group: string;
  description?: string;
}

export interface PermissionGroup {
  key: string;
  label: string;
  permissions: Permission[];
}

// Permission mapping for labels and groups
export interface PermissionConfig {
  [key: string]: {
    label: string;
    group: string;
    description?: string;
  };
}

// Product Types
export interface Product {
  _id: string;
  Product_Name: string;
  CategoryID: string;
  Description?: string;
  Price: number;
  Main_Image: string;
  List_Image: string[];
  Specifications: Record<string, string>;
  Status: ProductStatus;
  Stock: number;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  Category_Name: string;
  Description?: string;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface Cart {
  _id: string;
  UserID: string;
  Status: 'active' | 'completed' | 'cancelled';
  Total_Amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  CartID: string;
  ProductID: string;
  Quantity: number;
  Price: number;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  _id: string;
  FullName: string;
  Email: string;
  Phone: string;
  Address: string;
  CarModel: string;
  TestDriveDate: string;
  TestDriveTime: string;
  Notes?: string;
  Status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: {
    code: string;
    details: string;
  };
}

// Auth Types
export interface LoginCredentials {
  UserName: string;
  Password: string;
}

export interface RegisterData extends Omit<User, '_id' | 'createdAt' | 'updatedAt'> {
  Password: string;
}

// Re-export theme types for easy access
export type { 
  Theme, 
  ThemeContextType, 
  ThemeName, 
  ColorPalette, 
  TextColors, 
  BackgroundColors, 
  SurfaceColors 
} from './theme';
