import { http, HttpResponse } from 'msw'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const buildMacroHandlers = (prefix: string) => [
  // POST /api/v1/macro/excel-run-macro
  http.post(`${prefix}/api/v1/macro/excel-run-macro`, async () => {
    return HttpResponse.json({ success: true, batch_id: 123, message: 'macro started' })
  }),

  // POST /api/v1/macro/excel-run-macro-bulk
  http.post(`${prefix}/api/v1/macro/excel-run-macro-bulk`, async () => {
    return HttpResponse.json({ success: true, batch_ids: [123, 124, 125], message: 'bulk macro started' })
  }),

  // GET /api/v1/macro/batch-info/all
  http.get(`${prefix}/api/v1/macro/batch-info/all`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const page_size = Number(url.searchParams.get('page_size') || '20')
    const items = [
      {
        data: [
          {
            batch_id: 1,
            original_filename: 'orders.xlsx',
            file_name: 'orders_1.xlsx',
            file_url: 'https://minio.local/bucket/orders_1.xlsx',
            file_size: 10240,
            date_from: '2025-06-01',
            date_to: '2025-06-02',
            order_status: '출고완료',
            error_message: null,
            created_by: 'tester',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        status: 'success',
        message: 'ok',
      },
    ]
    return HttpResponse.json({ total: 1, page, page_size, items })
  }),

  // GET /api/v1/macro/batch-info/latest
  http.get(`${prefix}/api/v1/macro/batch-info/latest`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const page_size = Number(url.searchParams.get('page_size') || '20')
    const items = [
      {
        data: [
          {
            batch_id: 99,
            original_filename: 'latest.xlsx',
            file_name: 'latest.xlsx',
            file_url: 'https://minio.local/bucket/latest.xlsx',
            file_size: 20480,
            date_from: '2025-06-05',
            date_to: '2025-06-06',
            order_status: '출고완료',
            error_message: null,
            created_by: 'tester',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        status: 'success',
        message: 'ok',
      },
    ]
    return HttpResponse.json({ total: 1, page, page_size, items })
  }),
]

export const macroHandlers = [
  ...buildMacroHandlers(''),
  ...(API_BASE ? buildMacroHandlers(API_BASE) : []),
]


