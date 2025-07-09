import { ScheduleContainer } from "@/components/mainpage/sidebar/ScheduleContainer";
import { NotificationContainer } from "../sidebar/NotificationContainer";
import { OrganizationContainer } from "../sidebar/OrganizationContainer";

export const InfoSidebarLayout = () => {
  return (
    <div className={`sidebar-right-width min-w-[293px] min-h-[930px] bg-fill-base-100 p-1 shadow-xl border border-stroke-base-100 rounded-[10px] space-y-6`}>
      <NotificationContainer />
      <ScheduleContainer />
      <OrganizationContainer />
    </div>
  );
};