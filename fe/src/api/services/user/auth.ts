import { LoginCredentials, RegisterData, User } from '@/api/types';
import { api } from "@/api";

// Retry function for network issues
const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      
      // Only retry on network errors or timeouts
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout') || !error.response) {
        console.log(`Retry attempt ${i + 1} for network error`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
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
        api.post('/users/login', credentials)
      );
      
      console.log('Login response:', response.data);
      
      // Handle both success and error responses
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      if (!response.data.success || !response.data.data || !response.data.data.token || !response.data.data.user) {
        throw new Error('Invalid response structure from server');
      }
      
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', response.data.data.user._id);
      return response.data.data.user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Server error';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        throw new Error('Network error - please check your connection');
      } else {
        // Other errors
        throw new Error(error.message || 'Login failed');
      }
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await retryRequest(() => 
        api.post('/users/register', data)
      );
      
      console.log('Register response:', response.data);
      
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      if (!response.data.success || !response.data.data || !response.data.data.token || !response.data.data.user) {
        throw new Error('Invalid response structure from server');
      }
      
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', response.data.data.user._id);
      return response.data.data.user;
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Server error';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Network error - please check your connection');
      } else {
        throw new Error(error.message || 'Registration failed');
      }
    }
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  },

  getCurrentUser: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  updateProfile: async (userId: string, data: Partial<User>) => {
    try {
      const response = await api.put(`/users/${userId}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
}; 