import { MainLayout } from "@/components/mainpage/layout/MainLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const MainPage = () => {

  return (
    <SidebarProvider>
      <MainLayout />
    </SidebarProvider>
  );
};