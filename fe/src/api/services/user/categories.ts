import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories: string[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

// Interface cho category từ API mới (chỉ parent categories)
export interface CategoryFilter {
  _id: string;
  Name: string;
  Description?: string;
  Icon: string;
  ParentID: null; // Chỉ parent categories nên ParentID luôn là null
  Status: string;
  Order: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

// Lấy danh sách categories cho filter dropdown
export const getCategoriesForFilter = async (): Promise<CategoryFilter[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES_FILTER);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching categories for filter:', error);
    return [];
  }
};

// Lấy danh sách categories với cấu trúc phân cấp
export const getCategoriesHierarchy = async (): Promise<Category[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES_HIERARCHY);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};



// Lấy thông tin category theo ID
export const getCategoryById = async (id: string) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

 