import { Dashboard } from '@/components/mainpage/dashboard/Dashboard';
import { StatsDashboard } from '@/components/mainpage/dashboard/StatsDashboard';
import { AutomationStatus } from '@/components/mainpage/dashboard/Automation';
import { MenuContainer } from '../sidebar/MenuContainer';

export const DashboardLayout = () => {
  return (
    <main className="flex-1 p-5">
      <div className="flex flex-col gap-8">
        <div className="flex gap-5">
          <MenuContainer />
          <AutomationStatus />
        </div>
        <StatsDashboard />
        <Dashboard />
      </div>
    </main>
  );
};
