import type { GridApi } from "ag-grid-community";

export interface OrderItem {
  id?: number;
  process_dt: string;
  form_name: string;
  seq?: number;
  idx: string;
  order_date?: string;
  reg_date?: string;
  ord_confirm_date?: string;
  rtn_dt?: string;
  chng_dt?: string;
  delivery_confirm_date?: string;
  cancel_dt?: string;
  hope_delv_date?: string;
  inv_send_dm?: string;
  order_id: string;
  mall_order_id?: string;
  product_id: string;
  product_name: string;
  mall_product_id?: string;
  item_name?: string;
  sku_value?: string;
  sku_alias?: string;
  sku_no?: string;
  barcode?: string;
  model_name?: string;
  erp_model_name?: string;
  location_nm?: string;
  sale_cnt: number;
  pay_cost: number;
  delv_cost: number;
  total_cost?: number;
  total_delv_cost?: number;
  expected_payout: number;
  etc_cost?: string;
  price_formula?: string;
  service_fee: number;
  sum_p_ea?: number;
  sum_expected_payout?: number;
  sum_pay_cost?: number;
  sum_delv_cost?: number;
  sum_total_cost?: number;
  receive_name?: string;
  receive_cel?: string;
  receive_tel?: string;
  receive_addr?: string;
  receive_zipcode?: string;
  delivery_payment_type?: string;
  delv_msg?: string;
  delivery_id?: string;
  delivery_class?: string;
  invoice_no?: string;
  fld_dsp?: string;
  order_etc_6?: string;
  order_etc_7?: string;
  etc_msg?: string;
  free_gift?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderResponse {
  data: OrderItem[];
  total: number;
  page?: number;
  limit?: number;
}

export interface OrderRegisterData {
  selectedTemplate: string;
  orderData: any[];
}

export interface OrderRegisterFormData {
  selectedTemplate: string;
  orderData: any[];
}

export interface OrderRegisterForm {
  selectedTemplate: string;
  orderData: {
    order_number?: string;
    customer_name?: string;
    product_name?: string;
    quantity?: number;
    price?: number;
    order_date?: string;
  };
}

export interface OrderData {
  id: string;
  order_id: string;
  mall_order_id: string;
  product_name: string;
  receive_name: string;
  receive_cel: string;
  sale_cnt: number;
  pay_cost: number;
  expected_payout: number;
  service_fee: number;
  delv_cost: number;
  fld_dsp: string;
  receive_addr: string;
  delv_msg: string;
  sku_value: string;
  process_dt: string;
  created_at: string;
}

export interface BulkCreateRequest {
  items: BulkCreateOrderItem[];
}

export interface BulkUpdateRequest {
  items: BulkUpdateOrderItem[];
}

export interface BulkDeleteRequest {
  ids: number[];
}

export interface BulkOperationResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Array<{
    index?: number;
    id?: number;
    message: string;
    field?: string;
  }>;
}

export type BulkCreateOrderItem = Omit<OrderItem, 'id' | 'created_at' | 'updated_at'> & {
  id?: number;
};

export type BulkUpdateOrderItem = Partial<OrderItem> & {
  id: number;
};

export interface ExcelUploadFilters {
  order_date_from: string;
  order_date_to: string;
}

export interface ExcelUploadRequestData {
  template_code: string;
  created_by: string;
  filters: ExcelUploadFilters;
  source_table: string;
}

export interface ExcelUploadRequest {
  request: ExcelUploadRequestData;
  file: File;
}

export interface ExcelUploadResponse {
  file_url: string;
  object_name: string;
  template_code: string;
}

export interface ExcelUploadFormData {
  template_code: string;
  order_date_from: string;
  order_date_to: string;
  source_table: string;
  file: File | null;
}

// Simple Excel upload request for direct file uploads
export interface SimpleExcelUploadRequest {
  template_code: string;
  file: File;
}

export interface DownFormOrderResponse {
  item: any;
  status: string;
  message: string;
}

export interface PaginationResponse {
  total: number;
  page: number;
  page_size: number;
  items: DownFormOrderResponse[];
}

export interface GetDownFormOrdersPaginationParams {
  page?: number;
  page_size?: number;
  template_code?: string;
}

export interface UseDownFormOrderPaginationParams extends GetDownFormOrdersPaginationParams {
  enabled?: boolean;
}

export interface UseOrderDataParams {
  page: number;
}

export type OrderTab = "registration" | "bulk-registration";

export interface OrderContextValue {
  activeOrderTab: OrderTab;
  setActiveOrderTab: (tab: OrderTab) => void;
  currentTemplate: string;
  setCurrentTemplate: (template: string) => void;
  orderData: any[];
  createInfiniteDataSource: () => any;
  isLoading: boolean;
  error: unknown;
  loadMoreOrders: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refreshOrders: () => void;
  totalLoadedItems: number;
  gridApi: GridApi | null;
  setGridApi: (api: GridApi | null) => void;
  selectedRows: any[];
  setSelectedRows: (rows: any[]) => void;
  changedRows: any[];
  setChangedRows: (rows: any[]) => void;
  clearSelections: () => void;
};

export interface UseOrderGridParams {
  gridApi: GridApi | null;
  setGridApi: (api: GridApi | null) => void;
  selectedRows: any[];
  setSelectedRows: (rows: any[]) => void;
  changedRows: any[];
  setChangedRows: (rows: any[]) => void;
}

export interface BatchInfoData {
  batch_id: number;
  original_filename: string;
  file_name: string;
  file_url: string;
  file_size: number;
  order_date_from: string; 
  order_date_to: string;   
  order_status: string | null;
  error_message: string | null;
  created_by: string;
  created_at: string;      
  updated_at: string;      
}

export interface BatchInfoItem {
  data: BatchInfoData[];
  status: string | null;
  message: string | null;
}

export interface BatchInfoResponse {
  total: number;
  page: number;
  page_size: number;
  items: BatchInfoItem[];
}

export interface BatchInfoParams {
  page?: number;
  page_size?: number;
}

export interface DownFormBulkCreateResponseItem {
  item: OrderItem;
  status: 'success' | 'error';
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface DownFormBulkCreateResponse {
  items: DownFormBulkCreateResponseItem[];
  summary?: {
    total: number;
    success: number;
    failed: number;
  };
}

export interface ExcelRunMacroRequest {
  template_code: string;
  created_by: string;
  filters: { date_from: string; date_to: string; };
  source_table: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    index: number;
    field: string;
    message: string;
    value?: any;
  }>;
}

export type FormTemplate = 
  | 'gmarket_erp'
  | 'coupang_erp'
  | 'auction_erp'
  | 'interpark_erp'
  | 'wemakeprice_erp'
  | 'tmon_erp';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';