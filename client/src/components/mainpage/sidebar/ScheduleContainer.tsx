import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { Modal } from "@/components/ui/Modal";
import { schedules } from "@/mocks/dummy/sidebar";
import { useState } from "react";
import { ScheduleCalendar, type CalendarEvent } from "../common/calendar/ScheduleCalendar";
import { AddSchedule } from "../common/calendar/AddSchedule";

export const ScheduleContainer = () => {
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

  const handleOpenEventModal = (event?: CalendarEvent) => {
    setIsScheduleModalOpen(false);
    setSelectedEvent(event || null);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
    setIsScheduleModalOpen(true);
  };

  const handleSaveEvent = (eventData: CalendarEvent) => {
    console.log(eventData);
    handleCloseEventModal();
  };


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
      />
    </>
  );
};