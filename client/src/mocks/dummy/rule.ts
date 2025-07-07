import type { SelectOption } from "@/components/management/common/SelectSearchInput";

export const ruleOptions: SelectOption[] = [
  { value: 'product_name', label: '상품명 (product name)' },
  { value: 'price', label: '가격 (price)' },
  { value: 'description', label: '설명 (description)' },
  { value: 'category', label: '카테고리 (category)' },
  { value: 'brand', label: '브랜드 (brand)' },
  { value: 'model', label: '모델 (model)' },
  { value: 'color', label: '색상 (color)' },
  { value: 'size', label: '사이즈 (size)' },
  { value: 'weight', label: '무게 (weight)' },
  { value: 'material', label: '재질 (material)' }
];

export const sectionOptions: SelectOption[] = [
  { value: 'master', label: '마스터' },
  { value: 'option', label: '옵션' },
  { value: 'variant', label: '변형' },
  { value: 'additional', label: '추가정보' },
  { value: 'custom', label: '사용자정의' }
];