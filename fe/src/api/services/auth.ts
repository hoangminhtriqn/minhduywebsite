import { LoginCredentials, RegisterData, User } from '../types';
import { api } from "../index";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/users/login', credentials);
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('userId', response.data.data.user._id);
    return response.data.data.user;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/users/register', data);
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('userId', response.data.data.user._id);
    return response.data.data.user;
  },

  logout: async () => {
    await api.post('/users/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },

  getCurrentUser: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  },

  updateProfile: async (userId: string, data: Partial<User>) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data.data;
  },
}; 