import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface NewsEvent {
  _id: string;
  Title: string;
  Content: string;
  PublishDate?: string;
  ImageUrl?: string;
  Status: 'draft' | 'published' | 'archived' | 'active' | 'inactive';
  viewCount: number;
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
  const response = await api.get(API_ENDPOINTS.NEWS_EVENTS, { params: { page, limit } });
  return response.data.data;
};

// Get popular news events
export const getPopularNewsEvents = async (page = 1, limit = 6): Promise<NewsEventsPaginationResponse> => {
  const response = await api.get(API_ENDPOINTS.NEWS_EVENTS_POPULAR, { params: { page, limit } });
  return response.data.data;
};

// Get single news event by ID
export const getNewsEventById = async (id: string): Promise<NewsEvent> => {
  const response = await api.get(`${API_ENDPOINTS.NEWS_EVENTS}/${id}`);
  return response.data.data;
};

// Create news event (Admin only)
export const createNewsEvent = async (newsEventData: Partial<NewsEvent> | FormData): Promise<NewsEvent> => {
  const response = await api.post(API_ENDPOINTS.NEWS_EVENTS, newsEventData);
  return response.data.data;
};

// Update news event (Admin only)
export const updateNewsEvent = async (id: string, newsEventData: Partial<NewsEvent> | FormData): Promise<NewsEvent> => {
  const response = await api.put(`${API_ENDPOINTS.NEWS_EVENTS}/${id}`, newsEventData);
  return response.data.data;
};

// Delete news event (Admin only)
export const deleteNewsEvent = async (id: string): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.NEWS_EVENTS}/${id}`);
};

// Increment view count for a news event
export const incrementNewsEventViewCount = async (id: string): Promise<NewsEvent> => {
  const response = await api.post(`${API_ENDPOINTS.NEWS_EVENTS}/${id}/view`);
  return response.data.data;
}; 