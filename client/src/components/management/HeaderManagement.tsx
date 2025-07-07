import { useSidebar } from "@/contexts/SidebarContext";
import { Icon } from "../ui/Icon";

export const HeaderManagement = ({ title }: { title: string }) => {
  const { toggle } = useSidebar();

  return (
    <div className="bg-page-card-bg">
      <div className="flex items-center gap-4 h-[4.5rem] pl-4 bg-page-blue-400 text-white">
        <button onClick={toggle}>
          <Icon name="hamberger" ariaLabel="검색" style="w-7 h-7 text-gray-300" />
        </button>
        <span className="text-h1">
          {title}
        </span>
      </div>
    </div>
  );
};
