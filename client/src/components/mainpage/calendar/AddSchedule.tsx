import { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import moment from 'moment';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { scheduleSchema, type ScheduleFormData } from '@/schemas/scheduleSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import type { CalendarEvent } from './ScheduleCalendar';
import { COLOR_OPTIONS } from '@/constant/calendar';
import { Textarea } from '@/components/ui/Textarea';

interface AddScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: CalendarEvent) => void;
  event?: CalendarEvent | null;
  onDelete?: (eventId: string) => void;
}

export const AddSchedule = ({ isOpen, onClose, event, onSave, onDelete }: AddScheduleProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      category: '#3b82f6',
      memo: ''
    }
  });

  const [startDate, setStartDate] = useState<Date | undefined | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const selectedCategory = watch('category');
  const isEditMode = event && event.id;

  useEffect(() => {
    if (isOpen && event) {
      reset({
        title: event.title || '',
        startTime: event.start ? moment(event.start).format('HH:mm') : '09:00',
        endTime: event.end ? moment(event.end).format('HH:mm') : '10:00',
        category: event.color || '#3b82f6',
        memo: event.desc || ''
      });
    } else if (isOpen) {
      reset({
        title: '',
        startTime: '09:00',
        endTime: '10:00',
        category: '#3b82f6',
        memo: ''
      });
    }
  }, [isOpen, event, reset]);

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      const eventDate = event?.start ? moment(event.start).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
      
      const eventData = {
        id: event?.id || Date.now().toString(),
        title: data.title.trim(),
        start: new Date(`${eventDate} ${data.startTime}`),
        end: new Date(`${eventDate} ${data.endTime}`),
        desc: data.memo,
        color: data.category
      };

      onSave(eventData);
      handleClose();
    } catch (error) {
      console.error('일정 저장 실패:', error);
    }
  };

  const handleDelete = () => {
    if (isEditMode && event?.id && onDelete) {
      if (confirm('정말로 이 일정을 삭제하시겠습니까?')) {
        onDelete(event.id);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getFormattedDate = () => {
    if (!event?.start) return '';
    
    const date = moment(event.start);
    const year = date.format('YYYY');
    const month = date.format('M');
    const day = date.format('D');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    const dayOfWeek = weekdays[date.day()];
    
    return `${year}년 ${month}월 ${day}일이 ${dayOfWeek}요일`;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <div className="bg-fill-base-100 rounded-2xl">
        <Modal.Header>
          <Modal.Title>일정 추가</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {event?.start && (
              <div className="p-3 bg-accent-blue-100 rounded-lg">
                <div className="text-h4 text-primary-500">
                  {getFormattedDate()}
                </div>
              </div>
            )}

            <FormField
              name="title"
              label="일정 이름"
              control={control}
              error={errors.title?.message}
              render={(field) => (
                <Input
                  id='title'
                  placeholder="일정 이름을 입력하세요..."
                  error={errors.title?.message}
                  className='bg-fill-base-100'
                  {...field}
                />
              )}
            />

            <div>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <FormField
                    name="startTime"
                    label="시작 시간"
                    control={control}
                    error={errors.startTime?.message}
                    render={(field) => (
                      <Input
                        id='startTime'
                        type='time'
                        error={errors.startTime?.message}
                        className='bg-fill-base-100'
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="text-text-base-400 mt-5">~</div>
                <div className="flex-1">
                  <FormField
                    name="endTime"
                    label="종료 시간"
                    control={control}
                    error={errors.endTime?.message}
                    render={(field) => (
                      <Input
                        id="endTime"
                        type="time"
                        error={errors.endTime?.message}
                        className='bg-fill-base-100'
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              name="category"
              label="카테고리"
              control={control}
              error={errors.category?.message}
              render={(field) => (
                <div className="flex justify-between">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => field.onChange(color.value)}
                      className={`flex items-center space-x-3 p-2 pr-4 rounded-[8px] border transition-all ${
                        selectedCategory === color.value
                          ? 'border-primary-500 bg-fill-base-100'
                          : 'border-stroke-base-100 hover:bg-fill-alt-100'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm text-text-base-500">{color.name}</span>
                    </button>
                  ))}
                </div>
              )}
            />

            <FormField
              name="memo"
              label="메모"
              control={control}
              error={errors.memo?.message}
              render={(field) => (
                <Textarea
                  placeholder="메모를 입력하세요..."
                  rows={3}
                  error={!!errors.memo}
                  helperText={errors.memo?.message}
                  className='bg-fill-base-100'
                  {...field}
                />
              )}
            />

            {(errors.title || errors.startTime || errors.endTime || errors.category) && (
              <div className="p-3 bg-fill-alt-100 rounded-lg">
                <div className="text-sm text-text-base-500">
                  입력 정보를 확인해주세요.
                </div>
              </div>
            )}
          </form>
        </Modal.Body>

        <Modal.Footer>
          {isEditMode && onDelete && (
              <Button
                type="button"
                variant="light"
                onClick={handleDelete}
                className="text-text-base-500 border-stroke-base-100 hover:bg-fill-alt-100"
              >
                삭제
              </Button>
            )}
          <Button
            type="submit"
            variant="default"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            className='rounded-[8px]'
          >
            {isEditMode ? '수정' : '저장'}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};