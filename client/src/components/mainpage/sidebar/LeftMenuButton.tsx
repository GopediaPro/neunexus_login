import { Icon } from "@/components/ui/Icon";
import type { ILeftMenuButtonProps, ISubMenuItemProps } from "@/shared/types/sidebar.types";
import { useState } from "react";

const textToIconMap: Record<string, string> = {
  '상품관리': 'product',
  '주문관리': 'order', 
  '서비스': 'service',
};

export const LeftMenuButton = ({
  text,
  hasSubmenu = false,
  isActive = false,
  onClick,
  className = '',
}: ILeftMenuButtonProps) => {
  const icon = textToIconMap[text];

  return (
    <button
      className={`w-[90%] text-left p-3 mb-2 rounded-[10px] transition-all duration-200 text-lg
        flex items-center gap-2 mx-auto hover:bg-page-blue-200 ${isActive ? "bg-page-blue-200" : ""} ${className}`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`text-lg ${isActive ? "text-page-blue-400" : "text-page-font-muted"}`}>
            <Icon name={icon} ariaLabel={icon} style={`w-5 h-5 ${isActive? "text-page-blue-400" : "text-page-font-muted"}`} />
          </div>
        )}
        <span className={`${isActive ? "text-page-blue-400" : "text-page-font-primary"} font-medium`}>{text}</span>
      </div>
      {hasSubmenu && (
        <Icon name="arrow-right" ariaLabel="우측 화살표" 
          style={`w-4 h-4 ml-auto transition-all duration-300 ease-in-out transform
            ${isActive ? "text-page-blue-400 rotate-90" : "text-gray-300 rotate-0"}`}
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
      className={`flex justify-between w-[90%] px-5 py-2 rounded-[10px] text-left text-font-secondary text-sm hover:text-page-blue-400 hover:bg-page-blue-200 transition-colors duration-200 mx-auto ${className}`}
    >
      {text}
      {subText === '서비스' && (
        // <Icon
        <div></div>
      )}
    </button>
  );
}