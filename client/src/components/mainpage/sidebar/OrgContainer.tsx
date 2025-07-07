import { useState, useMemo } from "react";
import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { Icon } from "@/components/ui/Icon";
import { member } from "@/mocks/dummy/sidebar";
import { useNavigate } from "react-router-dom";
import { ScrollTable } from "../common/ScrollTable";

export const OrgContainer = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  // 🔍 필터링된 멤버 목록 계산
  const filteredMembers = useMemo(() => {
    return member.filter((m) => m.name.includes(searchKeyword));
  }, [searchKeyword]);

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
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm bg-page-input-bar-scroll-bg border rounded-3xl text-page-font-tertiary placeholder-page-font-gray-300 focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon name="search" style="w-4 h-4 text-page-font-tertiary" />
          </div>
        </form>
      </div>

      <div className="space-y-3 py-4">
        <ScrollTable height="h-40">
          {filteredMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2 mb-2.5">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 text-gray-500" />
              </div>

              <div>
                <div className="text-page-font-primary">{member.name}</div>
                <div className="text-sm text-page-font-muted">{member.department}</div>
              </div>

              {/* 추후 메신저 이미지 */}
              <div></div>
            </div>
          ))}
        </ScrollTable>
      </div>
    </StatusCard>
  );
};
