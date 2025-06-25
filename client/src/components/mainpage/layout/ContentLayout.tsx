import { Dashboard } from "@/components/mainpage/dashboard/Dashboard";
import { MenuGridLayout } from "@/components/mainpage/sidebar/MenuLayout";
import { StatsDashboard } from "@/components/mainpage/dashboard/StatsDashboard";

export const ContentLayout = () => {
  return (
    <main className="flex-1 p-5">
      <div className="flex flex-col gap-8">

        <div className="flex justify-between">
          <MenuGridLayout />
          <div className="min-w-[305px] h-[200px] bg-page-blue-200"></div>
        </div>
        <StatsDashboard />
        <Dashboard />
      </div>
    </main>
  );
};