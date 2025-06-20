import { LEFT_SIDEBAR_WIDTH } from "@/constant/layout";
import { sidebarDummy } from "@/mocks/dummy/sidebar";
import { keycloakLogout } from "@/services/keycloakLogout";
import type { ISidebarMenuItem } from "@/types/sidebar.types";
import { LogOut } from "lucide-react";
import { useState } from "react";

export const LeftSidebarLayout = () => {
  const [MenuItems, setMenuItems] = useState<ISidebarMenuItem[]>(sidebarDummy);

  const userProfile = {
    name: '김00 사원',
    department: '온라인 사업 부서'
  };

  const handleLogout = async () => {
    try {
      await keycloakLogout();
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
// ${LEFT_SIDEBAR_WIDTH}
  return (
    <div className={`w-[${LEFT_SIDEBAR_WIDTH}] h-screen bg-web-background border-r border-border-default flex flex-col`}>
      <div className="p-6 border-b border-border-subtle">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-3">
            {/* 임시 유저 프로필 */}
            <div className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-font-primary font-medium text-base mb-1">
            {userProfile.name}
          </h3>
          <p className="text-font-tertiary text-sm">
            {userProfile.department}
          </p>
        </div>
      </div>

      <div className="flex-1 py-4">
        <nav>
          {MenuItems.map((item) => (
            <div key={item.id} className="mb-1">
              <button
                onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : undefined}
                className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200"
              >
                <span className="text-font-primary font-medium">
                  {item.label}
                </span>
                {item.hasSubmenu && (
                  <img
                    src="/image/arrow_right.svg"
                    className={`w-4 h-4 text-font-tertiary transition-transform duration-200 ${
                      item.isExpanded ? 'rotate-90' : ''
                    }`} 
                  />
                )}
              </button>
              
              {item.hasSubmenu && item.isExpanded && item.submenu && (
                <div className="bg-gray-100 dark:bg-gray-200">
                  {item.submenu.map((subItem, index) => (
                    <button
                      key={index}
                      className="w-full px-8 py-2 text-left text-font-secondary text-sm hover:bg-gray-200 dark:hover:bg-gray-300 transition-colors duration-200"
                    >
                      {subItem}
                    </button>
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
          className="w-full px-4 py-2 flex items-center justify-center gap-2 text-font-tertiary border border-border-default rounded-md hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">로그아웃</span>
        </button>
      </div>
    </div>
  );
}