import { ScheduleContainer } from "@/components/mainpage/sidebar/ScheduleContainer";
import { NotificationContainer } from "../sidebar/NotificationContainer";
import { OrganizationContainer } from "../sidebar/OrganizationContainer";

export const InfoSidebarLayout = () => {
  return (
    <div className={`sidebar-right-width min-h-[930px] bg-page-sidebar-bg p-1 shadow-xl border rounded-[10px] space-y-6`}>
      <NotificationContainer />
      <ScheduleContainer />
      <OrganizationContainer />
    </div>
  );
};