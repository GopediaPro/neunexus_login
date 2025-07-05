import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { csData } from "@/mocks/dummy/status";
import { useNavigate } from "react-router-dom";

export const CSStatus = () => {
  const navigate = useNavigate();
  const labels = ["신규접수", "답변저장", "답변송신", "강제송신"];

  return (
    <StatusCard
      title="C/S 현황"
      onViewAll={() => navigate('/')}
    >
      <div className="space-y-4 mt-2 pb-5">
        {csData.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between">
            <span className="text-page-font-primary text-body-l">{labels[index]}</span>
            <span className="text-page-blue-400 text-body-l">
              {item.value} 건
            </span>
          </div>
        ))}
      </div>
    </StatusCard>
  );
};