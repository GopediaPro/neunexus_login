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
  onMouseEnter,
  onMouseLeave,
}: ILeftMenuButtonProps) => {
  const icon = textToIconMap[text];

  const getIconSize = (name: string) => {
    switch (name) {
      case 'product':
        return 'w-6 h-6';
      case 'order':
        return 'w-8 h-8 ml-[-5px]';
      case 'service':
        return 'w-7 h-7 ml-[-2px]';
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <button
      className={`w-[90%] text-left p-3 rounded-md transition-all duration-200 text-h4
        flex items-center gap-2 mx-auto hover:bg-fill-alt-200 ${isActive && "bg-fill-alt-200"} ${className}`}
      onClick={onClick}
      onMouseEnter={hasSubmenu ? onMouseEnter : undefined}
      onMouseLeave={hasSubmenu ? onMouseLeave : undefined}
      type="button"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`text-lg ${isActive ? "text-primary-500" : "text-text-base-200"}`}>
            <Icon name={icon} ariaLabel={icon} style={`${getIconSize(icon)} ${isActive? "text-primary-500" : "text-text-base-200"}`} />
          </div>
        )}
        <span className={`${isActive ? "text-primary-500" : "text-text-base-500"} font-medium`}>{text}</span>
      </div>
      {hasSubmenu && (
        <ChevronRight
          className={`w-6 h-6 ml-auto transition-all duration-300 ease-in-out transform
            ${isActive ? "text-primary-500 rotate-90" : "text-text-base-200 rotate-0"}`}
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
      className={`flex justify-between w-full px-5 py-2 text-left text-text-base-400 text-h4 hover:text-primary-500 hover:bg-fill-alt-200 transition-colors duration-200 mx-auto ${className}`}
    >
      {text}
      {subText === '서비스' && (
        <Icon name="redirect" ariaLabel="redirect" style="w-6 h-6" />
      )}
    </button>
  );
};