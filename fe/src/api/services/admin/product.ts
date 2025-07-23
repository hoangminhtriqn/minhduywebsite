import axios from '@/api/axios';
import { API_BASE_URL } from '@/api/config';

export const productService = {
  async getAllProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const response = await axios.get(`${API_BASE_URL}/products`, { params });
    return response.data;
  },
  async getCategories() {
    const response = await axios.get(`${API_BASE_URL}/categories/filter`);
    return response.data;
  },
  async deleteProduct(productId: string) {
    const response = await axios.delete(`${API_BASE_URL}/products/${productId}`);
    return response.data;
  },
}; 