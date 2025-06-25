import { ContentLayout } from "@/components/mainpage/layout/ContentLayout";
import { HeaderLayout } from "@/components/mainpage/layout/HeaderLayout";
import { LeftSidebarLayout } from "@/components/mainpage/layout/LeftSidebarLayout";
import { RightSidebarLayout } from "@/components/mainpage/layout/RightSidebarLayout";
import { useTheme } from "next-themes";

const Main = () => {
  const { theme } = useTheme();

  return (
    <div className={`page-main ${theme === 'dark' ? 'dark' : ""} marker:min-h-screen bg-page-bg`}>
      <div className={`grid grid-sidebar-layout min-h-screen`}>
        <LeftSidebarLayout />
        <div className="flex flex-col">
          <HeaderLayout />
          <div className="flex flex-1">
            <ContentLayout />
            <div className="pr-2">
              <RightSidebarLayout />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;