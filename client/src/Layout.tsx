import type { ReactNode } from "react";
import { SidebarProvider } from "@/contexts/SidebarContext";
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div>
        {children}
      </div>
    </SidebarProvider>
  )
};

export default Layout;