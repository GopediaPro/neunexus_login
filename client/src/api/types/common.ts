export interface FileItem {
  id: string;
  name: string;
  size: number;
  status: 'waiting' | 'uploading' | 'completed' | 'error';
  progress?: number;
  uploadTime?: string;
  file?: File;
}

export interface FileResult {
  name: string;
  url?: string;
  status: 'success' | 'error';
}

export interface BulkResult {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  fileResults: FileResult[];
}

export interface RequestMetadata {
  request_id?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}
