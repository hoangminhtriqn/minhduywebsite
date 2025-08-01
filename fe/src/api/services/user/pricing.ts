import { api } from '@/api/api';
import { API_ENDPOINTS } from '@/api/config';

export interface PricingDocument {
  name: string;
  type: 'pdf' | 'word' | 'excel';
  size: string;
  url: string;
}

export interface Pricing {
  _id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  documents: PricingDocument[];
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 
          'indigo' | 'pink' | 'yellow' | 'cyan' | 'lime' | 'amber' |
          'emerald' | 'violet' | 'rose' | 'sky' | 'slate' | 'zinc' |
          'neutral' | 'stone' | 'gray' | 'cool-gray' | 'warm-gray';
  status: 'active' | 'inactive';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PricingResponse {
  success: boolean;
  message: string;
  data: {
    docs: Pricing[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

// Get all pricing items with pagination
export const getAllPricing = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PricingResponse> => {
  const response = await api.get(API_ENDPOINTS.PRICING, { params });
  return response.data;
}; 