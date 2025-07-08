export const productDummyData = [
  {
    id: 1,
    goods_nm: '상품명1',
    brand_nm: '브랜드명',
    goods_price: 87274,
    goods_consumer_price: 87274,
    status: '판매중',
    maker: '제조사명',
    origin: '원산지명',
    good_keyword: '카테고리명',
    char_1_nm: '옵션1 선택',
    char_2_nm: '옵션2 선택',
    created_at: '2025.07.02'
  },
  {
    id: 2,
    goods_nm: '상품명2',
    brand_nm: '브랜드명',
    goods_price: 87274,
    goods_consumer_price: 87274,
    status: '품절',
    maker: '제조사명',
    origin: '원산지명',
    good_keyword: '카테고리명',
    char_1_nm: '옵션1 선택',
    char_2_nm: '옵션2 선택',
    created_at: '2025.07.02'
  },
  {
    id: 3,
    goods_nm: '상품명3',
    brand_nm: '브랜드명',
    goods_price: 87274,
    goods_consumer_price: 87274,
    status: '단종',
    maker: '제조사명',
    origin: '원산지명',
    good_keyword: '카테고리명',
    char_1_nm: '옵션1 선택',
    char_2_nm: '옵션2 선택',
    created_at: '2025.07.02'
  },
  // 더 많은 샘플 데이터들...
  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 4,
    goods_nm: `상품명${i + 4}`,
    brand_nm: '브랜드명',
    goods_price: 87274,
    goods_consumer_price: 87274,
    status: ['판매중', '품절', '단종'][i % 3],
    maker: '제조사명',
    origin: '원산지명',
    good_keyword: '카테고리명',
    char_1_nm: '옵션1 선택',
    char_2_nm: '옵션2 선택',
    created_at: '2025.07.02'
  }))
];
