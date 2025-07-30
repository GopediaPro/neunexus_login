import { Dashboard } from '@/components/mainpage/dashboard/Dashboard';
import { StatsDashboard } from '@/components/mainpage/dashboard/StatsDashboard';
import { MenuContainer } from '../dashboard/MenuContainer';
import { AutomationContainer } from '../dashboard/AutomationContainer';

export const DashboardLayout = () => {
  return (
    <main className="flex-1 p-5 min-w-[786px]">
      <div className="flex flex-col gap-[1.25rem]">
        <div className="flex gap-5">
          <MenuContainer />
          <AutomationContainer />
        </div>
        <StatsDashboard />
        <Dashboard />
      </div>
    </main>
  );
};
