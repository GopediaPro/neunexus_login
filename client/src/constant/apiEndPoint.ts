export const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_END_POINT = {
  PRODUCTS: '/api/v1/products',
  DOWN_FORM_ORDERS: '/api/v1/down-form-orders',
  DOWN_FORM_ORDERS_BULK_CREATE: '/api/v1/down-form-orders/bulk',
  DOWN_FORM_ORDERS_BULK_UPDATE: '/api/v1/down-form-orders/bulk',
  DOWN_FORM_ORDERS_BULK_DELETE: '/api/v1/down-form-orders/bulk', 
  DOWN_FORM_EXCEL_UPLOAD: '/api/v1/macro/excel-run-macro',
} as const;