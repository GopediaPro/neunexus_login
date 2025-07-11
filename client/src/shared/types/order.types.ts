export interface OrderItem {
  id: number;
  idx: string;
  barcode: string | null;
  created_at: string;
  delivery_class: string | null;
  delivery_id: string | null;
  delivery_payment_type: string | null;
  delv_cost: string;
  delv_msg: string;
  erp_model_name: string | null;
  etc_cost: string | null;
  etc_msg: string | null;
  expected_payout: string;
  fld_dsp: string;
  form_name: string;
  free_gift: string | null;
  invoice_no: string | null;
  item_name: string | null;
  location_nm: string | null;
  mall_order_id: string;
  mall_product_id: string;
  model_name: string | null;
  order_etc_6: string | null;
  order_etc_7: string | null;
  order_id: string;
  pay_cost: string;
  price_formula: string | null;
  process_dt: string;
  product_id: string;
  product_name: string;
  receive_addr: string;
  receive_cel: string;
  receive_name: string;
  receive_tel: string;
  receive_zipcode: string;
  sale_cnt: number;
  seq: string | null;
  service_fee: string;
  sku_alias: string | null;
  sku_no: string | null;
  sku_value: string;
  sum_delv_cost: string | null;
  sum_expected_payout: string | null;
  sum_p_ea: string | null;
  sum_pay_cost: string | null;
  sum_total_cost: string | null;
  total_cost: string | null;
  total_delv_cost: string | null;
  updated_at: string;
}

export interface OrderResponse {
  data: OrderItem[];
  total: number;
  page?: number;
  limit?: number;
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

export interface ExcelUploadRequest {
  template_code: string;
  file: File | null;
}

export interface ExcelUploadResponse {
  file_url: string;
  object_name: string;
  template_code: string;
}