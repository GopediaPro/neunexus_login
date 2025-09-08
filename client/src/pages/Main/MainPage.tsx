import { MainLayout } from "@/pages/Main/MainLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const MainPage = () => {

  return (
    <SidebarProvider>
      <MainLayout />
    </SidebarProvider>
  );
};