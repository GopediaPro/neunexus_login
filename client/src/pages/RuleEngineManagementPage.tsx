import { RuleEngineLayout } from "@/components/management/layout/RuleEngineLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const RuleEngineManagementPage = () => {
  return (
    <SidebarProvider>
      <RuleEngineLayout />
    </SidebarProvider>
  );
};