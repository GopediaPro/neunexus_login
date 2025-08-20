import { http, HttpResponse } from 'msw'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

// 공통 OrderItem 생성 유틸
const makeOrderItem = (overrides: Partial<any> = {}) => ({
  id: overrides.id ?? Math.floor(Math.random() * 100000),
  process_dt: overrides.process_dt ?? new Date().toISOString(),
  form_name: overrides.form_name ?? 'gmarket_erp',
  seq: overrides.seq ?? 1,
  idx: overrides.idx ?? `IDX_${Date.now()}`,
  order_date: overrides.order_date ?? new Date().toISOString(),
  reg_date: overrides.reg_date ?? new Date().toISOString().slice(0, 10),
  ord_confirm_date: overrides.ord_confirm_date ?? new Date().toISOString().slice(0, 10),
  work_status: overrides.work_status ?? 'pending',
  rtn_dt: overrides.rtn_dt ?? '',
  chng_dt: overrides.chng_dt ?? '',
  delivery_confirm_date: overrides.delivery_confirm_date ?? '',
  cancel_dt: overrides.cancel_dt ?? '',
  hope_delv_date: overrides.hope_delv_date ?? '',
  inv_send_dm: overrides.inv_send_dm ?? '',
  order_id: overrides.order_id ?? `ORDER_${Math.random().toString(36).slice(2, 8)}`,
  mall_order_id: overrides.mall_order_id ?? '',
  product_id: overrides.product_id ?? `PROD_${Math.random().toString(36).slice(2, 8)}`,
  product_name: overrides.product_name ?? '테스트상품',
  mall_product_id: overrides.mall_product_id ?? '',
  item_name: overrides.item_name ?? '',
  sku_value: overrides.sku_value ?? '',
  sku_alias: overrides.sku_alias ?? '',
  sku_no: overrides.sku_no ?? '',
  barcode: overrides.barcode ?? '',
  model_name: overrides.model_name ?? '',
  erp_model_name: overrides.erp_model_name ?? '',
  location_nm: overrides.location_nm ?? '',
  sale_cnt: overrides.sale_cnt ?? 1,
  pay_cost: overrides.pay_cost ?? 10000,
  delv_cost: overrides.delv_cost ?? 3000,
  total_cost: overrides.total_cost ?? 13000,
  total_delv_cost: overrides.total_delv_cost ?? 3000,
  expected_payout: overrides.expected_payout ?? 8000,
  etc_cost: overrides.etc_cost ?? '',
  price_formula: overrides.price_formula ?? '',
  service_fee: overrides.service_fee ?? 1000,
  sum_p_ea: overrides.sum_p_ea ?? 1,
  sum_expected_payout: overrides.sum_expected_payout ?? 8000,
  sum_pay_cost: overrides.sum_pay_cost ?? 10000,
  sum_delv_cost: overrides.sum_delv_cost ?? 3000,
  sum_total_cost: overrides.sum_total_cost ?? 13000,
  receive_name: overrides.receive_name ?? '홍길동',
  receive_cel: overrides.receive_cel ?? '010-0000-0000',
  receive_tel: overrides.receive_tel ?? '02-000-0000',
  receive_addr: overrides.receive_addr ?? '서울 특별시 테스트 구 테스트로 1',
  receive_zipcode: overrides.receive_zipcode ?? '01234',
  delivery_payment_type: overrides.delivery_payment_type ?? '선불',
  delv_msg: overrides.delv_msg ?? '',
  delivery_id: overrides.delivery_id ?? '',
  delivery_class: overrides.delivery_class ?? '일반',
  invoice_no: overrides.invoice_no ?? '',
  fld_dsp: overrides.fld_dsp ?? '',
  order_etc_6: overrides.order_etc_6 ?? '',
  order_etc_7: overrides.order_etc_7 ?? '',
  etc_msg: overrides.etc_msg ?? '',
  free_gift: overrides.free_gift ?? '',
  created_at: overrides.created_at ?? new Date().toISOString(),
  updated_at: overrides.updated_at ?? new Date().toISOString(),
})

