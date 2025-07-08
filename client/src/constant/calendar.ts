export const CALENDAR_CONFIG = {
  DEFAULT_VIEW: 'month' as const,
  HEIGHT: 600,
  DEFAULT_COLOR: '#3b82f6',
  TIMEZONE: 'Asia/Seoul'
};

export const COLOR_OPTIONS = [
  { name: '회의', value: '#3b82f6', bg: 'bg-blue-500' },
  { name: '사내일정', value: '#ef4444', bg: 'bg-red-500' },
  { name: '업무', value: '#eab308', bg: 'bg-yellow-500' },
  { name: '운영/관리', value: '#22c55e', bg: 'bg-green-500' },
  { name: '이벤트', value: '#8b5cf6', bg: 'bg-purple-500' },
  { name: '기타', value: '#6b7280', bg: 'bg-gray-500' },
] as const;

export const CALENDAR_MESSAGES = {
  next: "다음",
  previous: "이전", 
  today: "오늘",
  month: "월",
  week: "주",
  day: "일",
  agenda: "일정",
  date: "날짜",
  time: "시간",
  event: "이벤트",
  noEventsInRange: "해당 기간에 일정이 없습니다.",
} as const;