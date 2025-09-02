import type { ProductTab } from "@/api/context/ProductContext";
import type { ColDef, GridApi } from "ag-grid-community";

// 상품 기본 데이터 (id 없음)
export interface ProductBaseData {
  product_nm: string;
  goods_nm: string;
  brand_nm?: string;
  goods_price: number;
  goods_consumer_price?: number;
  status?: number;
  maker?: string;
  origin?: string;
  good_keyword?: string;
  detail_path_img: string;
  delv_cost: number; 
  goods_search: string; 
  certno: string;
  char_process?: string;
  char_1_nm?: string;
  char_1_val?: string;
  char_2_nm?: string;
  char_2_val?: string;
  img_path: string;
  img_path1?: string;
  img_path2?: string;
  img_path3?: string;
  img_path4?: string;
  img_path5?: string;
  goods_remarks?: string;
  mobile_bn?: string;
  one_plus_one_bn?: string;
  goods_remarks_url?: string;
  delv_one_plus_one?: string;
  delv_one_plus_one_detail?: string;
  stock_use_yn: string;
  class_nm1: string;
  class_nm2?: string;
  class_nm3?: string;
  class_nm4?: string;
  created_at?: string;
  updated_at?: string;
}

// 상품 데이터 수정/삭제용 타입 (id 있음)
export interface ProductData extends ProductBaseData {
  id: number;
}

// 상품 데이터 등록용 타입 (id 없음)
export type ProductCreateData = ProductBaseData;

// 상품 데이터 수정용 타입
export type ProductUpdateData = ProductData;

// 폼 데이터 타입
export type ProductFormData = Omit<ProductBaseData, 'created_at' | 'updated_at'>;

// 수정 폼 데이터 타입
export type ProductEditFormData = Omit<ProductData, 'created_at' | 'updated_at'>;

// 상품 조회 파라미터
export interface GetProductsParams {
  limit?: number;   // 조회할 데이터 수 (기본: 100, 최대: 1000)
  offset?: number;  // 조회 시작 위치 (기본: 0)
}

export interface UseProductDataParams {
  search?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

// API 요청/응답 타입
export interface ProductCreateRequest {
  data: ProductCreateData[];
  metadata: {
    request_id: string;
  };
}

export interface ProductUpdateRequest {
  data: ProductUpdateData[];
  metadata: {
    request_id: string;
  };
}

export interface ProductDeleteRequest {
  data: { id: number }[];
  metadata: {
    request_id: string;
  };
}

// 상품 목록 응답 타입
export type ProductListResponse = ProductData[];

// 등록/수정/삭제 응답 타입
export interface ProductBulkResponse {
  success: boolean;
  data: {
    success_count: number;
    error_count: number;
    created_ids?: number[];
    updated_ids?: number[];
    deleted_ids?: number[];
    errors: string[];
    success_data: ProductData[];
  };
  metadata: {
    version: string;
    request_id: string;
  };
}

// Context 타입
export interface ProductContextValue {
  search: string;
  setSearch: (value: string) => void;
  activeProductTab: ProductTab;
  setActiveProductTab: (tab: ProductTab) => void;
  page: number;
  setPage: (page: number) => void;
  productData: ProductData[];
  isLoading: boolean;
  error: unknown;
  refreshProducts: () => void;
  gridRef: any;
  columnDefs: ColDef<ProductData>[];
  defaultColDef: ColDef<ProductData>;
  gridOptions: any;
  gridApi: GridApi | null;
  setGridApi: (api: GridApi | null) => void;
  selectedRows: any[];
  setSelectedRows: (rows: any[]) => void;
  changedRows: any[];
  setChangedRows: (rows: any[]) => void;
  clearSelections: () => void;
}