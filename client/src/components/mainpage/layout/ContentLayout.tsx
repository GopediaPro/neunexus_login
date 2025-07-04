import { Dashboard } from '@/components/mainpage/dashboard/Dashboard';
import { MenuGridLayout } from '@/components/mainpage/sidebar/MenuLayout';
import { StatsDashboard } from '@/components/mainpage/dashboard/StatsDashboard';
import { AutomationStatus } from '@/components/mainpage/dashboard/Automation';

export const ContentLayout = () => {
  return (
    <main className="flex-1 p-5">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between gap-5">
          <MenuGridLayout />
          <div className="min-w-[305px] h-[200px]">
            <AutomationStatus />
          </div>
        </div>
        <StatsDashboard />
        <Dashboard />
      </div>
    </main>
  );
};
