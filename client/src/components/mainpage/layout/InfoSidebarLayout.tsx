import { ScheduleContainer } from "@/components/mainpage/sidebar/ScheduleContainer";
import { NotificationContainer } from "../sidebar/NotificationContainer";
import { OrganizationContainer } from "../sidebar/OrganizationContainer";

export const InfoSidebarLayout = () => {
  return (
    <div className={`min-w-[288px] w-sidebar-right 2xl:w-sidebar-right-2xl h-full bg-fill-base-100 p-1 shadow-xl border border-stroke-base-100 rounded-md space-y-6`}>
      <NotificationContainer />
      <ScheduleContainer />
      <OrganizationContainer />
    </div>
  );
};