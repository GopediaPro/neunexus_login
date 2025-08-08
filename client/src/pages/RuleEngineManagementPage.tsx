import { RuleEngineLayout } from "@/components/management/layout/RuleEngineLayout";
import { SidebarProvider } from "@/components/mainpage/context/SidebarContext";

export const RuleEngineManagementPage = () => {
  return (
    <SidebarProvider>
      <RuleEngineLayout />
    </SidebarProvider>
  );
};