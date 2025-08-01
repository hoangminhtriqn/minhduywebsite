import { api } from '@/api/api';
import { Pricing } from '@/api/services/user/pricing';

export interface CreatePricingData {
  title: string;
  description: string;
  features: string[];
  documents: {
    name: string;
    type: 'pdf' | 'word' | 'excel';
    size: string;
    url: string;
  }[];
  color: string;
  status: 'active' | 'inactive';
}

export type UpdatePricingData = Partial<CreatePricingData>;

export const pricingService = {
  // Get all pricing items for admin
  getAllPricing: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    pricing: Pricing[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await api.get('/pricing', { params });
    const responseData = response.data;
    const pricingData = responseData.data;
    
    return {
      pricing: pricingData.docs || [],
      total: pricingData.totalDocs || 0,
      page: pricingData.page || 1,
      limit: pricingData.limit || 10,
      totalPages: pricingData.totalPages || 1,
    };
  },

  // Get a single pricing by ID
  getPricingById: async (id: string): Promise<Pricing> => {
    const response = await api.get(`/pricing/admin/${id}`);
    return response.data.data;
  },

  // Create a new pricing
  createPricing: async (pricingData: CreatePricingData): Promise<Pricing> => {
    const response = await api.post('/pricing/admin', pricingData);
    return response.data.data;
  },

  // Update an existing pricing
  updatePricing: async (id: string, pricingData: UpdatePricingData): Promise<Pricing> => {
    const response = await api.put(`/pricing/admin/${id}`, pricingData);
    return response.data.data;
  },

  // Delete a pricing
  deletePricing: async (id: string): Promise<void> => {
    await api.delete(`/pricing/admin/${id}`);
  },
}; 