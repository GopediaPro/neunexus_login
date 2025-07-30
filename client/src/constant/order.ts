import type { SelectOption } from "@/components/management/common/SelectSearchInput";
import type { FormTemplate, OrderItem } from "@/shared/types";

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