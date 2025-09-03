import type { SelectOption } from "@/components/management/common/SelectSearchInput";
import type { FormTemplate, OrderItem } from "@/api/types";

export const templateOptions: SelectOption[] = [
  { value: 'all', label: '전체' },
  { value: 'gmarket_erp', label: 'G마켓 ERP' },
  { value: 'gmarket_bundle', label: 'G마켓 Bundle' },
  { value: 'basic_erp', label: 'Basic ERP' },
  { value: 'basic_bundle', label: 'Basic Bundle' },
  { value: 'brandi_erp', label: 'Brandi ERP' },
  { value: 'star_gmarket_erp', label: 'Star G마켓 ERP' },
  { value: 'star_gmarket_bundle', label: 'Star G마켓 Bundle' },
  { value: 'star_basic_erp', label: 'Star Basic ERP' },
  { value: 'star_basic_bundle', label: 'Star Basic Bundle' },
  { value: 'star_brand_erp', label: 'Star Brand ERP' },
  { value: 'star_brand_bundle', label: 'Star Brand Bundle' }
];

export const REQUIRED_FIELDS_BY_TEMPLATE: Record<FormTemplate, (keyof OrderItem)[]> = {
  gmarket_erp: ['form_name', 'idx', 'order_id', 'product_id', 'product_name'],
  coupang_erp: ['form_name', 'idx', 'order_id', 'product_id', 'product_name', 'receive_name'],
  auction_erp: ['form_name', 'idx', 'order_id', 'product_id', 'product_name'],
  interpark_erp: ['form_name', 'idx', 'order_id', 'product_id', 'product_name'],
  wemakeprice_erp: ['form_name', 'idx', 'order_id', 'product_id', 'product_name'],
  tmon_erp: ['form_name', 'idx', 'order_id', 'product_id', 'product_name'],
};

export const FORM_TYPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'basic_erp', label: 'Basic ERP' },
  { value: 'gmarket_erp', label: 'G마켓 ERP' },
  { value: 'brandi_erp', label: 'Brandi ERP' },
  { value: 'basic_bundle', label: 'Basic Bundle' },
  { value: 'gmarket_bundle', label: 'G마켓 Bundle' }
];

export const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'success', label: '성공' },
  { value: 'error', label: '실패' }
];

export const modalConfig = {
  minio: {
    title: '엑셀 업로드',
    submitText: '업로드',
    loadingText: '업로드 중...',
    successTitle: '업로드 완료',
    requiresDates: true
  },
  database: {
    title: 'DB에 저장',
    submitText: 'DB에 저장',
    loadingText: 'DB 저장 중...',
    successTitle: 'DB 저장 완료',
    requiresDates: false
  }
};

export const ORDER_DEFAULTS = {
  SALE_COUNT: 2,
  PAY_COST: 25000,
  DELIVERY_COST: 3000,
  TOTAL_COST: 28000,
  EXPECTED_PAYOUT: 22000,
  ETC_COST: "500",
  SERVICE_FEE: 1000,
  PRICE_FORMULA: "기본가격 + 배송비"
};

export const DATA_FILTER_TABS = [
  { id: "all" as const, label: "전체" },
  { id: "style" as const, label: "스타일" }, 
  { id: "collection" as const, label: "모든수집정보" }
];

export const OPTIMIZED_GRID_OPTIONS = {
  suppressRowVirtualisation: false,
  rowBuffer: 10,
  suppressColumnVirtualisation: false,
  
  suppressAnimationFrame: false,
  suppressParentsInRowNodes: true,
  suppressRowHoverHighlight: true,
  
  immutableData: true,
  getRowId: (params: any) => params.data.id?.toString(),
  
  asyncTransactionWaitMillis: 50,
  suppressChangeDetection: false,
};

export const companyOptions = [
  { id: 'okay', label: '오케이마트' },
  { id: 'star', label: '스타배송' }
];

export const fldDspOptions = [
  { value: 'GSSHOP', label: 'GSSHOP' },
  { value: 'YES24', label: 'YES24' },
  { value: '텐바이텐', label: '텐바이텐' },
  { value: '스마트스토어', label: '스마트스토어' },
  { value: '옥션2.0', label: '옥션2.0' },
  { value: 'G마켓2.0', label: 'G마켓2.0' },
  { value: '쿠팡', label: '쿠팡' },
  { value: '무신사', label: '무신사' },
  { value: '신세계', label: '신세계' },
  { value: 'NS홈쇼핑', label: 'NS홈쇼핑' },
  { value: 'CJ온스타일', label: 'CJ온스타일' },
  { value: '오늘의집', label: '오늘의집' },
  { value: '카카오톡스토어', label: '카카오톡스토어' },
  { value: 'CAFE24', label: 'CAFE24' },
  { value: '브랜디', label: '브랜디' },
  { value: '그립컴퍼니', label: '그립컴퍼니' },
  { value: '롯데온', label: '롯데온' },
  { value: '에이블리', label: '에이블리' },
  { value: '보리보리', label: '보리보리' },
  { value: '아트박스', label: '아트박스' },
  { value: '지그재그', label: '지그재그' },
  { value: '카카오톡선물하기', label: '카카오톡선물하기' },
  { value: '11번가', label: '11번가' },
  { value: '올웨이즈', label: '올웨이즈' },
  { value: '토스', label: '토스' },
  { value: '홈&쇼핑', label: '홈&쇼핑' },
  { value: '떠리몰', label: '떠리몰' }
];

export const statusOptions = [
  { id: 'shipped', label: '출고완료' },
  { id: 'preparing', label: '출고대기' },
];