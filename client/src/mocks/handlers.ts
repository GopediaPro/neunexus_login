import { http, HttpResponse } from 'msw'
 
export const handlers = [
  http.get('https://api.example.com/user', () => {
    return HttpResponse.json({
      id: 'aaa11',
      firstName: 'SukWon',
      lastName: 'Jang',
    })
  }),
  
  http.get('https://api.example.com/posts', () => {
    return HttpResponse.json([
      { id: 1, title: '첫 번째 게시글', content: '안녕하세요!' },
      { id: 2, title: '두 번째 게시글', content: 'MSW 테스트 중!' },
    ])
  }),
]
