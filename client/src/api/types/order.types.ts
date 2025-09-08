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
  work_status: string;
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

export type DataFilterTab = "all" | "style" | "collection";

export interface PaginationResponse {
  total: number;
  page: number;
  page_size: number;
  items: DownFormOrderResponse[];
}

export interface DownFormOrderResponse {
  item: OrderItem;
  status: string;
  message: string;
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

export type BulkCreateOrderItem = Omit<OrderItem, 'id' | 'created_at' | 'updated_at'> & {
  id?: number;
};

export type BulkUpdateOrderItem = Partial<OrderItem> & {
  id: number;
};

export interface DownFormBulkCreateResponse {
  items: DownFormBulkCreateResponseItem[];
  summary?: {
    total: number;
    success: number;
    failed: number;
  };
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

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    index: number;
    field: string;
    message: string;
    value?: any;
  }>;
}

export type ErrorType = 'network' | 'validation' | 'permission' | 'server' | 'unknown';

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: Error;
}

export type ModalType = 'orderRegister' | 'batchInfo' | 'confirmDelete' | 'excelBulk' | 'smileMacro';
export type ModalState = Record<ModalType, boolean>;

export type DeleteActionType = 'bulk' | 'duplicate' | 'selected';

export interface DeleteResult {
  success: boolean;
  deletedCount?: number;
  message: string;
}

export interface OrderContextValue {
  activeOrderTab: DataFilterTab;
  setActiveOrderTab: (tab: DataFilterTab) => void;
  currentTemplate: FormTemplate;
  setCurrentTemplate: (template: FormTemplate) => void;
  orderData: OrderItem[];
  isLoading: boolean;
  error: Error | null;
  gridApi: GridApi | null;
  setGridApi: (api: GridApi | null) => void;
  selectedRows: OrderItem[];
  setSelectedRows: (rows: OrderItem[]) => void;
  changedRows: OrderItem[]; 
  setChangedRows: (rows: OrderItem[]) => void;
  clearSelections: () => void;
  
  hasSelectedRows: boolean;
  hasChangedRows: boolean;
  selectedRowCount: number;
  changedRowCount: number;
  isGridReady: boolean;
  hasData: boolean;
}

export interface BatchInfoData {
  batch_id: number;
  original_filename: string;
  file_name: string;
  file_url: string;
  file_size: number;
  date_from: string; 
  date_to: string;   
  order_status: string | null;
  error_message: string | null;
  created_by: string;
  created_at: string;      
  updated_at: string;      
}

export interface BatchInfoResponse {
  total: number;
  page: number;
  page_size: number;
  items: BatchInfoItem[];
}

export interface BatchInfoItem {
  data: BatchInfoData[];
  status: string | null;
  message: string | null;
}

export interface BatchInfoParams {
  page?: number;
  page_size?: number;
}

export interface ExcelUploadFormData {
  template_code: string;
  order_date_from: string;
  order_date_to: string;
  source_table: string;
  file: File | null;
}

export interface ExcelRunMacroRequest {
  template_code: string;
  created_by: string;
  filters: { date_from: string; date_to: string; };
  source_table: string;
}

export interface GetDownFormOrdersPaginationParams {
  page?: number;
  page_size?: number;
  template_code?: string;
}

export interface DbToExcelRequest {
  data: {
    ord_st_date: string;
    ord_ed_date: string;  
    form_name: string;
  };
  metadata: {
    request_id?: string;
  };
}

export interface DbToExcelResponse {
  success: boolean;
  data: {
    excel_url: string;
    record_count: number;
    file_size: number;
  };
  metadata: {
    version: string;   
    request_id: string;
  };
  message?: string;
}

export interface ExcelToDbRequest {
  request: string; 
  file: File;  
}

export interface ExcelToDbRequestData {
  data: {
    form_name: string; 
    work_status?: string;
  };
  metadata: {
    request_id?: string;
  };
}

export interface ExcelToDbResponse {
  success: boolean;
  data: {
    processed_count: number;
    inserted_count: number;
    updated_count: number;
    failed_count: number;
  };
  metadata: {
    version: string;
    request_id: string;
  };
  message?: string;
}