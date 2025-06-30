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
    const dates = [];
    for (let i = -2; i <= 2; i++) {
      dates.push(moment(centerDate).add(i, 'days'));
    }
    return dates;
  }, [selectedDate]);

  const getEventCount = (date: moment.Moment) => {
    return events.filter(event => 
      moment(event.start).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    ).length;
  };

  const handlePrevWeek = () => {
    const prevWeek = moment(selectedDate).subtract(1, 'week');
    onDateSelect(prevWeek.toDate());
    setCurrentMonth(moment(prevWeek));
  };

  const handleNextWeek = () => {
    const nextWeek = moment(selectedDate).add(1, 'week');
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
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-page-blue-400">
            {currentMonth.format('M')}
          </span>
          <span className="text-sm text-page-font-primary">
            월
          </span>
        </div>

        <div className="flex items-center gap-0.5 p-1 border border-border-default rounded-2xl">
          <button
            onClick={handlePrevWeek}
            className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400"
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
                  relative flex items-center justify-center text-gray-400 w-6 h-6 rounded-md text-xs font-bold transition-all
                  ${isSelectedDay 
                    ? 'text-page-font-primary' 
                    : isCurrentDay
                      ? 'bg-blue-100 text-blue-600'
                      : ''
                  }
                `}
              >
                {date.format('D')}
                
                {eventCount > 0 && (
                  <div className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2
                    w-0.5 h-0.5 rounded-full
                    ${isSelectedDay ? 'bg-white' : 'bg-purple-400'}
                  `} />
                )}
              </button>
            );
          })}
          
          <button
            onClick={handleNextWeek}
            className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};