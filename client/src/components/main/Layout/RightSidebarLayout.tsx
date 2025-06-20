import { RIGHT_SIDEBAR_WIDTH } from "@/constant/layout";

export const RightSidebarLayout = () => {
  return (
    <div className={`w-[${RIGHT_SIDEBAR_WIDTH}] p-6 space-y-6 bg-blue-500`}>
      {/* 일정 섹션 */}
      {/* <ScheduleSection /> */}
      
      {/* 조직도 섹션 */}
      {/* <OrganizationSection /> */}
    </div>
  );
};