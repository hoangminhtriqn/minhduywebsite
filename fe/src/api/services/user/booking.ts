import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface CreateBookingRequest {
  FullName: string;
  Email: string;
  Phone: string;
  Address: string;
  ServiceTypes: string; // ServiceType _id
  BookingDate: string;
  BookingTime: string;
  Notes?: string;
}

export const createBooking = (data: CreateBookingRequest) =>
  api.post(API_ENDPOINTS.BOOKINGS, data); 