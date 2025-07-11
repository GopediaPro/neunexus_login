import { useAuthContext } from "@/contexts";
import { Icon } from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";

export const HeaderLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { toggle } = useSidebar();

  const handleLogout = async () => {
      try {
        await logout();

        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <header className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={toggle}>
            <Icon name="hamberger" ariaLabel="검색" style="w-9 h-9 text-gray-300" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex justify-center items-center w-9 h-9 bg-page-blue-400 text-page-font-primary rounded-full">
            <Icon name="search" ariaLabel="검색" style="w-[18px] h-[18px] text-white" />
          </button>
          <button className="flex justify-center items-center w-9 h-9 bg-page-blue-400 text-page-font-primary rounded-full">
            <Icon name="message" ariaLabel="검색" style="w-[18px] h-[18px] text-white" />
          </button>
          <button className="flex justify-center items-center w-9 h-9 bg-page-blue-400 text-page-font-primary rounded-full">
            <Icon name="bell" ariaLabel="검색" style="w-[18px] h-[18px] text-white" />
          </button>
          <button 
            className="flex justify-center items-center w-9 h-9 bg-page-blue-400 text-page-font-primary rounded-full"
            onClick={handleLogout}
          >
            <Icon name="exit" ariaLabel="검색" style="w-[18px] h-[18px] text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};