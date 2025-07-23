import { api } from '@/api';

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
    const response = await api.get('/categories/filter');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching categories for filter:', error);
    return [];
  }
};

// Lấy danh sách categories với cấu trúc phân cấp
export const getCategoriesHierarchy = async (): Promise<Category[]> => {
  try {
    // Sử dụng API mới để lấy categories
    const allCategories = await getCategoriesForFilter();
    
    // Tách parent categories (ParentID = null) và child categories
    const parentCategories = allCategories.filter((cat: CategoryFilter) => !cat.ParentID);
    const childCategories = allCategories.filter((cat: CategoryFilter) => cat.ParentID);
    
    // Tạo cấu trúc phân cấp
    const hierarchicalCategories = parentCategories.map((parent: CategoryFilter) => {
      const subCategories = childCategories
        .filter(
          (child: CategoryFilter) =>
            child.ParentID &&
            typeof child.ParentID === 'object' &&
            '_id' in child.ParentID &&
            (child.ParentID as { _id: string })._id === parent._id
        )
        .map((child: CategoryFilter) => child.Name);
      
      return {
        id: parent._id || parent.id,
        name: parent.Name,
        icon: parent.Icon || '📁',
        subCategories: subCategories
      };
    });
    
    return hierarchicalCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Lấy danh sách tất cả categories (cho admin)
export const getAllCategories = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const response = await api.get('/categories/all', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all categories:', error);
    throw error;
  }
};

// Lấy thông tin category theo ID
export const getCategoryById = async (id: string) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

// Tạo category mới
export const createCategory = async (data: {
  Name: string;
  Description?: string;
  ParentID?: string;
  Order?: number;
}) => {
  try {
    const response = await api.post('/categories', data);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Cập nhật category
export const updateCategory = async (
  id: string,
  data: {
    Name?: string;
    Description?: string;
    ParentID?: string;
    Order?: number;
  }
) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Xóa category
export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}; 