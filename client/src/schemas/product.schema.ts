import z from "zod";

export const productRegistrationSchema = z.object({
  product_nm: z.string().min(1, '상품명을 입력해주세요'),
  goods_nm: z.string().min(1, '제품명을 입력해주세요'),
  detail_path_img: z.string().min(1, '상세 이미지 경로를 입력해주세요'),
  delv_cost: z.number({
    required_error: '배송비를 입력해주세요',
    invalid_type_error: '배송비는 숫자여야 합니다',
  }),
  goods_search: z.string().min(1, '검색어를 입력해주세요'),
  goods_price: z.number({
    required_error: '판매가격을 입력해주세요',
    invalid_type_error: '판매가격은 숫자여야 합니다',
  }).min(0, '판매가격은 0원 이상이어야 합니다'),
  certno: z.string().min(1, '인증번호를 입력해주세요'),
  char_1_nm: z.string().min(1, '옵션1 이름을 입력해주세요'),
  char_1_val: z.string().min(1, '옵션1 값을 입력해주세요'),
  img_path: z.string().min(1, '대표 이미지 경로를 입력해주세요'),
  stock_use_yn: z.string().min(1, '재고 여부를 선택해주세요'),
  class_nm1: z.string().min(1, '대분류를 입력해주세요'),
  char_process: z.string().optional().nullable(),
  char_2_nm: z.string().optional().nullable(),
  char_2_val: z.string().optional().nullable(),
  img_path1: z.string().optional().nullable(),
  img_path2: z.string().optional().nullable(),
  img_path3: z.string().optional().nullable(),
  img_path4: z.string().optional().nullable(),
  img_path5: z.string().optional().nullable(),
  goods_remarks: z.string().optional().nullable(),
  mobile_bn: z.string().optional().nullable(),
  one_plus_one_bn: z.string().optional().nullable(),
  goods_remarks_url: z.string().optional().nullable(),
  delv_one_plus_one: z.string().optional().nullable(),
  delv_one_plus_one_detail: z.string().optional().nullable(),
  class_nm2: z.string().optional().nullable(),
  class_nm3: z.string().optional().nullable(),
  class_nm4: z.string().optional().nullable(),
})

// 상품 수정 스키마 - 부분 업데이트 허용
export const productUpdateSchema = z.object({
  id: z.union([z.number(), z.string()]),
  product_nm: z.string().optional().nullable(),
  goods_nm: z.string().optional().nullable(),
  detail_path_img: z.string().optional().nullable(),
  goods_search: z.string().optional().nullable(),
  stock_use_yn: z.string().optional().nullable(),
  certno: z.string().optional().nullable(),
  char_1_nm: z.string().optional().nullable(),
  char_1_val: z.string().optional().nullable(),
  img_path: z.string().optional().nullable(),
  class_nm1: z.string().optional().nullable(),
  delv_cost: z.number().optional().nullable(),
  goods_price: z.number().optional().nullable(),
  // 나머지 선택 필드들
  char_process: z.string().optional().nullable(),
  char_2_nm: z.string().optional().nullable(),
  char_2_val: z.string().optional().nullable(),
  img_path1: z.string().optional().nullable(),
  img_path2: z.string().optional().nullable(),
  img_path3: z.string().optional().nullable(),
  img_path4: z.string().optional().nullable(),
  img_path5: z.string().optional().nullable(),
  goods_remarks: z.string().optional().nullable(),
  mobile_bn: z.string().optional().nullable(),
  one_plus_one_bn: z.string().optional().nullable(),
  goods_remarks_url: z.string().optional().nullable(),
  delv_one_plus_one: z.string().optional().nullable(),
  delv_one_plus_one_detail: z.string().optional().nullable(),
  class_nm2: z.string().optional().nullable(),
  class_nm3: z.string().optional().nullable(),
  class_nm4: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const validateProducts = (products: unknown[]) => {
  const errors: string[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i] as any;

    // 데이터 전처리: null이나 undefined를 빈 문자열로 변환
    const processedProduct = {
      ...product,
      product_nm: product.product_nm || '',
      goods_nm: product.goods_nm || '',
      detail_path_img: product.detail_path_img || '',
      goods_search: product.goods_search || '',
      stock_use_yn: product.stock_use_yn || 'N',
      certno: product.certno || '',
      char_1_nm: product.char_1_nm || '',
      char_1_val: product.char_1_val || '',
      img_path: product.img_path || '',
      class_nm1: product.class_nm1 || '',
      goods_price: typeof product.goods_price === 'string' ? parseFloat(product.goods_price) || 0 : (product.goods_price ?? 0),
      delv_cost: typeof product.delv_cost === 'string' ? parseFloat(product.delv_cost) || 0 : (product.delv_cost ?? 0),
    };

    // id가 있으면 수정, 없으면 등록
    const hasId = product.id !== undefined && product.id !== null && !String(product.id).startsWith('new_');
    
    const schema = hasId ? productUpdateSchema : productRegistrationSchema;
    
    const result = schema.safeParse(processedProduct);
    
    if (!result.success) {
      const rowInfo = product.product_nm || product.goods_nm || `행 ${i + 1}`;
      const firstError = result.error.errors[0];
      errors.push(`[${rowInfo}] ${firstError.message}`);
    }
  }
  
  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join('\n')
    };
  }

  return { success: true };
}