import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './config';
import { toast } from 'react-toastify';
import { ROUTERS } from '@/utils/constant';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login only if not already on login page
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      // Don't redirect if we're already on the login page
      if (window.location.pathname !== ROUTERS.USER.LOGIN) {
        window.location.href = ROUTERS.USER.LOGIN;
      }
    }
    
    if (error.response?.status === 403) {
      // Forbidden - redirect to home
      window.location.href = '/';
    }
    
    // Don't show toast for 401 errors on login page to avoid duplicate messages
    if (!(error.response?.status === 401 && window.location.pathname === ROUTERS.USER.LOGIN)) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 