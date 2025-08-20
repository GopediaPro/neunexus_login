import { describe, it, expect } from 'vitest'
import axios from 'axios'

const client = axios.create({ baseURL: process.env.VITE_API_BASE_URL || '' })

// 목적: "상품관리" 화면에서 검색/페이징을 위한 API의 계약을 문서화한다.
describe('[상품관리] Product API 계약/목적 확인', () => {
  // 왜 존재? 검색어/페이지에 기반한 목록 데이터 공급
  it('GET /api/v1/product: ProductListResponse(목록/페이지 메타 제공)', async () => {
    const res = await client.get('/api/v1/product', { params: { search: '테스트', page: 1 } })
    expect(res.status).toBe(200)
    expect(res.data).toHaveProperty('products')
    expect(res.data).toHaveProperty('current_page')
    expect(res.data).toHaveProperty('page_size')
    expect(Array.isArray(res.data.products)).toBe(true)
  })

  // 왜 존재? 엑셀 업로드를 통한 상품 일괄 등록 워크플로우 트리거
  it('POST /api/v1/product-registration/complete-workflow: 업로드 처리 성공 플래그 제공', async () => {
    const res = await client.post('/api/v1/product-registration/complete-workflow?sheet_name=Sheet1')
    expect(res.status).toBe(200)
    expect(res.data.success).toBe(true)
  })
})


