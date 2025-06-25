import { StatusCard } from "@/components/mainpage/common/StatusCard"
import { notices } from "@/mocks/dummy/sidebar";
import { useNavigate } from "react-router-dom";

export const NotiContainer = () => {
  const navigate = useNavigate();

  return (
    <StatusCard 
      title="공지사항"
      onViewAll={() => navigate('/')}
    >
      <div className="space-y-3">
        {notices.map((notice) => (
          <div key={notice.id} className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-page-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 pr-2">
                <div className="text-sm text-page-font-primary leading-tight">
                  {notice.title}
                </div>
              </div>
            </div>
            <div className="text-xs text-page-font-tertiary whitespace-nowrap">
              {notice.date}
            </div>
          </div>
        ))}
      </div>
    </StatusCard>
  );
};