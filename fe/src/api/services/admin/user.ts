import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface User {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
  FullName: string;
  Address: string;
  Role: string;
  Status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const getUsers = (params: { page: number; limit: number; search?: string; role?: string }) =>
  api.get<UserListResponse>(API_ENDPOINTS.ADMIN_USERS, { params });

export const updateUser = (id: string, data: Partial<User>) =>
  api.put(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, data);

export const updateUserStatus = (id: string, status: string) =>
  api.put(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, { Status: status }); 