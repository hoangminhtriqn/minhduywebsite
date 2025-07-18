import { api } from '@/api';

export interface NewsEvent {
  _id: string;
  Title: string;
  Content: string;
  PublishDate?: string;
  ImageUrl?: string;
  Status: 'draft' | 'published' | 'archived' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface NewsEventsResponse {
  success: boolean;
  data: NewsEvent[];
  message?: string;
}

export interface NewsEventResponse {
  success: boolean;
  data: NewsEvent;
  message?: string;
}

export interface NewsEventsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NewsEventsPaginationResponse {
  data: NewsEvent[];
  pagination: NewsEventsPagination;
}

// Get all news events
export const getAllNewsEvents = async (page = 1, limit = 10): Promise<NewsEventsPaginationResponse> => {
  const response = await api.get('/tin-tuc-su-kien', { params: { page, limit } });
  return response.data.data;
};

// Get single news event by ID
export const getNewsEventById = async (id: string): Promise<NewsEvent> => {
  try {
    const response = await api.get(`/tin-tuc-su-kien/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create news event (Admin only)
export const createNewsEvent = async (newsEventData: Partial<NewsEvent> | FormData): Promise<NewsEvent> => {
  try {
    const response = await api.post('/tin-tuc-su-kien', newsEventData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update news event (Admin only)
export const updateNewsEvent = async (id: string, newsEventData: Partial<NewsEvent> | FormData): Promise<NewsEvent> => {
  try {
    const response = await api.put(`/tin-tuc-su-kien/${id}`, newsEventData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete news event (Admin only)
export const deleteNewsEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tin-tuc-su-kien/${id}`);
  } catch (error) {
    throw error;
  }
}; 