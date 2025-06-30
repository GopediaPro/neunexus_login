import type { ReactNode } from "react"

interface MenuBoxProps {
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const MenuBox = ({ 
  icon, 
  label, 
  onClick, 
  className
}: MenuBoxProps) => {
  
  return (
    <>
      <button
        onClick={onClick}
        className={`
          relative flex justify-center items-center w-16 h-16
          bg-page-sidebar-bg border border-border-default  rounded-xl
          ${className}
        `}
      >
        <div className="w-6 h-6 flex items-center justify-center mb-1 text-page-font-muted">
          {icon}
        </div>
        <span className="absolute bottom-[-22px] text-xs text-center leading-tight text-page-font-primary">
          {label ? label : ""}
        </span>
      </button>
    </>
  )
}