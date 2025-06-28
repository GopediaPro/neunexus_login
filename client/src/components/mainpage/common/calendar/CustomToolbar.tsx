import moment from 'moment';
import { type ToolbarProps } from 'react-big-calendar';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  desc?: string;
  color?: string;
}

export const CustomToolbar = ({ date, onNavigate }: ToolbarProps<CalendarEvent, object>) => {
  const year = moment(date).format('YYYY');
  const month = moment(date).format('M');

  return (
    <div className="flex items-center mb-4">
      <span className="text-xl font-bold text-page-font-primary pr-2">
        {year}년
      </span>
      <span className='text-xl font-bold text-page-blue-400'>
        {month}월
      </span>
      <button
        onClick={() => onNavigate('PREV')}
        className="p-2 rounded"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#E0EEFF"/>
          <path d="M13.875 7.5L9.375 12L13.875 16.5" stroke="#1E6ECF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button
        onClick={() => onNavigate('NEXT')}
        className="p-2 rounded"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#E0EEFF"/>
          <path d="M10.5 16.5L15 12L10.5 7.5" stroke="#1E6ECF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};