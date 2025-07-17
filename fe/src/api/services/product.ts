import axios from 'axios';
import { Product, Category, CreateProductData, UpdateProductData } from '../types';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || '/api'; // Assuming backend API base path is /api

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/xe`);
    return response.data.products; // Assuming the response structure includes a 'products' array
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_URL}/xe/${id}`);
    return response.data.product; // Assuming the response structure includes a 'product' object
  },

  // Create a new product
  createProduct: async (productData: CreateProductData): Promise<Product> => {
    // Note: File uploads typically require FormData
    // This is a simplified example for JSON data
    const response = await axios.post(`${API_URL}/xe`, productData);
    return response.data.product; // Assuming the response structure includes the created product
  },

  // Update an existing product
  updateProduct: async (id: string, productData: UpdateProductData): Promise<Product> => {
     // Note: File uploads typically require FormData
    // This is a simplified example for JSON data
    const response = await axios.put(`${API_URL}/xe/${id}`, productData);
    return response.data.product; // Assuming the response structure includes the updated product
  },

  // Delete a product
  deleteProduct: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/xe/${id}`);
  },

  getCategories: async () => {
    const response = await axios.get<Category[]>(`${API_URL}/categories`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: string) => {
    const response = await axios.get<Product[]>(`${API_URL}/categories/${categoryId}/products`);
    return response.data;
  },
}; 