import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface CreateBookingRequest {
  FullName: string;
  Email: string;
  Phone: string;
  Address: string;
  CarModel: string;
  TestDriveDate: string;
  TestDriveTime: string;
  Notes?: string;
}

export const createBooking = (data: CreateBookingRequest) =>
  api.post(API_ENDPOINTS.BOOKINGS, data); 