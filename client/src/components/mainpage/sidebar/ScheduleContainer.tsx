import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { schedules } from "@/mocks/dummy/sidebar";
import { useNavigate } from "react-router-dom";

export const ScheduleContainer = () => {
  const navigate = useNavigate();

  return (
    <StatusCard
      title="일정"
      onViewAll={() => navigate('/')}
      viewAllText="추가"
    >
      <div className="flex items-center space-x-2 text-sm mb-4">
        <span className="w-8 h-8 bg-page-blue-400 text-white rounded flex items-center justify-center text-lg font-bold">
          6
        </span>
        <span className="text-page-font-primary font-medium">월</span>
        <div className="flex space-x-1 text-xs text-page-font-tertiary">
          {[8, 9, 10, 11, 12].map((num, index) => (
            <span 
              key={num}
              className={index === 0 ? "text-page-font-primary font-medium" : ""}
            >
              {num}
            </span>
          ))}
        </div>
        <button className="text-xs text-page-font-tertiary hover:text-page-font-secondary">
          &gt;
        </button>
      </div>

      <div className="space-y-3">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="flex items-start space-x-3">
            <div className="w-1 h-4 bg-page-blue-400 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="text-sm text-page-font-primary">{schedule.title}</div>
              <div className="text-xs text-page-font-tertiary">{schedule.time}</div>
            </div>
          </div>
        ))}
      </div>
    </StatusCard>
  );
};