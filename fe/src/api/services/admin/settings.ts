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

export interface Settings {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  logo: string;
  facebook: string;
  youtube: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  description: string;
  keywords: string;
  locations?: Location[];
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