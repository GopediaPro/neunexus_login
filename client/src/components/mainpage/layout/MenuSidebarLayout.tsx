import { SidebarMenuButton, SubMenuItem } from "@/components/mainpage/sidebar/SidebarMenuButton";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { useMenuSideabar } from "@/hooks";

export const MenuSidebarLayout = () => {
  const {
    MenuItems,
    userProfile,
    toggleSubmenu,
    handleSubMenuClick,
    handleLogout,
    handleLogoClick,
  } = useMenuSideabar();

  return (
    <div className="flex flex-col sidebar-left-width bg-page-sidebar-bg h-full border-r">
      <div className="flex justify-center mt-4 cursor-pointer" onClick={handleLogoClick}>
        <Logo className="w-24 h-12" />
      </div>
      <div className="p-6 border-b">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-3">
            <div className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-page-font-primary text-lg font-bold mb-1">
            {userProfile.name}
          </h3>
          <p className="text-page-font-tertiary text-xs">
            {userProfile.department}
          </p>
        </div>
      </div>

      <div className="flex-1 py-4">
        <nav className="flex flex-col">
          {MenuItems.map((item) => (
            <div key={item.id} className="mb-1">
              <SidebarMenuButton 
                text={item.label}
                hasSubmenu={item.hasSubmenu}
                isActive={item.isExpanded}
                onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : undefined}
              />
                {item.hasSubmenu && item.isExpanded && item.submenu && (
                  <div className="w-[90%] flex flex-col gap-2 bg-page-sidebar-menu-list-bg mx-auto">
                    {item.submenu.map((subItem, i) => (
                      <SubMenuItem 
                        key={i}
                        text={subItem}
                        parentText={item.label}
                        onClick={() => handleSubMenuClick(subItem)}
                      />
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 flex items-center justify-center gap-2 text-page-font-tertiary dark:text-page-font-primary border border-page-button-border rounded-[10px] hover:bg-page-sidebar-menu-bg-hover transition-colors duration-200"
        >
          <Icon name="exit" ariaLabel="나가기" style="w-3 h-3" />
          <span className="text-sm">로그아웃</span>
        </button>
      </div>
    </div>
  );
}