import type { ReactNode } from "react";
import { SidebarProvider } from "@/contexts/SidebarContext";
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <main>
        {children}
      </main>
    </SidebarProvider>
  )
};

export default Layout;