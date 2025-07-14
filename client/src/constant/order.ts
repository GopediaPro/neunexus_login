import type { SelectOption } from "@/components/management/common/SelectSearchInput";

export const templateOptions: SelectOption[] = [
  { value: 'all', label: '전체' },
  { value: 'gmarket_erp', label: 'G마켓 ERP' },
  { value: 'gmarket_bundle', label: 'G마켓 Bundle' },
  { value: 'basic_erp', label: 'Basic ERP' },
  { value: 'basic_bundle', label: 'Basic Bundle' },
  { value: 'brand_erp', label: 'Brand ERP' },
  { value: 'star_gmarket_erp', label: 'Star G마켓 ERP' },
  { value: 'star_gmarket_bundle', label: 'Star G마켓 Bundle' },
  { value: 'star_basic_erp', label: 'Star Basic ERP' },
  { value: 'star_basic_bundle', label: 'Star Basic Bundle' },
  { value: 'star_brand_erp', label: 'Star Brand ERP' },
  { value: 'star_brand_bundle', label: 'Star Brand Bundle' }
];