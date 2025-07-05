import { SidebarMenuButton, SubMenuItem } from "@/components/mainpage/sidebar/SidebarMenuButton";
import { useAuthContext } from "@/contexts";
import { Icon } from "@/components/ui/Icon";
import type { IMenuItemType } from "@/shared/types/sidebar.types";
import LogoLight from "@/shared/assets/icons/logo.svg"
import LogoDark from "@/shared/assets/icons/logo-dark.svg";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";
import { sidebarMenu } from "@/constant/sidebar";

export const MenuSidebarLayout = () => {
  const [MenuItems, setMenuItems] = useState<IMenuItemType[]>(sidebarMenu);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, logout } = useAuthContext();

  const name = user?.name?.split(' ')[0] ?? '김00 사원';
  const userProfile = {
    name: `${name} 님`,
    department: '온라인 사업 부서'
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSubmenu = (itemId: string) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  };

  const handleSubMenuClick = (subItem: string) => {
    switch (subItem) {
      case 'Wiki':
        window.location.href = 'https://wiki.lyckabc.xyz'
        break;
      case 'Mattermost':
        window.location.href = 'https://chat.lyckabc.xyz'
        break;
      case 'Minio':
        window.location.href = 'https://minio.lyckabc.xyz'
        break;
      case 'n8n':
        window.location.href = 'https://rpa.lyckabc.xyz'
        break;
      case '상품 등록':
        navigate(ROUTERS.PRODUCT_MANAGAMENT)
        break;
      case '주문 등록':
        navigate(ROUTERS.ORDER_MANAGEMENT)
        break;
    }
  }

  return (
    <div className="flex flex-col sidebar-left-width bg-page-sidebar-bg h-full border-r">
      <div className="flex justify-center mt-4 cursor-pointer" onClick={() => navigate('/')}>
        {theme == 'dark' ? (
          <img src={LogoLight} alt="로고" className="w-24 h-12" />
        ) : (
          <img src={LogoDark} alt="다크로고" className="w-24 h-12" />
        )}
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