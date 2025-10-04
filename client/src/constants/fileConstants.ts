export const FILE_CONSTANTS = {
  ALLOWED_EXTENSIONS: ['.xlsx', '.xls'],
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ACCEPT_TYPES: '.xlsx,.xls',
  PROGRESS_UPDATE_INTERVAL: 300
} as const;

export const UPLOAD_STATUS = {
  WAITING: 'waiting',
  UPLOADING: 'uploading', 
  COMPLETED: 'completed',
  ERROR: 'error'
} as const;