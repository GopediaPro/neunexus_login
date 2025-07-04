export const productDummyData = [
  {
    productName: '상품명',
    brand: '브랜드명',
    sellPrice: 87274,
    costPrice: 87274,
    status: '판매중',
    manufacturer: '제조사명',
    creator: '원산지명',
    category: '카테고리명',
    option1: '옵션1 선택',
    option2: '옵션2 선택',
    createdDate: '2025.07.02'
  },
  {
    productName: '상품명',
    brand: '브랜드명',
    sellPrice: 87274,
    costPrice: 87274,
    status: '품절',
    manufacturer: '제조사명',
    creator: '원산지명',
    category: '카테고리명',
    option1: '옵션1 선택',
    option2: '옵션2 선택',
    createdDate: '2025.07.02'
  },
  {
    productName: '상품명',
    brand: '브랜드명',
    sellPrice: 87274,
    costPrice: 87274,
    status: '단종',
    manufacturer: '제조사명',
    creator: '원산지명',
    category: '카테고리명',
    option1: '옵션1 선택',
    option2: '옵션2 선택',
    createdDate: '2025.07.02'
  },
  // 더 많은 샘플 데이터들...
  ...Array.from({ length: 10 }, (_, i) => ({
    productName: '상품명',
    brand: '브랜드명',
    sellPrice: 87274,
    costPrice: 87274,
    status: ['판매중', '품절', '단종'][i % 3],
    manufacturer: '제조사명',
    creator: '원산지명',
    category: '카테고리명',
    option1: '옵션1 선택',
    option2: '옵션2 선택',
    createdDate: '2025.07.02'
  }))
];