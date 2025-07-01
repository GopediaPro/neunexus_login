import { StatusCard } from '@/components/mainpage/common/StatusCard';
import { useNavigate } from 'react-router-dom';

export const AutomationStatus = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col border rounded-[10px] overflow-hidden">
      <div className="grid grid-cols">
        <div className="relative">
          <StatusCard title="자동화 현황" onViewAll={() => navigate('/')}>
            <div className="space-y-4 mt-2 pb-5">?</div>
          </StatusCard>
          <div className="absolute right-0 top-5 bottom-0 border-r-2 border-border-default" />
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-5 border-r-2 border-border-default" />
        </div>
      </div>
    </div>
  );
};
