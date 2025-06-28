// components/calendar/ScheduleCalendar.tsx
import { Calendar, momentLocalizer, type Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CustomToolbar } from './CustomToolbar';
import { useState } from 'react';

moment.locale('ko');
const localizer = momentLocalizer(moment);

export interface CalendarEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  desc?: string;
  color?: string;
}

export const events: CalendarEvent[] = [
  {
    id: '1',
    title: '팀 회의',
    start: new Date(2024, 5, 28, 10, 0),
    end: new Date(2024, 5, 28, 11, 0),
    desc: '주간 팀 미팅',
    color: '#3b82f6'

  },
  {
    id: '2',
    title: '프로젝트 리뷰',
    start: new Date(2024, 5, 29, 14, 0),
    end: new Date(2024, 5, 29, 16, 0),
    desc: '분기별 프로젝트 검토',
    color: '#ef4444',
  },
  {
    id: '3',
    title: '클라이언트 미팅',
    start: new Date(2024, 5, 30, 9, 0),
    end: new Date(2024, 5, 30, 10, 30),
    desc: '신규 프로젝트 논의',
    color: '#3b82f6'
  },
  {
    id: '4',
    title: '회식',
    start: new Date(2025, 5, 17, 19, 0),
    end: new Date(2025, 5, 17, 21, 0),
    desc: '팀 회식',
    color: '#22c55e'
  },
  {
    id: '5',
    title: '팀 회의',
    start: new Date(2025, 5, 26, 10, 0),
    end: new Date(2025, 5, 26, 11, 0),
    desc: '주간 팀 미팅',
    color: '#3b82f6'
  },
  {
    id: '6',
    title: '프로젝트 마감',
    start: new Date(2025, 5, 30, 15, 0),
    end: new Date(2025, 5, 30, 18, 0),
    desc: '프로젝트 최종 제출',
    color: '#8b5cf6'
  }
];

const CustomEvent = ({ event }: { event: CalendarEvent }) => {
  const startTime = moment(event.start).format('HH:mm');
  
  return (
    <div className="text-white text-xs font-medium">
      <div>{event.title}</div>
      <div className="opacity-90">{startTime}</div>
    </div>
  );
};

export const ScheduleCalendar = ({ className }: { className?: string }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // const handleSelectEvent = (event: CalendarEvent) => {
    
  // };

  // const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    
  // };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#3b82f6',
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        padding: '2px 4px',
        fontSize: '12px'
      }
    };
  };

  const handleDate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-lg">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          // onSelectEvent={handleSelectEvent}
          // onSelectSlot={handleSelectSlot}
          selectable
          popup
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          date={currentDate}
          onNavigate={handleDate}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar
          }}
          messages={{
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
            showMore: (total) => `+${total} 더보기`
          }}
        />
      </div>
    </div>
  );
};