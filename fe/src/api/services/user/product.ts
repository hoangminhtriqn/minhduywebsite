import { api } from '@/api';
import { Product, Category, CreateProductData, UpdateProductData } from '@/api/types';
import { API_ENDPOINTS } from '@/api/config';

// Định nghĩa kiểu PaginationInfo nếu chưa có
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  [key: string]: unknown;
}

export const productService = {
  // Get all products
  getAllProducts: async (params?: { page?: number; limit?: number; [key: string]: string | number | undefined }): Promise<{ products: Product[]; pagination: PaginationInfo }> => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
    // Trả về đúng object { products, pagination }
    return {
      products: response.data.products || [],
      pagination: response.data.pagination || {},
    };
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCT_DETAIL}/${id}`);
    return response.data.data || response.data.product; // Extract data from the response structure
  },

  // Create a new product
  createProduct: async (productData: CreateProductData): Promise<Product> => {
    const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data.product; // Assuming the response structure includes the created product
  },

  // Update an existing product
  updateProduct: async (id: string, productData: UpdateProductData): Promise<Product> => {
    const response = await api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, productData);
    return response.data.product; // Assuming the response structure includes the updated product
  },

  // Delete a product
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },

  getCategories: async () => {
    const response = await api.get<Category[]>(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  getProductsByCategory: async (categoryId: string) => {
    const response = await api.get<Product[]>(`${API_ENDPOINTS.CATEGORIES}/${categoryId}/products`);
    return response.data;
  },

  // Get related products by product ID
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/related?limit=${limit}`);
    return response.data.data || response.data.products; // Extract data from the response structure
  },
}; 