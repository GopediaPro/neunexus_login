import { MenuGridLayout } from "@/components/main/ui/MenuLayout";
import { StatsDashboard } from "@/components/main/ui/StatsDashboard";

export const ContentLayout = () => {
  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col gap-10">
        {/* 버튼들과 자동화 현황판 */}
        <div className="flex justify-between">
          <MenuGridLayout />
          <div className="min-w-[305px] h-[200px] bg-page-blue-200"></div>
        </div>
        {/* 현재 현황 바 */}
        <div>
          <StatsDashboard />
        </div>
        {/* 현황 대쉬보드 자리 */}
        <div>

        </div>
      </div>
    </main>
  );
};