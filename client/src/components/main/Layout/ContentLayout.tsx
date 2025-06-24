import { Dashboard } from "@/components/main/ui/Dashboard";
import { MenuGridLayout } from "@/components/main/ui/MenuLayout";
import { StatsDashboard } from "@/components/main/ui/StatsDashboard";

export const ContentLayout = () => {
  return (
    <main className="flex-1 p-6">
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