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
  locations: Location[];
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