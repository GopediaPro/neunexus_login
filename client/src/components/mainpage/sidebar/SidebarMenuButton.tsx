import { Icon } from "@/components/ui/Icon";
import type { ILeftMenuButtonProps, ISubMenuItemProps } from "@/shared/types/sidebar.types";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const textToIconMap: Record<string, string> = {
  '상품관리': 'product',
  '주문관리': 'order', 
  '서비스': 'service',
};

export const SidebarMenuButton = ({
  text,
  hasSubmenu = false,
  isActive = false,
  onClick,
  className = '',
}: ILeftMenuButtonProps) => {
  const icon = textToIconMap[text];

  return (
    <button
      className={`w-[90%] text-left p-3 rounded-[10px] transition-all duration-200 text-h4
        flex items-center gap-2 mx-auto hover:bg-page-sidebar-menu-bg-hover ${isActive && "bg-page-sidebar-menu-bg-hover"} ${className}`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`text-lg ${isActive ? "text-page-blue-400" : "text-page-font-muted"}`}>
            <Icon name={icon} ariaLabel={icon} style={`w-6 h-6 ${isActive? "text-page-blue-400" : "text-page-font-muted"}`} />
          </div>
        )}
        <span className={`${isActive ? "text-page-blue-400" : "text-page-font-primary"} font-medium`}>{text}</span>
      </div>
      {hasSubmenu && (
        <ChevronRight
          className={`w-6 h-6 ml-auto transition-all duration-300 ease-in-out transform
            ${isActive ? "text-page-blue-400 rotate-90" : "text-page-font-muted rotate-0"}`}
        />
      )}
    </button>
  );
};

export const SubMenuItem = ({
  text,
  parentText,
  onClick,
  className
}: ISubMenuItemProps) => {
  const [subText, _setSubText] = useState(parentText || "");
  
  return (
    <button
      onClick={onClick}
      className={`flex justify-between w-full px-5 py-2 text-left text-font-secondary text-h4 hover:text-page-blue-400 hover:bg-page-sidebar-menu-bg-hover transition-colors duration-200 mx-auto ${className}`}
    >
      {text}
      {subText === '서비스' && (
        <Icon name="redirect" ariaLabel="redirect" style="w-4 h-4" />
      )}
    </button>
  );
}