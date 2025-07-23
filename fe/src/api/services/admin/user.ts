import { api } from '@/api';

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
  api.get<UserListResponse>('/nguoi-dung', { params });

export const updateUser = (id: string, data: Partial<User>) =>
  api.put(`/nguoi-dung/${id}`, data);

export const updateUserStatus = (id: string, status: string) =>
  api.put(`/nguoi-dung/${id}`, { Status: status }); 