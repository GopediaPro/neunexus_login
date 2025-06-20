import { ContentLayout } from "@/components/main/Layout/ContentLayout";
import { HeaderLayout } from "@/components/main/Layout/HeaderLayout";
import { LeftSidebarLayout } from "@/components/main/Layout/LeftSidebarLayout";
import { RightSidebarLayout } from "@/components/main/Layout/RightSidebarLayout";
import { LEFT_SIDEBAR_WIDTH } from "@/constant/layout";

const Main = () => {

  return (
    <div className="min-h-screen bg-background">
      <div className={`grid grid-cols-[${LEFT_SIDEBAR_WIDTH}_1fr] min-h-screen`}>
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