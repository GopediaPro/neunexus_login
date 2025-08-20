import { describe, it, expect } from 'vitest'
import axios from 'axios'

const client = axios.create({ baseURL: process.env.VITE_API_BASE_URL || '' })

// 목적: 매크로 실행/배치 모니터링 API의 역할을 문서화한다.
describe('[매크로] Macro API 계약/목적 확인', () => {
  // 왜 존재? 파일 기반 작업을 서버에서 수행하도록 트리거 (응답에 작업 식별자 포함)
  it('POST /api/v1/macro/excel-run-macro: batch_id로 작업 추적', async () => {
    const res = await client.post('/api/v1/macro/excel-run-macro')
    expect(res.status).toBe(200)
    expect(res.data).toHaveProperty('batch_id')
  })

  // 왜 존재? 작업 이력/상태를 페이지네이션으로 확인
  it('GET /api/v1/macro/batch-info/all: items 배열과 페이지 메타 제공', async () => {
    const res = await client.get('/api/v1/macro/batch-info/all', { params: { page: 1, page_size: 1 } })
    expect(res.status).toBe(200)
    expect(res.data).toHaveProperty('items')
    expect(Array.isArray(res.data.items)).toBe(true)
  })
})


