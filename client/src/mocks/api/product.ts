import { http, HttpResponse } from 'msw'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const buildProductHandlers = (prefix: string) => [
  // GET /api/v1/product - 상품 목록 조회
  http.get(`${prefix}/api/v1/product`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const page = Number(url.searchParams.get('page') || '1')

    const products = [
      {
        id: 1,
        goods_nm: `테스트 상품 A ${search}`.trim(),
        brand_nm: '브랜드A',
        goods_price: 12900,
        goods_consumer_price: 15900,
        status: 1,
        maker: '메이커A',
        origin: 'KR',
        good_keyword: '키워드A,키워드B',
        char_1_nm: '색상',
        char_1_val: '블랙',
        char_2_nm: '사이즈',
        char_2_val: 'L',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        goods_nm: `테스트 상품 B ${search}`.trim(),
        brand_nm: '브랜드B',
        goods_price: 25900,
        goods_consumer_price: 29900,
        status: 1,
        maker: '메이커B',
        origin: 'KR',
        good_keyword: '키워드C,키워드D',
        char_1_nm: '색상',
        char_1_val: '화이트',
        char_2_nm: '사이즈',
        char_2_val: 'M',
        created_at: new Date().toISOString(),
      },
    ]

    return HttpResponse.json({
      products,
      current_page: page,
      // 주의: 프론트 타입은 string을 기대
      page_size: '20',
    })
  }),
  // POST /api/v1/product-registration/complete-workflow - 상품 등록 엑셀 임포트
  http.post(`${prefix}/api/v1/product-registration/complete-workflow`, async ({ request }) => {
    // FormData(sheet_name, file) 이지만 실제 파싱 없이 성공 형태만 반환
    return HttpResponse.json({
      success: true,
      message: '파일 처리 완료',
      imported_count: 42,
      sheet_name: new URL(request.url).searchParams.get('sheet_name') || null,
      timestamp: new Date().toISOString(),
    })
  }),
]

export const productHandlers = [
  ...buildProductHandlers(''),
  ...(API_BASE ? buildProductHandlers(API_BASE) : []),
]


