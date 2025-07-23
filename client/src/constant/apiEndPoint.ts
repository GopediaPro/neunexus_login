export const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_END_POINT = {
  PRODUCTS: '/api/v1/products',
  // 다운폼 주문 기본 엔드포인트
  DOWN_FORM_ORDERS: '/api/v1/down-form-orders',
  DOWN_FORM_ORDERS_PAGINATION: '/api/v1/down-form-orders/pagination',
  
  // 다운폼 주문 대량 작업
  DOWN_FORM_ORDERS_BULK_CREATE: '/api/v1/down-form-orders/bulk',
  DOWN_FORM_ORDERS_BULK_UPDATE: '/api/v1/down-form-orders/bulk',
  DOWN_FORM_ORDERS_BULK_DELETE: '/api/v1/down-form-orders/bulk',
  
  // 다운폼 주문 삭제 작업
  DOWN_FORM_ORDERS_DELETE_ALL: '/api/v1/down-form-orders/all',
  DOWN_FORM_ORDERS_DELETE_DUPLICATE: '/api/v1/down-form-orders/duplicate',
  
  // 엑셀 관련
  DOWN_FORM_EXCEL_TO_MINIO: '/api/v1/down-form-orders/excel-to-minio',
  DOWN_FORM_EXCEL_TO_DB: '/api/v1/down-form-orders/excel-to-db',
  
  // 필터 기반 대량 생성
  DOWN_FORM_ORDERS_BULK_FILTER: '/api/v1/down-form-orders/bulk/filter',
  DOWN_FORM_ORDERS_BULK_WITHOUT_FILTER: '/api/v1/down-form-orders/bulk/without-filter',

  MACRO_EXCEL_RUN_MACRO: '/api/v1/macro/excel-run-macro',
} as const;