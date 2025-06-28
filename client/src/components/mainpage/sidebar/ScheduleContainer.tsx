import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { Modal } from "@/components/ui/Modal";
import { schedules } from "@/mocks/dummy/sidebar";
import { useState } from "react";
import { ScheduleCalendar } from "../common/calendar/ScheduleCalendar";

export const ScheduleContainer = () => {
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <StatusCard
        title="일정"
        onViewAll={handleOpenModal}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="bg-white rounded-2xl">
          <Modal.Header className="border-b p-4 px-6">
            <Modal.Title>일정 관리</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          
          <Modal.Body className="p-6">
            <ScheduleCalendar />
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};