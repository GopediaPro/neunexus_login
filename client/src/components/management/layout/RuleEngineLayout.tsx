import { MenuSidebarLayout } from "@/components/mainpage/layout/MenuSidebarLayout";
import { useSidebar } from "@/contexts/SidebarContext";
import { useEffect, useRef } from "react";
import { HeaderManagement } from "../HeaderManagement";
import { RuleEngineToolbar } from "../RuleEngineToolbar";
import { RuleEditContainer } from "../RuleEditContainer";

export const RuleEngineLayout = () => {
  const { isOpen, close } = useSidebar();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      close();
      isInitialMount.current = false;
    }
  }, [close]);

  return (
    <div className="min-h-screen bg-fill-base-100">
      {isOpen ? (
        <div className="grid grid-cols-[183px_1fr] min-h-screen">
          <MenuSidebarLayout />
          <div className="flex flex-col">
            <HeaderManagement title="룰 엔진 관리 시스템" />
            <RuleEngineToolbar />
            <div className="flex-1 p-4">
              <RuleEditContainer />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-fill-base-100">
          <HeaderManagement title="룰 엔진 관리 시스템" />
          <RuleEngineToolbar />
          <div className="flex-1 p-4 pl-6">
            <RuleEditContainer />
          </div>
        </div>
      )}
    </div>
  );
};