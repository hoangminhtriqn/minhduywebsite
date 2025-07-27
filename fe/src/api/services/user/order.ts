import { api } from '@/api';
import { Order, CartItem } from '@/api/types';
import { API_ENDPOINTS } from '@/api/config';

export const orderService = {
  getOrders: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS, { params });
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await api.get<Order>(`${API_ENDPOINTS.ORDERS}/${orderId}`);
    return response.data;
  },

  getUserOrders: async (userId: string) => {
    const response = await api.get<Order[]>(`${API_ENDPOINTS.USERS}/${userId}/orders`);
    return response.data;
  },

  createOrder: async (userId: string, items: CartItem[], totalAmount: number, data: any) => {
    const formData = new FormData();
    // Append other data fields as needed
    for (const key in data) {
      formData.append(key, data[key]);
    }
    // Append items and totalAmount - might need adjustment based on your backend API
    formData.append('items', JSON.stringify(items));
    formData.append('totalAmount', totalAmount.toString());

    const response = await api.post<Order>(`${API_ENDPOINTS.USERS}/${userId}/orders`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: Order['Status']) => {
    const response = await api.put<Order>(`${API_ENDPOINTS.ORDERS}/${orderId}/status`, { status });
    return response.data;
  },
}; 