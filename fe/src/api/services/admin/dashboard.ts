import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface UserStats {
  totalUsers: number;
  adminCount: number;
  employeeCount: number;
  userCount: number;
}

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface DashboardStats {
  userStats: UserStats;
  bookingStats: BookingStats;
}

export const getDashboardStats = async () => {
  return api.get<{ data: DashboardStats }>(API_ENDPOINTS.DASHBOARD);
};
