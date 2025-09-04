export const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_VERSION = '/api/v1';
const API_VERSION_2 = '/api/v2';

export const API_END_POINT = {
  PRODUCTS: `${API_VERSION}/product`,
  // 다운폼 주문 기본 엔드포인트
  DOWN_FORM_ORDERS: `${API_VERSION}/down-form-orders`,
  DOWN_FORM_ORDERS_PAGINATION: `${API_VERSION}/down-form-orders/pagination`,
  DOWN_FORM_ODDERS_PAGINATION_DATE_RANGE: `${API_VERSION}/down-form-orders/pagination/date-range`,
  CREATE_FROM_RECEIVE_ORDERS: `${API_VERSION}/down-form-orders/create-from-receive-orders`,
  
  // 다운폼 주문 대량 작업
  DOWN_FORM_ORDERS_BULK_CREATE: `${API_VERSION}/down-form-orders/bulk`,
  DOWN_FORM_ORDERS_BULK_UPDATE: `${API_VERSION}/down-form-orders/bulk`,
  DOWN_FORM_ORDERS_BULK_DELETE: `${API_VERSION}/down-form-orders/bulk`,
  
  // 다운폼 주문 삭제 작업
  DOWN_FORM_ORDERS_DELETE_ALL: `${API_VERSION}/down-form-orders/all`,
  DOWN_FORM_ORDERS_DELETE_DUPLICATE: `${API_VERSION}/down-form-orders/duplicate`,
  
  // 필터 기반 대량 생성
  DOWN_FORM_ORDERS_BULK_FILTER: `${API_VERSION}/down-form-orders/bulk/filter`,
  DOWN_FORM_ORDERS_BULK_WITHOUT_FILTER: `${API_VERSION}/down-form-orders/bulk/without-filter`,

  // 매크로
  MACRO_EXCEL_RUN_MACRO: `${API_VERSION}/macro/excel-run-macro`,
  MACRO_EXCEL_RUN_MACRO_BULK: `${API_VERSION}/macro/excel-run-macro-bulk`,
  MACRO_BATCH_INFO_ALL: `${API_VERSION}/macro/batch-info/all`,
  MACRO_BATCH_INFO_LATEST: `${API_VERSION}/macro/batch-info/latest`,

  PRODUCT_REGISTRATION_EXCEL_IMPORT: `${API_VERSION}/product-registration/complete-workflow`,

  SMILE_MACRO_MULTIPLE_V2: `${API_VERSION_2}/smile-macro/smile-excel-macro-multiple-v2`
} as const;