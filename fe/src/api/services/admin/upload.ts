import { api } from '@/api';

export interface UploadFileResponse {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
}

export interface FileInfo {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
}

export interface FileUrlParams {
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
  format?: string;
}

// Upload single file
export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

// Upload multiple files
export const uploadMultipleFiles = async (files: File[]): Promise<UploadFileResponse[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await api.post('/files/upload-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

// Get file info by public_id
export const getFileInfo = async (publicId: string): Promise<FileInfo> => {
  const response = await api.get(`/files/${publicId}`);
  return response.data.data;
};

// Get all files from Cloudinary
export const getAllFiles = async (maxResults = 50, nextCursor?: string) => {
  const params = new URLSearchParams();
  params.append('max_results', maxResults.toString());
  if (nextCursor) {
    params.append('next_cursor', nextCursor);
  }

  const response = await api.get(`/files?${params.toString()}`);
  return response.data.data;
};

// Delete file by public_id
export const deleteFile = async (publicId: string) => {
  const response = await api.delete(`/files/${publicId}`);
  return response.data.data;
};

// Delete multiple files
export const deleteMultipleFiles = async (publicIds: string[]) => {
  const response = await api.delete('/files', {
    data: { public_ids: publicIds },
  });
  return response.data.data;
};

// Get file URL with transformations
export const getFileUrl = async (publicId: string, params: FileUrlParams = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await api.get(`/files/${publicId}/url?${queryParams.toString()}`);
  return response.data.data;
};

// Search files
export const searchFiles = async (query: string, maxResults = 50, nextCursor?: string) => {
  const params = new URLSearchParams();
  params.append('query', query);
  params.append('max_results', maxResults.toString());
  if (nextCursor) {
    params.append('next_cursor', nextCursor);
  }

  const response = await api.get(`/files/search?${params.toString()}`);
  return response.data.data;
}; 