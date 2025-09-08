import type { ProductTab } from "@/api/context/ProductContext";
import type { ColDef } from "ag-grid-community";

export interface ProductData {
  id: number;
  goods_nm: string;
  brand_nm: string;
  goods_price: number;
  goods_consumer_price: number;
  status: number;
  maker: string;
  origin: string;
  good_keyword: string;
  char_1_nm: string;
  char_1_val: string;
  char_2_nm: string;
  char_2_val: string;
  created_at: string;
}

export interface ProductListResponse {
  products: ProductData[];
  current_page: number;
  page_size: string;
}

export interface GetProductsParams {
  search: string;
  page: number;
}

export interface UseProductDataParams {
  search: string;
  page: number;
}

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
}