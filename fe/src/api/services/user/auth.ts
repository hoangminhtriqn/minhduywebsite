import { LoginCredentials, RegisterData, User } from '@/api/types';
import { api } from "@/api";
import { API_ENDPOINTS } from '@/api/config';

// Retry function for network issues
const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error: unknown) {
      if (i === maxRetries - 1) throw error;
      if (
        typeof error === 'object' && error !== null &&
        ('code' in error && (error as any).code === 'ECONNABORTED' ||
         'message' in error && typeof (error as any).message === 'string' && (error as any).message.includes('timeout')) ||
        !('response' in (error as any))
      ) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await retryRequest(() => 
        api.post(API_ENDPOINTS.LOGIN, credentials)
      );
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Login failed');
      }
      if (!response.data.success || !response.data.data || !response.data.data.token || !response.data.data.user || !response.data.data.refreshToken) {
        throw new Error('Invalid response structure from server');
      }
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('userId', response.data.data.user._id);
      return response.data.data.user;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        const errorMessage = err.response?.data?.message || 'Server error';
        throw new Error(errorMessage);
      } else if (typeof error === 'object' && error !== null && 'request' in error) {
        throw new Error('Network error - please check your connection');
      } else if (error instanceof Error) {
        throw new Error(error.message || 'Login failed');
      } else {
        throw new Error('Login failed');
      }
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await retryRequest(() => 
        api.post(API_ENDPOINTS.REGISTER, data)
      );
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Registration failed');
      }
      if (!response.data.success || !response.data.data || !response.data.data.token || !response.data.data.user || !response.data.data.refreshToken) {
        throw new Error('Invalid response structure from server');
      }
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('userId', response.data.data.user._id);
      return response.data.data.user;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        const errorMessage = err.response?.data?.message || 'Server error';
        throw new Error(errorMessage);
      } else if (typeof error === 'object' && error !== null && 'request' in error) {
        throw new Error('Network error - please check your connection');
      } else if (error instanceof Error) {
        throw new Error(error.message || 'Registration failed');
      } else {
        throw new Error('Registration failed');
      }
    }
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
    }
  },

  getCurrentUser: async (userId: string) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS}/${userId}`);
      return response.data.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  updateProfile: async (userId: string, data: Partial<User>) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.USERS}/${userId}`, data);
      return response.data.data;
    } catch (error: unknown) {
      throw error;
    }
  },
};

// Hàm gọi API refresh token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');
  const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
  if (response.data && response.data.success && response.data.data && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    return response.data.data.token;
  } else {
    throw new Error(response.data?.message || 'Refresh token failed');
  }
}; 