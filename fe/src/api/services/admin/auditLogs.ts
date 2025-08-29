import { api } from '@/api';
import { API_ENDPOINTS } from '@/api/config';

export interface AuditLogItem {
  _id: string;
  actorId: string;
  actorUserName?: string;
  actorRole?: string;
  module: string;
  event: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  messageTemplate: string;
  messageParams: Record<string, string>;
  metadata?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface AuditLogListResponse {
  items: AuditLogItem[];
  pagination: { total: number; page: number; limit: number };
}

export const auditLogService = {
  list: async (params: { page?: number; limit?: number; search?: string; read?: boolean }) => {
    const response = await api.get(API_ENDPOINTS.AUDIT_LOGS, { params });
    return response.data.data as AuditLogListResponse;
  },
  markRead: async (ids: string[]) => {
    const response = await api.put(API_ENDPOINTS.AUDIT_LOGS_MARK_READ, { ids });
    return response.data;
  },
  deleteMany: async (ids: string[]) => {
    const response = await api.delete(API_ENDPOINTS.AUDIT_LOGS, { data: { ids } });
    return response.data;
  },
  // Extended delete with optional restore/purge actions
  deleteManyWithOptions: async (ids: string[], options?: { restore?: boolean; purge?: boolean }) => {
    const response = await api.delete(API_ENDPOINTS.AUDIT_LOGS, { data: { ids, ...(options || {}) } });
    return response.data;
  },
};


