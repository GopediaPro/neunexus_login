import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { ModalRoot } from "@/components/ui/Modal/Modal";
import { schedules } from "@/mocks/dummy/sidebar";
import { useState } from "react";

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

      <ModalRoot isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-page-font-primary">일정 관리</h2>
              <button
                onClick={handleCloseModal}
                className="text-page-font-tertiary hover:text-page-font-primary text-2xxl leading-none"
              >
                x
              </button>
            </div>

            <div className="text-page-font-secondary mb-4">

            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2>모달 테스트</h2>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-web-primary text-white rounded hover:bg-web-secondary"
            >
              확인
            </button>
          </div>
          </div>
      </ModalRoot>
    </>
  );
};