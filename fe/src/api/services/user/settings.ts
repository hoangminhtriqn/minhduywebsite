import { api } from '@/api';

export interface PublicSettings {
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

export const getPublicSettings = async (): Promise<PublicSettings> => {
  const response = await api.get<{ success: boolean; data: PublicSettings }>(
    '/settings/public'
  );
  return response.data.data;
}; 