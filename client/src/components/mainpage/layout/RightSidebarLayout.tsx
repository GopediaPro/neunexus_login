import { NotiContainer } from "@/components/mainpage/sidebar/NotiContainer";
import { OrgContainer } from "@/components/mainpage/sidebar/OrgContainer";
import { ScheduleContainer } from "@/components/mainpage/sidebar/ScheduleContainer";

export const RightSidebarLayout = () => {
  return (
    <div className={`sidebar-right-width min-h-[890px] bg-page-sidebar-bg p-1 shadow-xl border rounded-[10px] space-y-6`}>
      <NotiContainer />
      <ScheduleContainer />
      <OrgContainer />
    </div>
  );
};