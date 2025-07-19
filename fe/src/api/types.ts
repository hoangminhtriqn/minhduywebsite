export interface User {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
  FullName: string;
  Address: string;
  Role: 'user' | 'admin';
  Status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  UserName: string;
  Password: string;
}

export interface RegisterData {
  UserName: string;
  Email: string;
  Phone: string;
  FullName: string;
  Address: string;
  Password: string;
  Role: 'user';
  Status: 'active';
}

export interface Product {
  _id: string;
  Product_Name: string;
  CategoryID: string;
  Description?: string;
  Price: number;
  Main_Image: string;
  List_Image: string[];
  Specifications: Record<string, string>;
  TestDriveStartDate: string;
  TestDriveEndDate: string;
  Status: 'active' | 'expired';
  createdAt: string;
  updatedAt: string;
  Stock?: number;
}

export interface Category {
  _id: string;
  Category_Name: string;
  Description: string;
  Status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  Service_Name: string;
  Description: string;
  Price: number;
  Image: string;
  Status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  ProductID: {
    _id: string;
    Product_Name: string;
    Price: number;
    Main_Image: string;
  };
  quantity: number;
  priceAtOrder: number;
  Image: string;
}

export interface Order {
  _id: string;
  UserId: string;
  Items: CartItem[];
  TotalAmount: number;
  Status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  Order_Date: string;
  Test_Drive_Date: string;
  Address: string;
  Notes?: string;
  ImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  Product_Name: string;
  CategoryID: string;
  Main_Image: File | string;
  List_Image?: (File | string)[];
  Specifications: Record<string, string>;
  Status: 'available' | 'unavailable';
  Stock: number;
  Price: number;
  Description: string;
}

export interface UpdateProductData {
  Product_Name?: string;
  CategoryID?: string;
  Main_Image?: File | string;
  List_Image?: (File | string)[];
  Specifications?: Record<string, string>;
  Status?: 'available' | 'unavailable';
  Stock?: number;
  Price?: number;
  Description?: string;
}

export interface Cart {
  _id: string;
  UserID: string;
  items: CartItem[]; // Array of embedded CartItem objects
  Total_Amount: number;
  Status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteItem {
  _id: string;
  ProductID: {
    _id: string;
    Product_Name: string;
    Price: number;
    Main_Image: string;
  };
  Image: string;
  createdAt: string;
}

export interface FavoritesData {
  _id: string;
  UserID: string;
  items: FavoriteItem[];
  Status: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsEvent {
  _id: string;
  Title: string;
  Content: string;
  PublishDate: string;
  ImageUrl?: string;
  Status: 'draft' | 'published' | 'archived' | 'active' | 'inactive';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
} 