import { StatusCard } from "@/components/mainpage/common/StatusCard"
import { notices } from "@/mocks/dummy/sidebar";
import { useNavigate } from "react-router-dom";

export const NotificationContainer = () => {
  const navigate = useNavigate();

  return (
    <StatusCard 
      title="공지사항"
      onViewAll={() => navigate('/')}
    >
      <div className="space-y-3 mt-6">
        {notices.map((notice) => (
          <div key={notice.id} className="flex items-start justify-between pb-[8px]">
            <div className="flex items-start space-x-2 flex-1 min-w-0">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-body-l text-text-base-500 leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                  {notice.title}
                </div>
              </div>
            </div>
            <div className="text-body-s text-text-base-300 whitespace-nowrap flex-shrink-0">
              {notice.date}
            </div>
          </div>
        ))}
      </div>
    </StatusCard>
  );
};