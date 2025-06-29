import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { Modal } from "@/components/ui/Modal";
import { schedules } from "@/mocks/dummy/sidebar";
import { useState } from "react";
import { initialEvents, ScheduleCalendar, type CalendarEvent } from "../common/calendar/ScheduleCalendar";
import { AddSchedule } from "../common/calendar/AddSchedule";

export const ScheduleContainer = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleOpenScheduleModal = () => {
    setIsEventModalOpen(false);
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  const handleOpenEventModal = (eventOrSlot?: CalendarEvent | { start: Date; end: Date }) => {
    setIsScheduleModalOpen(false);
    
    if (eventOrSlot) {
      if ('id' in eventOrSlot) {
        setSelectedEvent(eventOrSlot);
      } else {
        const newSlot: CalendarEvent = {
          id: '',
          title: '',
          start: eventOrSlot.start,
          end: eventOrSlot.end,
          desc: '',
          color: '#3b82f6'
        };
        setSelectedEvent(newSlot);
      }
    } else {
      setSelectedEvent(null);
    }
    
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
    setIsScheduleModalOpen(true);
  };

  const handleSaveEvent = (eventData: CalendarEvent) => {
    const existingIndex = events.findIndex(e => e.id === eventData.id);
    
    if (existingIndex >= 0) {
      const updatedEvents = [...events];
      updatedEvents[existingIndex] = eventData;
      setEvents(updatedEvents);
    } else {
      const newEvent = {
        ...eventData,
        id: Date.now().toString()
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    handleCloseEventModal();
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    handleCloseEventModal();
  };

  const todayEvents = events.filter(event => {
    const today = new Date();
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === today.toDateString();
  });

  return (
    <>
      <StatusCard
        title="일정"
        onViewAll={handleOpenScheduleModal}
        viewAllText="일정관리"
      >
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex items-start space-x-3">
              <div className="w-1 h-7 bg-page-blue-300 rounded-full mt-1 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm text-page-font-primary">{schedule.title}</div>
                <div className="text-xs text-page-font-tertiary">{schedule.time}</div>
              </div>
            </div>
          ))}
          
          {todayEvents.map((event) => (
            <div key={`real-${event.id}`} className="flex items-start space-x-3">
              <div 
                className="w-1 h-7 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: event.color || '#3b82f6' }}
              ></div>
              <div className="flex-1">
                <div className="text-sm text-page-font-primary">{event.title}</div>
                <div className="text-xs text-page-font-tertiary">
                  {new Date(event.start).toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {schedules.length === 0 && todayEvents.length === 0 && (
            <div className="text-xs text-page-font-tertiary text-center py-4">
              오늘 일정이 없습니다
            </div>
          )}
        </div>
      </StatusCard>

      <Modal isOpen={isScheduleModalOpen} onClose={handleCloseScheduleModal} size="5xl">
        <div className="bg-white rounded-2xl">
          <Modal.Header className="border-b p-4 px-6">
            <Modal.Title>일정 관리</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          
          <Modal.Body className="p-6 pt-2">
            <ScheduleCalendar 
              events={events}
              onEventsChange={setEvents}
              onEventClick={handleOpenEventModal}
              onSlotClick={handleOpenEventModal}
            />
          </Modal.Body>
        </div>
      </Modal>
      <AddSchedule
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  );
};