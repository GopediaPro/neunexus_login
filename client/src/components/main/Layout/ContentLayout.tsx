import { MenuGridLayout } from "@/components/main/Layout/MenuLayout";

export const ContentLayout = () => {
  return (
    <main className="flex-1 p-6">
      {/* 버튼들과 자동화 현황판 */}
      <div className="flex justify-between">
        <MenuGridLayout />
        <div className="min-w-[305px] h-[200px] bg-page-blue-200"></div>
      </div>
      {/* 현재 현황 바 */}
      <div>

      </div>
      {/* 현황 대쉬보드 자리 */}
      <div>

      </div>
    </main>
  );
};