import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { member } from "@/mocks/dummy/sidebar";
import { useNavigate } from "react-router-dom";

export const OrgContainer = () => {
  const navigate = useNavigate();

  return (
    <StatusCard 
      title="조직도"
      onViewAll={() => navigate('/')}
    >
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="검색"
          className="w-full px-3 py-2 text-sm bg-page-input-bg border border-page-input-border rounded-lg text-page-input-font placeholder-page-font-tertiary focus:outline-none focus:border-page-button-primary"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 text-page-font-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        {member.map((member) => (
          <div key={member.id} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm text-page-font-primary">{member.name}</div>
              <div className="text-xs text-page-font-tertiary">{member.department}</div>
            </div>
            <div className="w-6 h-6 bg-page-blue-400 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </StatusCard>
  );
};