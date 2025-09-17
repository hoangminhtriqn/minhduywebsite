import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface Location {
  _id?: string;
  id?: number;
  name: string;
  address: string;
  coordinates: string;
  mapUrl: string;
  isMainAddress: boolean;
  description?: string;
}

export interface Slide {
  _id?: string;
  src: string;
  alt: string;
  order: number;
  isActive: boolean;
}

export interface Settings {
  companyName: string;
  phone: string;
  email: string;
  workingHours: string;
  logo: string;
  serviceOverviewImage: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  zaloUrl: string;
  facebookMessengerUrl: string;
  description: string;
  keywords: string;
  locations?: Location[];
  slides?: Slide[];
}

export interface SettingsResponse {
  success: boolean;
  data: Settings;
  message?: string;
}

// Lấy settings
export const getSettings = async (): Promise<Settings> => {
  try {
    const response = await api.get<SettingsResponse>(API_ENDPOINTS.SETTINGS);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

// Cập nhật settings
export const updateSettings = async (data: Partial<Settings>): Promise<Settings> => {
  try {
    const response = await api.put<SettingsResponse>(API_ENDPOINTS.SETTINGS, data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// Lấy public settings (cho frontend)
export const getPublicSettings = async (): Promise<Settings> => {
  try {
    const response = await api.get<SettingsResponse>(API_ENDPOINTS.SETTINGS_PUBLIC);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching public settings:', error);
    throw error;
  }
};

export const getLocations = async (): Promise<Location[]> => {
  const res = await api.get(API_ENDPOINTS.SETTINGS_LOCATIONS);
  return res.data.data;
};

export const createLocation = async (data: Omit<Location, 'id'>): Promise<Location> => {
  const res = await api.post(API_ENDPOINTS.SETTINGS_LOCATIONS, data);
  return res.data.data;
};

export const updateLocation = async (id: string, data: Partial<Location>): Promise<Location> => {
  const res = await api.put(`${API_ENDPOINTS.SETTINGS_LOCATIONS}/${id}`, data);
  return res.data.data;
};

export const deleteLocation = async (id: string): Promise<Location> => {
  const res = await api.delete(`${API_ENDPOINTS.SETTINGS_LOCATIONS}/${id}`);
  return res.data.data;
};

// Slides API
export const getSlides = async (): Promise<Slide[]> => {
  const res = await api.get(API_ENDPOINTS.SETTINGS_SLIDES);
  return res.data.data;
};

export const createSlide = async (data: Omit<Slide, '_id'>): Promise<Slide> => {
  const res = await api.post(API_ENDPOINTS.SETTINGS_SLIDES, data);
  return res.data.data;
};

export const updateSlide = async (id: string, data: Partial<Slide>): Promise<Slide> => {
  const res = await api.put(`${API_ENDPOINTS.SETTINGS_SLIDES}/${id}`, data);
  return res.data.data;
};

export const deleteSlide = async (id: string): Promise<Slide> => {
  const res = await api.delete(`${API_ENDPOINTS.SETTINGS_SLIDES}/${id}`);
  return res.data.data;
};

// Upload service overview image
export const uploadServiceOverviewImage = async (file: File): Promise<{ imageUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`${API_ENDPOINTS.SETTINGS}/upload-service-overview`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error uploading service overview image:', error);
    throw error;
  }
};

// Upload logo
export const uploadLogo = async (file: File): Promise<{ imageUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`${API_ENDPOINTS.SETTINGS}/upload-logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}; 