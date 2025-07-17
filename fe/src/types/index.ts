// User Types
export interface User {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
  FullName?: string;
  Address?: string;
  Role: 'user' | 'admin';
  Status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
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
  Status: 'available' | 'unavailable';
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

// Order Types
export interface OrderTestDrive {
  _id: string;
  UserID: string;
  CartID: string;
  Order_Date: string;
  Test_Drive_Date: string;
  Address: string;
  Status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  Notes?: string;
  Total_Amount: number;
  ImageUrl?: string;
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

// Form Types
export interface TestDriveFormData {
  Order_Date: string;
  Test_Drive_Date: string;
  Address: string;
  Notes?: string;
  ImageUrl?: File;
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