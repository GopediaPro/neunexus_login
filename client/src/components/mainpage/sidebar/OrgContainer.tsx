import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { Icon } from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";

export const OrgContainer = () => {
  const navigate = useNavigate();

  return (
    <StatusCard 
      title="조직도"
      onViewAll={() => navigate('/')}
    >
      <div className="pt-2 pb-4 border-b border-border-default">
        <form className="relative">
          <input
            type="text"
            placeholder="검색"
            className="w-full pl-10 pr-3 py-2 text-sm bg-gray-100 border rounded-3xl text-page-font-tertiary placeholder-page-font-gray-300 focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon name="search" style="w-4 h-4 text-page-font-tertiary" />
          </div>
        </form>
      </div>
      <div className="space-y-3">
          
      </div>
    </StatusCard>
  );
};