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

interface ScheduleCalendarProps {
  className?: string;
  events: CalendarEvent[];
  onEventsChange: (events: CalendarEvent[]) => void;
  onEventClick?: (event?: CalendarEvent) => void;
  onSlotClick?: (event?: CalendarEvent) => void;
}

const CustomEvent = ({ event }: { event: CalendarEvent }) => {
  const startTime = moment(event.start).format('HH:mm');
  
  return (
    <div key={event.id} className="flex items-start justify-between">
      <div className="flex items-start space-x-2 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-text-contrast-500 leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
            {event.title}
          </div>
        </div>
      </div>
      <div className="text-xs text-text-contrast-500 whitespace-nowrap flex-shrink-0">
        {startTime}
      </div>
    </div>
  );
};

export const ScheduleCalendar = ({ 
  className,
  onEventClick, 
  onSlotClick,
  events,
}: ScheduleCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const handleSelectEvent = (event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (onSlotClick) {
      onSlotClick({
        start, end,
        id: '',
        title: ''
      });
    }
  };

  const handleDate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

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

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-fill-base-100 rounded-lg">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
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