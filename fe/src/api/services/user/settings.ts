import { api } from '@/api';

export interface PublicSettings {
  companyName: string;
  phone: string;
  email: string;
  workingHours: string;
  logo: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  description: string;
  keywords: string;
}

export const getPublicSettings = async (): Promise<PublicSettings> => {
  const response = await api.get<{ success: boolean; data: PublicSettings }>(
    '/settings/public'
  );
  return response.data.data;
};

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

export const getLocations = async (): Promise<Location[]> => {
  const res = await api.get<{ success: boolean; data: Location[] }>(
    '/settings/locations'
  );
  return res.data.data;
}; 