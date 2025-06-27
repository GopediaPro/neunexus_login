import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { schedules } from "@/mocks/dummy/sidebar";
import { useNavigate } from "react-router-dom";

export const ScheduleContainer = () => {
  const navigate = useNavigate();

  return (
    <StatusCard
      title="일정"
      onViewAll={() => navigate('/')}
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
  );
};