import { LeftMenuButton, SubMenuItem } from "@/components/mainpage/sidebar/LeftMenuButton";
import { useAuthContext } from "@/contexts";
import { sidebarDummy } from "@/mocks/dummy/sidebar";
import type { IMenuItemType } from "@/share/types/sidebar.types";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LeftSidebarLayout = () => {
  const [MenuItems, setMenuItems] = useState<IMenuItemType[]>(sidebarDummy);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { logout } = useAuthContext(); 

  const userProfile = {
    name: '김00 사원',
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
    }
  }

  return (
    <div className="flex flex-col sidebar-left-width bg-page-sidebar-bg h-screen border-r">
      <div className="flex justify-center mt-4 cursor-pointer" onClick={() => navigate('/')}>
        {theme == 'dark' ? (
          <img
            src="/image/logo-dark.svg"
            alt="로고"
            className="w-24 h-12"
          />
        ) : (
          <img
            src="/image/logo.svg"
            alt="로고"
            className="w-24 h-12"
          />
        )}
      </div>
      <div className="p-6 border-b">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-3">
            <div className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-page-font-primary font-medium text-base mb-1">
            {userProfile.name}
          </h3>
          <p className="text-page-font-tertiary text-sm">
            {userProfile.department}
          </p>
        </div>
      </div>

      <div className="flex-1 py-4">
        <nav className="flex flex-col">
          {MenuItems.map((item) => (
            <div key={item.id} className="mb-1">
              <LeftMenuButton 
                text={item.label}
                hasSubmenu={item.hasSubmenu}
                isActive={item.isExpanded}
                onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : undefined}
              />
                {item.hasSubmenu && item.isExpanded && item.submenu && (
                  <div className="flex flex-col gap-2">
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm">로그아웃</span>
        </button>
      </div>
    </div>
  );
}