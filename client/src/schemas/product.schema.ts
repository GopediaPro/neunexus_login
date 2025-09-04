import z from "zod";

export const productRegistratioinSchema = z.object({
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

  char_process: z.string().optional(),
  char_2_nm: z.string().optional(),
  char_2_val: z.string().optional(),
  img_path1: z.string().optional(),
  img_path2: z.string().optional(),
  img_path3: z.string().optional(),
  img_path4: z.string().optional(),
  img_path5: z.string().optional(),
  goods_remarks: z.string().optional(),
  mobile_bn: z.string().optional(),
  one_plus_one_bn: z.string().optional(),
  goods_remarks_url: z.string().optional(),
  delv_one_plus_one: z.string().optional(),
  delv_one_plus_one_detail: z.string().optional(),
  class_nm2: z.string().optional(),
  class_nm3: z.string().optional(),
  class_nm4: z.string().optional(),
})

export const validateProducts = (products: unknown[]) => {
  for (let i = 0; i < products.length; i++) {
    const result = productRegistratioinSchema.safeParse(products[i]);
    if (!result.success) {
      return {
        success: false,
        error: `${result.error.errors[0].message}`
      };
    }
  }
  
  return { success: true };
}