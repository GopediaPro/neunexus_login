import { SidebarMenuButton, SubMenuItem } from "@/components/mainpage/sidebar/SidebarMenuButton";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { useMenuSideabar } from "@/hooks";

export const MenuSidebarLayout = () => {
  const {
    MenuItems,
    userProfile,
    handleSubMenuClick,
    handleMenuHover,
    handleMenuLeave,
    handleLogout,
    handleLogoClick,
  } = useMenuSideabar();

  return (
    <div className="flex flex-col w-sidebar-left 2xl:w-sidebar-left-2xl bg-fill-base-100 h-full border-r border-stroke-base-100">
      <div className="flex justify-center mt-4 cursor-pointer" onClick={handleLogoClick}>
        <Logo className="w-24 h-12" />
      </div>
      <div className="p-6 border-b border-stroke-base-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-fill-alt-100 rounded-full flex items-center justify-center mb-3">
            <div className="w-8 h-8 text-text-base-400" />
          </div>
          <h3 className="text-text-base-500 text-h5 mb-1">
            {userProfile.name}
          </h3>
          <p className="text-text-base-300 text-caption">
            {userProfile.department}
          </p>
        </div>
      </div>

      <div className="flex-1 py-4">
        <nav className="flex flex-col">
          {MenuItems.map((item) => (
            <div
              key={item.id}
              className="mb-1"
              onMouseEnter={() => handleMenuHover(item.id)}
              onMouseLeave={() => handleMenuLeave(item.id)}
            >
              <SidebarMenuButton 
                text={item.label}
                hasSubmenu={item.hasSubmenu}
                isActive={item.isHovered}
              />
              {item.hasSubmenu && item.submenu && (
                <div 
                  className={`w-[90%] mx-auto transition-all duration-700 ease-in-out overflow-hidden ${
                    item.isHovered 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                  onMouseEnter={() => handleMenuHover(item.id)}
                  onMouseLeave={() => handleMenuLeave(item.id)}
                >
                  <div className={`flex flex-col gap-1 bg-fill-alt-100 rounded-b-[10px] pb-2 pt-1 transition-transform duration-700 ease-in-out ${
                    item.isHovered 
                      ? 'transform translate-y-0 scale-y-100' 
                      : 'transform -translate-y-2 scale-y-95'
                  }`}
                  style={{ transformOrigin: 'top' }}
                  >
                    {item.submenu.map((subItem, i) => (
                      <div
                        key={i}
                        className={`transition-all duration-700 ease-in-out ${
                          item.isHovered 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 -translate-x-4'
                        }`}
                        style={{ 
                          transitionDelay: item.isHovered ? `${i * 100}ms` : '0ms' 
                        }}
                      >
                        <SubMenuItem 
                          text={subItem}
                          parentText={item.label}
                          onClick={() => handleSubMenuClick(subItem)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 flex items-center justify-center gap-2 text-text-base-300 dark:text-text-base-500 border border-stroke-base-100 rounded-[10px] hover:bg-fill-alt-200 transition-colors duration-200"
        >
          <Icon name="exit" ariaLabel="나가기" style="w-3 h-3" />
          <span className="text-sm">로그아웃</span>
        </button>
      </div>
    </div>
  );
}