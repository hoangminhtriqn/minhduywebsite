import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface Employee {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
  FullName: string;
  Address: string;
  Status: string;
  createdAt: string;
  updatedAt: string;
  permissions?: string[];
}

export interface EmployeeListResponse {
  success: boolean;
  data: {
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateEmployeeData {
  UserName: string;
  Password: string;
  Email: string;
  Phone: string;
  FullName: string;
  Address?: string;
}

export interface UpdateEmployeeData {
  FullName?: string;
  Email?: string;
  Phone?: string;
  Address?: string;
  Status?: string;
}

export interface AvailablePermissionsResponse {
  success: boolean;
  data: {
    permissions: string[];
    groupedPermissions: Record<string, string[]>;
  };
}

export interface EmployeePermissionsResponse {
  success: boolean;
  data: {
    employeeId: string;
    permissions: string[];
  };
}

export const permissionService = {
  // Get all employees with pagination and search
  getAllEmployees: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<EmployeeListResponse> => {
    const response = await api.get(API_ENDPOINTS.PERMISSIONS_EMPLOYEES, { params });
    return response.data;
  },

  // Create new employee
  createEmployee: async (employeeData: CreateEmployeeData): Promise<{
    success: boolean;
    data: Employee;
    message: string;
  }> => {
    const response = await api.post(API_ENDPOINTS.PERMISSIONS_EMPLOYEES, employeeData);
    return response.data;
  },

  // Update employee information
  updateEmployee: async (id: string, employeeData: UpdateEmployeeData): Promise<{
    success: boolean;
    data: Employee;
    message: string;
  }> => {
    const response = await api.put(`${API_ENDPOINTS.PERMISSIONS_EMPLOYEES}/${id}`, employeeData);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api.delete(`${API_ENDPOINTS.PERMISSIONS_EMPLOYEES}/${id}`);
    return response.data;
  },

  // Get available permissions
  getAvailablePermissions: async (): Promise<AvailablePermissionsResponse> => {
    const response = await api.get(API_ENDPOINTS.PERMISSIONS_AVAILABLE);
    return response.data;
  },

  // Get employee permissions
  getEmployeePermissions: async (id: string): Promise<EmployeePermissionsResponse> => {
    const response = await api.get(`${API_ENDPOINTS.PERMISSIONS_EMPLOYEES}/${id}/permissions`);
    return response.data;
  },

  // Update employee permissions
  updateEmployeePermissions: async (id: string, permissions: string[]): Promise<{
    success: boolean;
    data: {
      employeeId: string;
      permissions: string[];
    };
    message: string;
  }> => {
    const response = await api.put(`${API_ENDPOINTS.PERMISSIONS_EMPLOYEES}/${id}/permissions`, {
      permissions
    });
    return response.data;
  },
};