const buildOrderHandlers = (prefix: string) => [
  // GET /api/v1/down-form-orders (non-pagination list)
  http.get(`${prefix}/api/v1/down-form-orders`, ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') || '2000')
    const seedOrders = [
      makeOrderItem({ id: 999999, order_id: '2528519627', product_id: '122997', product_name: '차량용 선글라스 거치대 선바이저 클립', mall_product_id: 'E241301785' }),
      makeOrderItem({ id: 9999991, order_id: '2528557451', product_id: '122997', product_name: '차량용 선글라스 거치대 선바이저 클립', mall_product_id: 'E241301785' }),
      makeOrderItem({ id: 9999992, order_id: '2528556581', product_id: '122997', product_name: '차량용 선글라스 거치대 선바이저 클립', mall_product_id: 'E241301785' }),
    ]
    const dynamicCount = Math.max(0, Math.min(limit, 10) - seedOrders.length)
    const dynamicOrders = Array.from({ length: dynamicCount }).map(() => makeOrderItem())
    const merged = [...seedOrders, ...dynamicOrders]
    const items = merged.map((order) => ({
      item: order,
      content: order,
      status: 'success',
      message: 'ok',
    }))
    return HttpResponse.json({ items, total: 1000, page: 1, page_size: merged.length })
  }),

  // GET /api/v1/down-form-orders/pagination
  http.get(`${prefix}/api/v1/down-form-orders/pagination`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const page_size = Number(url.searchParams.get('page_size') || '100')
    // 고정 시드 3건 + 나머지는 랜덤 생성
    const seedOrders = [
      makeOrderItem({ id: 517820, order_id: '2528519627', product_id: '122997', product_name: '차량용 선글라스 거치대 선바이저 클립', mall_product_id: 'E241301785' }),
      makeOrderItem({ id: 517819, order_id: '2528557451', product_id: '122997', product_name: '차량용 선글라스 거치대 선바이저 클립', mall_product_id: 'E241301785' }),
      makeOrderItem({ id: 517818, order_id: '2528556581', product_id: '122997', product_name: '차량용 선글라스 거치대 선바이저 클립', mall_product_id: 'E241301785' }),
    ]
    const dynamicCount = Math.max(0, Math.min(page_size, 10) - seedOrders.length)
    const dynamicOrders = Array.from({ length: dynamicCount }).map(() => makeOrderItem())
    const merged = [...seedOrders, ...dynamicOrders]
    const items = merged.map((order) => ({
      item: order,
      content: order,
      status: 'success',
      message: 'ok',
    }))
    return HttpResponse.json({ total: 1000, page, page_size, items })
  }),

  // POST /api/v1/down-form-orders/pagination/date-range (미사용)
  http.post(`${prefix}/api/v1/down-form-orders/pagination/date-range`, async () => {
    return HttpResponse.json({ ok: true })
  }),

  // POST /api/v1/down-form-orders/bulk (대량 생성)
  http.post(`${prefix}/api/v1/down-form-orders/bulk`, async ({ request }) => {
    const body = await request.json().catch(() => ({})) as any
    const items = (body.items || []).map((it: any) => ({
      item: makeOrderItem(it),
      status: 'success',
      message: 'created',
      errors: [],
    }))
    return HttpResponse.json({
      items,
      summary: { total: items.length, success: items.length, failed: 0 },
    })
  }),

  // PUT /api/v1/down-form-orders/bulk (대량 수정)
  http.put(`${prefix}/api/v1/down-form-orders/bulk`, async ({ request }) => {
    const body = await request.json().catch(() => ({})) as any
    const count = Array.isArray(body.items) ? body.items.length : 0
    return HttpResponse.json({ success: true, message: 'updated', data: { updated: count }, errors: [] })
  }),

  // DELETE /api/v1/down-form-orders/bulk (대량 삭제)
  http.delete(`${prefix}/api/v1/down-form-orders/bulk`, async ({ request }) => {
    const body = await request.json().catch(() => ({})) as any
    const count = Array.isArray(body.ids) ? body.ids.length : 0
    return HttpResponse.json({ success: true, message: 'deleted', data: { deleted: count }, errors: [] })
  }),

  // DELETE /api/v1/down-form-orders/all
  http.delete(`${prefix}/api/v1/down-form-orders/all`, async () => {
    return HttpResponse.json({ success: true, message: 'all deleted', data: { deleted: 'all' }, errors: [] })
  }),

  // DELETE /api/v1/down-form-orders/duplicate
  http.delete(`${prefix}/api/v1/down-form-orders/duplicate`, async () => {
    return HttpResponse.json({ success: true, message: 'duplicate removed', data: {}, errors: [] })
  }),

  // POST /api/v1/down-form-orders/excel-to-minio
  http.post(`${prefix}/api/v1/down-form-orders/excel-to-minio`, async () => {
    return HttpResponse.json({ file_url: 'https://minio.local/bucket/file.xlsx', object_name: 'file.xlsx', template_code: 'gmarket_erp' })
  }),

  // POST /api/v1/down-form-orders/excel-to-db
  http.post(`${prefix}/api/v1/down-form-orders/excel-to-db`, async () => {
    return HttpResponse.json({ file_url: 'https://minio.local/bucket/file.xlsx', object_name: 'file.xlsx', template_code: 'gmarket_erp' })
  }),

  // POST /api/v1/down-form-orders/bulk/filter (미사용)
  http.post(`${prefix}/api/v1/down-form-orders/bulk/filter`, async () => {
    return HttpResponse.json({ ok: true })
  }),

  // POST /api/v1/down-form-orders/bulk/without-filter (미사용)
  http.post(`${prefix}/api/v1/down-form-orders/bulk/without-filter`, async () => {
    return HttpResponse.json({ ok: true })
  }),
]

export const orderHandlers = [
  ...buildOrderHandlers(''),
  ...(API_BASE ? buildOrderHandlers(API_BASE) : []),
]


