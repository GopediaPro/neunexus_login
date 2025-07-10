import { useSidebar } from "@/contexts/SidebarContext";
import { Icon } from "../ui/Icon";

export const HeaderManagement = ({ title }: { title: string }) => {
  const { toggle } = useSidebar();

  return (
    <div>
      <div className="flex items-center gap-4 h-[4.5rem] pl-4 bg-primary-500 text-text-contrast-500">
        <button onClick={toggle}>
          <Icon name="hamberger" ariaLabel="검색" style="w-7 h-7 text-text-contrast-500" />
        </button>
        <span className="text-h2">
          {title}
        </span>
      </div>
    </div>
  );
};
