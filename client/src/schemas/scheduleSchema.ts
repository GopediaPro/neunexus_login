import { z } from 'zod';

export const scheduleSchema = z.object({
  title: z.string().min(1, '일정 이름을 입력해주세요.'),
  startTime: z.string().min(1, '시작 시간을 선택해주세요.'),
  endTime: z.string().min(1, '종료 시간을 선택해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  memo: z.string().optional(),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}:00`);
  const end = new Date(`1970-01-01T${data.endTime}:00`);
  return start < end;
}, {
  message: '시작 시간은 종료 시간보다 빨라야 합니다.',
  path: ['endTime'],
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;