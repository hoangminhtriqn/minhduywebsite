import axios from '@/api/axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/api/config';

export interface Category {
  _id: string;
  Name: string;
  Description?: string;
  ParentID?: {
    _id: string;
    Name: string;
  } | null;
  Icon?: string;
  Status?: string;
  Order?: number;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  // Lấy tất cả categories (cho admin)
  async getAllCategories() {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_ADMIN}`);
    return response.data;
  },

  // Tạo category mới
  async createCategory(data: {
    Name: string;
    Description?: string;
    ParentID?: string;
    Order?: number;
    Status?: string;
    Icon?: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`, data);
    return response.data;
  },

  // Cập nhật category
  async updateCategory(id: string, data: {
    Name?: string;
    Description?: string;
    ParentID?: string;
    Order?: number;
    Status?: string;
    Icon?: string;
  }) {
    const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}/${id}`, data);
    return response.data;
  },

  // Xóa category
  async deleteCategory(id: string) {
    const response = await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}/${id}`);
    return response.data;
  },

  // Lấy category theo ID
  async getCategoryById(id: string) {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}/${id}`);
    return response.data;
  },
}; 