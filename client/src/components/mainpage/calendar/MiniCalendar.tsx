import { useState, useMemo } from 'react';
import moment from 'moment';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent } from './ScheduleCalendar';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events: CalendarEvent[];
}

export const MiniCalendar = ({ selectedDate, onDateSelect, events }: MiniCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(moment(selectedDate));
  
  const weekDates = useMemo(() => {
    const centerDate = moment(selectedDate);
    return Array.from({ length: 5 }, (_, i) => 
      moment(centerDate).add(i - 2, 'days')
    );
  }, [selectedDate]);

  const getEventCount = (date: moment.Moment) => {
    return events.filter(event => 
      moment(event.start).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    ).length;
  };

  const handlePrevWeek = () => {
    const prevWeek = moment(selectedDate).subtract(1, 'day');
    onDateSelect(prevWeek.toDate());
    setCurrentMonth(moment(prevWeek));
  };

  const handleNextWeek = () => {
    const nextWeek = moment(selectedDate).add(1, 'day');
    onDateSelect(nextWeek.toDate());
    setCurrentMonth(moment(nextWeek));
  };

  const handleDateClick = (date: moment.Moment) => {
    onDateSelect(date.toDate());
  };

  const isToday = (date: moment.Moment) => {
    return date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
  };

  const isSelected = (date: moment.Moment) => {
    return date.format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD');
  };

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="items-center gap-1">
          <span className="text-h2 text-primary-500">
            {currentMonth.format('M')}
          </span>
          <span className="text-sm text-text-base-500">
            월
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 p-1 border border-stroke-base-100 rounded-full">
        <button
          onClick={handlePrevWeek}
          className="flex items-center justify-center w-7 h-7 hover:bg-fill-alt-100 rounded-full transition-colors text-text-base-400"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        
        {weekDates.map((date, index) => {
          const eventCount = getEventCount(date);
          const isCurrentDay = isToday(date);
          const isSelectedDay = isSelected(date);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                relative flex items-center justify-center text-text-base-400 w-8 h-7 rounded-full text-h6 transition-all
                ${isSelectedDay 
                  ? '!text-primary-600 !text-h5' 
                  : isCurrentDay
                    ? 'bg-fill-alt-100 !text-primary-500 !text-h6'
                    : '!text-text-base-400 !text-h6'
                }
              `}
            >
              {date.format('D')}
              
              {eventCount > 0 && (
                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full" />
              )}
            </button>
          );
        })}
        
        <button
          onClick={handleNextWeek}
          className="flex items-center justify-center w-7 h-7 hover:bg-fill-alt-100 rounded-full transition-colors text-text-base-400"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};