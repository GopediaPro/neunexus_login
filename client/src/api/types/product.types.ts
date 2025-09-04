import type { ProductTab } from "@/api/context/ProductContext";
import type { ColDef, GridApi } from "ag-grid-community";

// 상품 기본 데이터 (id 없음)
export interface ProductItemBase {
  product_nm: string;                    // 상품명
  goods_nm: string;                      // 제품명
  detail_path_img: string;               // 상세 이미지
  delv_cost: number;                     // 배송비
  goods_search: string;                  // 검색어
  goods_price: number;                   // 판매가격
  stock_use_yn: string;                  // 재고여부
  certno: string;                        // 인증번호
  char_process?: string;                 // 가공 방식
  char_1_nm?: string;                    // 옵션1 이름
  char_1_val?: string;                   // 옵션1 값
  char_2_nm?: string;                    // 옵션2 이름
  char_2_val?: string;                   // 옵션2 값
  img_path: string;                      // 메인 이미지
  img_path1?: string;                    // 추가 이미지1
  img_path2?: string;                    // 추가 이미지2
  img_path3?: string;                    // 추가 이미지3
  img_path4?: string;                    // 추가 이미지4
  img_path5?: string;                    // 추가 이미지5
  goods_remarks?: string;                // 상품 비고사항
  mobile_bn?: string;                    // 모바일 배너
  one_plus_one_bn?: string;              // 1+1 배너
  goods_remarks_url?: string;            // 상품 비고 URL
  delv_one_plus_one?: string;            // 1+1 배송 정보
  delv_one_plus_one_detail?: string;     // 1+1 배송 상세정보
  class_nm1: string;
  class_nm2?: string;
  class_nm3?: string;
  class_nm4?: string;
  created_at?: string;                   // 생성일시
  updated_at?: string;                   // 수정일시
}

// 상품 데이터 수정/삭제용 타입 (id 있음)
export interface ProductItem extends ProductItemBase {
  id: number;
}

// 상품 데이터 등록용 타입 (id 없음)
// export type ProductCreateData = ProductItemBase;

// 상품 데이터 수정용 타입
// export type ProductUpdateData = ProductItem;

// 폼 데이터 타입
export type ProductFormData = Omit<ProductItemBase, 'created_at' | 'updated_at'>;

// 수정 폼 데이터 타입
export type ProductEditFormData = Omit<ProductItem, 'created_at' | 'updated_at'>;

// 상품 조회 파라미터
export interface GetProductsParams {
  limit?: number;   // 조회할 데이터 수
  skip?: number;    // 조회 시작 위치
}

export interface UseProductDataParams {
  search?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

// API 요청/응답 타입
export interface ProductCreateRequest {
  data: ProductFormData[];
  metadata: {
    request_id: string;
  };
}

export interface ProductUpdateRequest {
  data: ProductFormData[];
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

// 상품 목록 응답 타입('/product-registration')
export interface ProductListResponse {
  item_count: number;
  product_registration_dto_list: ProductItem[];
}

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
    success_data: ProductItem[];
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
  productData: ProductItem[];
  isLoading: boolean;
  error: unknown;
  refreshProducts: () => void;
  gridRef: any;
  columnDefs: ColDef<ProductItem>[];
  defaultColDef: ColDef<ProductItem>;
  gridOptions: any;
  gridApi: GridApi | null;
  setGridApi: (api: GridApi | null) => void;
  selectedRows: any[];
  setSelectedRows: (rows: any[]) => void;
  changedRows: any[];
  setChangedRows: (rows: any[]) => void;
  clearSelections: () => void;
}