import axios from 'axios';
import { Product, Category, CreateProductData, UpdateProductData } from '@/api/types';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || '/api'; // Assuming backend API base path is /api

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
    const response = await axios.get(`${API_URL}/products`, { params });
    // Trả về đúng object { products, pagination }
    return {
      products: response.data.products || [],
      pagination: response.data.pagination || {},
    };
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data.data || response.data.product; // Extract data from the response structure
  },

  // Create a new product
  createProduct: async (productData: CreateProductData): Promise<Product> => {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data.product; // Assuming the response structure includes the created product
  },

  // Update an existing product
  updateProduct: async (id: string, productData: UpdateProductData): Promise<Product> => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return response.data.product; // Assuming the response structure includes the updated product
  },

  // Delete a product
  deleteProduct: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/products/${id}`);
  },

  getCategories: async () => {
    const response = await axios.get<Category[]>(`${API_URL}/categories`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: string) => {
    const response = await axios.get<Product[]>(`${API_URL}/categories/${categoryId}/products`);
    return response.data;
  },

  // Get related products by product ID
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products/${productId}/related?limit=${limit}`);
    return response.data.data || response.data.products; // Extract data from the response structure
  },
}; 