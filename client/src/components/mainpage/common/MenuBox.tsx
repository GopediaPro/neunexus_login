import { adaptiveLineBreak } from "@/utils/menubox";
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
  const formattedLabel = label ? adaptiveLineBreak(label) : '';

  return (
    <>
      <div className={`flex flex-col items-center group ${className}`}>
        <button
          onClick={onClick}
          className={`
            relative flex justify-center items-center w-[4.65rem] h-[4.65rem]
            border border-stroke-base-100 rounded-xl bg-fill-base-100
          `}
        >
          <div className="w-9 h-9 flex items-center justify-center mb-1 text-text-base-300 group-hover:text-text-base-500">
            {icon}
          </div>
        </button>
        {label && (
          <span
            className="
              mt-1 text-h6 text-center leading-tight text-text-base-500
              break-all w-[4.65rem] min-h-[1.5em]
            "
          >
            {formattedLabel}
          </span>
        )}
      </div>
    </>
  )
}