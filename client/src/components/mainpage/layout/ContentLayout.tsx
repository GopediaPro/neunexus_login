import { Dashboard } from "@/components/mainpage/dashboard/Dashboard";
import { MenuGridLayout } from "@/components/mainpage/sidebar/MenuLayout";
import { StatsDashboard } from "@/components/mainpage/dashboard/StatsDashboard";

export const ContentLayout = () => {
  return (
    <main className="flex-1 p-5">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-6">
          <div className="w-full 2xl:w-1/2">
            <MenuGridLayout />
          </div>
          <div className="w-full 2xl:w-1/2 p-6">
            <div className="w-full h-[200px] bg-page-blue-200 rounded-lg"></div>
          </div>
        </div>
        <StatsDashboard />
        <Dashboard />
      </div>
    </main>
  );
};