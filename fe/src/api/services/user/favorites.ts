import { api } from "@/api";
import { API_ENDPOINTS } from '@/api/config';

// Define the API response structure
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
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

export const favoritesService = {
  getFavorites: async (): Promise<ApiResponse<FavoritesData>> => {
    const response = await api.get<ApiResponse<FavoritesData>>(`${API_ENDPOINTS.FAVORITES}/`);
    return response.data;
  },

  addToFavorites: async (productId: string): Promise<ApiResponse<FavoritesData>> => {
    const response = await api.post<ApiResponse<FavoritesData>>(`${API_ENDPOINTS.FAVORITES}/items`, {
      productId,
    });
    return response.data;
  },

  removeFromFavorites: async (itemId: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.FAVORITES}/items/${itemId}`);
  },

  clearFavorites: async (): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.FAVORITES}/`);
  },

  checkFavoriteStatus: async (productId: string): Promise<{ isFavorite: boolean }> => {
    const response = await api.get<ApiResponse<{ isFavorite: boolean }>>(`${API_ENDPOINTS.FAVORITES}/check/${productId}`);
    return response.data.data;
  },

  // Get favorites count only
  getFavoritesCount: async (): Promise<number> => {
    try {
      const response = await api.get<ApiResponse<FavoritesData>>(`${API_ENDPOINTS.FAVORITES}/`);
      return response.data.success ? response.data.data.items.length : 0;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  },
}; 