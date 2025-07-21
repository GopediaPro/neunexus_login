import { useState, useMemo } from "react";
import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { Icon } from "@/components/ui/Icon";
import { member } from "@/mocks/dummy/sidebar";
import { useNavigate } from "react-router-dom";
import { ScrollTable } from "../common/ScrollTable";

export const OrganizationContainer = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredMembers = useMemo(() => {
    if (!searchKeyword.trim()) return member;
    return member.filter((m) =>
      m.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [member, searchKeyword]);

  return (
    <StatusCard 
      title="조직도"
      onViewAll={() => navigate('/')}
    >
      <div className="pt-2 pb-4 border-b border-stroke-base-100">
        <form className="relative">
          <input
            type="text"
            placeholder="검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm bg-fill-alt-100 rounded-3xl text-text-base-400 placeholder-text-base-300 focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon name="search" style="w-4 h-4 text-text-base-400" />
          </div>
        </form>
      </div>

      <div className="space-y-3 py-4">
        <ScrollTable height="h-40">
          {filteredMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-fill-alt-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 text-text-base-400" />
              </div>

              <div>
                <div className="text-text-base-500 text-body-l">{member.name}</div>
                <div className="text-body-s text-text-base-300">{member.department}</div>
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
