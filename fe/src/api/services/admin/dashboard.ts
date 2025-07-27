import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface UserStats {
  totalUsers: number;
  adminCount: number;
  userCount: number;
}

export interface ServiceRequestStats {
  totalRequests: number;
  pendingRequests: number;
  confirmedRequests: number;
  completedRequests: number;
  cancelledRequests: number;
}

export interface DashboardStats {
  userStats: UserStats;
  serviceRequestStats: ServiceRequestStats;
}

export const getDashboardStats = async () => {
  return api.get<{ data: DashboardStats }>(API_ENDPOINTS.DASHBOARD);
}; 