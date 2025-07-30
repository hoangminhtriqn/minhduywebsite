import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface ServiceType {
  _id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceTypeListResponse {
  success: boolean;
  message: string;
  data: {
    serviceTypes: ServiceType[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface ServiceTypeResponse {
  success: boolean;
  message: string;
  data: ServiceType;
}

export const getServiceTypes = (params: { page: number; limit: number; search?: string; status?: string }) =>
  api.get<ServiceTypeListResponse>(API_ENDPOINTS.ADMIN_SERVICE_TYPES, { params });

export const getActiveServiceTypes = () =>
  api.get<ServiceTypeResponse>(API_ENDPOINTS.ADMIN_SERVICE_TYPES_ACTIVE);

export const getServiceTypeById = (id: string) =>
  api.get<ServiceTypeResponse>(`${API_ENDPOINTS.ADMIN_SERVICE_TYPES}/${id}`);

export const createServiceType = (data: { name: string; description?: string; status?: string }) =>
  api.post<ServiceTypeResponse>(API_ENDPOINTS.ADMIN_SERVICE_TYPES, data);

export const updateServiceType = (id: string, data: { name?: string; description?: string; status?: string }) =>
  api.put<ServiceTypeResponse>(`${API_ENDPOINTS.ADMIN_SERVICE_TYPES}/${id}`, data);

export const deleteServiceType = (id: string) =>
  api.delete(`${API_ENDPOINTS.ADMIN_SERVICE_TYPES}/${id}`); 