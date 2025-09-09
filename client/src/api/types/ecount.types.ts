export interface ErpTransferRequest {
  data: {
    date_from: string;
    date_to: string;
    form_name: 'okmart_erp_sale_ok' | 'okmart_erp_sale_iyes' | 'iyes_erp_sale_iyes' | 'iyes_erp_purchase_iyes';
  };
  metadata: {
    request_id: string;
  };
}

export interface ErpTransferResponse {
  success: boolean;
  data: {
    batch_id: string;
    total_records: number;
    processed_records: number;
    excel_file_name: string;
    download_url: string;
    file_size: number;
    form_name: string;
    date_range: {
      from: string;
      to: string;
    };
  };
  metadata: {
    version: string;
    request_id: string;
  };
}

export interface EcountExcelImportRequest {
  data: {
    sheet_name: string;
    clear_existing: boolean;
  };
  metadata: {
    request_id: string;
  };
}

export interface EcountAllDataImportRequest {
  data: {
    clear_existing: boolean;
    erp_partner_code_sheet: string;
    iyes_cost_sheet: string;
  };
  metadata: {
    request_id: string;
  };
}

export interface EcountImportResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
    imported_count: number;
    file_name: string;
    error_details?: string;
  };
  metadata: {
    version: string;
    request_id: string;
  };
}

export interface EcountDownloadRequest {
  data: {};
  metadata: {
    request_id: string;
  };
}

export interface EcountDownloadResponse {
  success: boolean;
  data: {
    download_url: string;
    file_name: string;
    file_size: number;
  };
  metadata: {
    version: string;
    request_id: string;
  };
}