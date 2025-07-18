import { api } from '@/api';

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
}

export interface SettingsResponse {
  success: boolean;
  data: Settings;
  message?: string;
}

// Lấy settings
export const getSettings = async (): Promise<Settings> => {
  try {
    const response = await api.get<SettingsResponse>('/settings');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

// Cập nhật settings
export const updateSettings = async (data: Partial<Settings>): Promise<Settings> => {
  try {
    const response = await api.put<SettingsResponse>('/settings', data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// Lấy public settings (cho frontend)
export const getPublicSettings = async (): Promise<Settings> => {
  try {
    const response = await api.get<SettingsResponse>('/settings/public');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching public settings:', error);
    throw error;
  }
}; 