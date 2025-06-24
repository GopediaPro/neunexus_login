import { ContentLayout } from "@/components/main/Layout/ContentLayout";
import { HeaderLayout } from "@/components/main/Layout/HeaderLayout";
import { LeftSidebarLayout } from "@/components/main/Layout/LeftSidebarLayout";
import { RightSidebarLayout } from "@/components/main/Layout/RightSidebarLayout";
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
            <RightSidebarLayout />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;