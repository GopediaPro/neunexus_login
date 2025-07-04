import { MainContent } from "@/components/mainpage/layout/MainContent";
import { SidebarProvider } from "@/contexts/SidebarContext";

const Main = () => {

  return (
    <SidebarProvider>
      <MainContent />
    </SidebarProvider>
  );
};

export default Main;