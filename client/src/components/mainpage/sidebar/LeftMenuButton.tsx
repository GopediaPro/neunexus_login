import type { ILeftMenuButtonProps, ISubMenuItemProps } from "@/shared/types/sidebar.types";
import { useState } from "react";

// const iconMap: Record<string, { name: string; aria: string }> = {
//   상품관리: { name: "product", aria: "상품관리" },
//   주문관리: { name: "order", aria: "주문관리" },
//   서비스: { name: "service", aria: "서비스" },
// };

export const LeftMenuButton = ({
  text,
  icon,
  hasSubmenu = false,
  isActive = false,
  onClick,
  className = '',
}: ILeftMenuButtonProps) => {

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
            {icon}
          </div>
        )}
        <span className={`${isActive ? "text-page-blue-400" : "text-page-font-primary"} font-medium`}>{text}</span>
      </div>
      {hasSubmenu && (
        <svg 
          className={`ml-auto transition-all duration-300 ease-in-out transform 
            ${isActive ? "text-page-blue-400 rotate-90" : "text-gray-300 rotate-0"}`}
          width="10" 
          height="16" 
          viewBox="0 0 10 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg">
          <path d="M2 14L8 8L2 2" stroke="#777777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.25 3.5C7.25 3.08577 6.91422 2.75 6.5 2.75H2C1.17155 2.75 0.5 3.42155 0.5 4.25V14C0.5 14.8284 1.17155 15.5 2 15.5H11.75C12.5784 15.5 13.25 14.8284 13.25 14V9.5C13.25 9.08578 12.9142 8.75 12.5 8.75C12.0858 8.75 11.75 9.08578 11.75 9.5V14H2V4.25H6.5C6.91422 4.25 7.25 3.91423 7.25 3.5Z" fill="#777777"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12.9393 2H10.2499C9.8357 2 9.49992 1.66422 9.49992 1.25C9.49992 0.835775 9.8357 0.5 10.2499 0.5H14.7499C15.1641 0.5 15.4999 0.835775 15.4999 1.25V5.75C15.4999 6.16423 15.1641 6.5 14.7499 6.5C14.3357 6.5 13.9999 6.16423 13.9999 5.75V3.06065L6.81057 10.25C6.5177 10.5429 6.0428 10.5429 5.74993 10.25C5.45705 9.95712 5.45705 9.48223 5.74993 9.18935L12.9393 2Z" fill="#777777"/>
        </svg>
      )}
    </button>
  );
}