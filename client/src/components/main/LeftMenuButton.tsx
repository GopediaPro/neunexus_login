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
      className={`w-[90%] text-left p-4 mb-2 rounded-[10px] transition-all duration-200
        flex items-center justify-between mx-auto ${isActive ? "bg-page-blue-200" : ""} ${className}`}
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
          className={`transition-all duration-300 ease-in-out transform 
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
  onClick,
  className
}: ISubMenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-[90%] px-8 py-2 rounded-[10px] text-left text-font-secondary text-sm hover:bg-sky-blue-light transition-colors duration-200 mx-auto ${className}`}
    >
      {text}
    </button>
  );
}