import type { ILeftMenuButtonProps, ISubMenuItemProps } from "@/types/sidebar.types";

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
      className={`w-[90%] text-left p-4 rounded-[10px] transition-all duration-200
        flex items-center justify-between mx-auto ${isActive ? "bg-web-secondary" : ""} ${className}`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`text-lg ${isActive ? "text-web-primary" : "text-gray-300"}`}>
            {icon}
          </div>
        )}
        <span className={`${isActive ? "text-web-primary" : "text-font-primary"} font-medium`}>{text}</span>
      </div>
      {hasSubmenu && (
        <svg 
          className={isActive ? "text-web-primary" : "text-gray-300" }
          width="10" 
          height="16" 
          viewBox="0 0 10 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg">
          <path d="M2 14L8 8L2 2" stroke="#777777" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      )}
    </button>
  );
};

export const SubMenuItem = ({
  text,
  onClick,
  className
}: ISubMenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-8 py-2 text-left text-font-secondary text-sm hover:bg-gray-200 dark:hover:bg-gray-300 transition-colors duration-200 ${className}`}
    >
      {text}
    </button>
  );
}