import { useSidebar } from "@/contexts/SidebarContext";
import { Icon } from "../ui/Icon";

export const HeaderManagement = ({ title }: { title: string }) => {
  const { toggle } = useSidebar();

  return (
    <div className="flex items-center gap-4 h-[4.5rem] pl-4 bg-page-blue-400 text-white border-b rounded-b-xl">
      <button onClick={toggle}>
        <Icon name="hamberger" ariaLabel="검색" style="w-9 h-9 text-gray-400" />
      </button>
      <span>
        {title}
      </span>
    </div>
  );
};
