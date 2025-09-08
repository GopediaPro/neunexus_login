import { describe, it, expect } from 'vitest'
import axios from 'axios'

// axios는 테스트에서도 환경변수 baseURL 사용 가능
const client = axios.create({ baseURL: process.env.VITE_API_BASE_URL || '' })

// 목적: "주문 관리"에서 목록/페이지네이션/대량작업 API의 존재 이유와 계약(스키마)을 문서화한다.
describe('[주문관리] Order API 계약/목적 확인', () => {
  // 왜 존재? 초기/탭 전환 시 빠른 목록 프리뷰를 제공하기 위한 비페이지네이션 목록 API
  it('GET /api/v1/down-form-orders: 목록 응답은 items[].content 구조(그리드 바인딩 목적)', async () => {
    const res = await client.get('/api/v1/down-form-orders', { params: { limit: 5 } })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data.items)).toBe(true)
    expect(res.data.items.length).toBeGreaterThan(0)
    expect(res.data.items[0]).toHaveProperty('content')
    expect(res.data.items[0].content).toHaveProperty('order_id')
    // 응답 루트 키 계약
    expect(Object.keys(res.data).sort()).toEqual(['items','page','page_size','total'].sort())
  })

  // 왜 존재? 무한 스크롤/페이지 이동을 위한 페이지네이션 API. 일부 코드 호환을 위해 item/content 동시 제공
  it('GET /api/v1/down-form-orders/pagination: item+content 동시 제공(호환성), 메타(page/page_size/total)', async () => {
    const res = await client.get('/api/v1/down-form-orders/pagination', { params: { page: 1, page_size: 3 } })
    expect(res.status).toBe(200)
    expect(res.data.page).toBe(1)
    expect(res.data.page_size).toBe(3)
    expect(res.data.items[0]).toHaveProperty('item')
    expect(res.data.items[0]).toHaveProperty('content')
    expect(Object.keys(res.data).sort()).toEqual(['items','page','page_size','total'].sort())
  })

  // 왜 존재? 그리드에서 선택/편집한 행들을 일괄 생성하기 위한 대량 작업 API
  it('POST /api/v1/down-form-orders/bulk: 요약(summary)과 처리 결과(items) 제공(대량 생성 목적)', async () => {
    const res = await client.post('/api/v1/down-form-orders/bulk', {
      items: [
        { process_dt: new Date().toISOString(), form_name: 'gmarket_erp', idx: 'X1', work_status: 'pending', order_id: 'A1', product_id: 'P1', product_name: '테스트', sale_cnt: 1, pay_cost: 1000, delv_cost: 0, expected_payout: 900, service_fee: 100 },
      ],
    })
    expect(res.status).toBe(200)
    expect(res.data).toHaveProperty('items')
    expect(res.data).toHaveProperty('summary')
    expect(res.data.summary.success).toBe(1)
    // 계약: summary는 total/success/failed 키 포함
    expect(Object.keys(res.data.summary).sort()).toEqual(['failed','success','total'].sort())
  })
})


