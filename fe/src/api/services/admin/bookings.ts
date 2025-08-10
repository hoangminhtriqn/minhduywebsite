import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface Booking {
  _id: string;
  FullName: string;
  Email: string;
  Phone: string;
  Address: string;
  ServiceTypes: string | { _id: string; name: string };
  BookingDate: string;
  BookingTime: string;
  Notes?: string;
  Status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingListResponse {
  success: boolean;
  message: string;
  data: {
    bookings: Booking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export const getBookings = (params: { page: number; limit: number; search?: string; status?: string }) =>
  api.get<BookingListResponse>(API_ENDPOINTS.ADMIN_BOOKINGS, { params });

export const getBooking = (id: string) =>
  api.get<{ success: boolean; data: { booking: Booking } }>(`${API_ENDPOINTS.ADMIN_BOOKINGS}/${id}`);

export const updateBookingStatus = (id: string, status: string) =>
  api.put(`${API_ENDPOINTS.ADMIN_BOOKINGS}/${id}/status`, { status });

export const deleteBooking = (id: string) =>
  api.delete(`${API_ENDPOINTS.ADMIN_BOOKINGS}/${id}`); 