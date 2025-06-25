import { StatusCard } from "@/components/mainpage/common/StatusCard";
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
            <svg className="w-4 h-4 text-page-font-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>
      </div>
      <div className="space-y-3">
          
      </div>
    </StatusCard>
  );
};