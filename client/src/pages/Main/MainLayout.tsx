import { HeaderLayout } from "../../components/mainpage/layout/HeaderLayout";
import { useSidebar } from "@/contexts/SidebarContext";
import { MenuSidebarLayout } from "../../components/mainpage/layout/MenuSidebarLayout";
import { DashboardLayout } from "../../components/mainpage/layout/DashboardLayout";
import { InfoSidebarLayout } from "../../components/mainpage/layout/InfoSidebarLayout";

export const MainLayout = () => {
  const { isOpen } = useSidebar();

  return (
    <main className="bg-fill-base-200">
      {isOpen ? (
        <section className="grid grid-cols-sidebar-layout 2xl:grid-cols-sidebar-layout-2xl min-h-screen">
          <nav>
            <MenuSidebarLayout />
          </nav>
          <section className="flex flex-col h-full">
            <header>
              <HeaderLayout />
            </header>
            <section className="flex flex-1 h-full">
              <main>
                <DashboardLayout />
              </main>
              <aside className="pt-5 pr-2 h-full">
                <InfoSidebarLayout />
              </aside>
            </section>
          </section>
        </section>
      ): (
        <section className="flex flex-col bg-fill-base-200">
          <header>
            <HeaderLayout />
          </header>
          <section className="flex flex-1">
            <main>
              <DashboardLayout />
            </main>
            <aside className="pt-5 pr-2">
              <InfoSidebarLayout />
            </aside>
          </section>
        </section>
      )}
    </main>
  );
};