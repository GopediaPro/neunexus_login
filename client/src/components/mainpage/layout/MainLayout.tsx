import { HeaderLayout } from "./HeaderLayout";
import { useSidebar } from "@/contexts/SidebarContext";
import { MenuSidebarLayout } from "./MenuSidebarLayout";
import { DashboardLayout } from "./DashboardLayout";
import { InfoSidebarLayout } from "./InfoSidebarLayout";

export const MainLayout = () => {
  const { isOpen } = useSidebar();

  return (
    <div className="marker:min-h-screen bg-fill-base-200">
      {isOpen ? (
        <div className="grid grid-cols-sidebar-layout 2xl:grid-cols-sidebar-layout-2xl min-h-screen">
          <MenuSidebarLayout />
          <div className="flex flex-col">
            <HeaderLayout />
            <div className="flex flex-1">
              <DashboardLayout />
              <div className="pt-5 pr-2">
                <InfoSidebarLayout />
              </div>
            </div>
          </div>
        </div>
      ): (
        <div className="flex flex-col min-h-screen bg-fill-base-200">
          <HeaderLayout />
          <div className="flex flex-1">
            <DashboardLayout />
            <div className="pt-5 pr-2">
              <InfoSidebarLayout />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
