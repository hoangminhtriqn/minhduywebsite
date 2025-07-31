import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export const serviceApi = {
  getAllServices: async () => {
    const response = await api.get(API_ENDPOINTS.SERVICES);
    return response.data;
  },
};
