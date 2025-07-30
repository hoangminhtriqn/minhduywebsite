import { api } from '@/api/api';
import { API_ENDPOINTS } from '@/api/config';

export interface ServiceType {
  _id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceTypeResponse {
  success: boolean;
  message: string;
  data: ServiceType[];
}

// Lấy danh sách service types active cho user
export const getActiveServiceTypes = async (): Promise<ServiceTypeResponse> => {
  const response = await api.get(API_ENDPOINTS.USER_SERVICE_TYPES);
  return response.data;
}; 