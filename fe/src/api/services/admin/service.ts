import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';
import { Service } from '@/types';

export const servicesApi = {
  // Get all services for admin
  getAllServices: async (): Promise<Service[]> => {
    const response = await api.get(API_ENDPOINTS.SERVICES);
    return response.data.data;
  },

  // Get a single service by ID
  getServiceById: async (id: string): Promise<Service> => {
    const response = await api.get(`${API_ENDPOINTS.SERVICES}/${id}`);
    return response.data.data;
  },

  // Create a new service
  createService: async (serviceData: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>): Promise<Service> => {
    const response = await api.post(API_ENDPOINTS.SERVICES, serviceData);
    return response.data.data;
  },

  // Update an existing service
  updateService: async (id: string, serviceData: Partial<Service>): Promise<Service> => {
    const response = await api.put(`${API_ENDPOINTS.SERVICES}/${id}`, serviceData);
    return response.data.data;
  },

  // Delete a service
  deleteService: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.SERVICES}/${id}`);
  },
};
