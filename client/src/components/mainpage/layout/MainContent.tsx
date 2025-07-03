import { LeftSidebarLayout } from "./LeftSidebarLayout";
import { HeaderLayout } from "./HeaderLayout";
import { ContentLayout } from "./ContentLayout";
import { RightSidebarLayout } from "./RightSidebarLayout";
import { useSidebar } from "@/contexts/SidebarContext";

export const MainContent = () => {

  const { isOpen } = useSidebar();

  return (
    <div className={`marker:min-h-screen bg-page-bg`}>
      {isOpen ? (
        <div className={`grid grid-sidebar-layout min-h-screen`}>
          <LeftSidebarLayout />
          <div className="flex flex-col">
            <HeaderLayout />
            <div className="flex flex-1">
              <ContentLayout />
              <div className="pt-5 pr-2">
                <RightSidebarLayout />
              </div>
            </div>
          </div>
        </div>
      ): (
        <div className="flex flex-col min-h-screen">
          <HeaderLayout />
          <div className="flex flex-1">
            <ContentLayout />
            <div className="pt-5 pr-2">
              <RightSidebarLayout />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
