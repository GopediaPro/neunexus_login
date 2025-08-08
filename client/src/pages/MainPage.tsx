import { MainLayout } from "@/components/mainpage/layout/MainLayout";
import { SidebarProvider } from "@/components/mainpage/context/SidebarContext";

export const MainPage = () => {

  return (
    <SidebarProvider>
      <MainLayout />
    </SidebarProvider>
  );
};