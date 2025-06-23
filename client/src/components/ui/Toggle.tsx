import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

interface ToggleProps {
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(({
  defaultChecked = false,
  onCheckedChange,
  checked,
  disabled = false,
  size = 'md',
  className,
  ...props
  },
  ref
) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : isOn;

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    
    if (!isControlled) {
      setIsOn(newChecked);
    }
    
    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  };

  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14',
  };

  const thumbSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

  const translateClasses = {
    sm: isChecked ? 'translate-x-4' : 'translate-x-0.5',
    md: isChecked ? 'translate-x-5' : 'translate-x-0.5',
    lg: isChecked ? 'translate-x-7' : 'translate-x-0.5',
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-web-focus focus-visible:ring-offset-2 focus-visible:ring-offset-web-background',
        sizeClasses[size],
        isChecked
          ? 'bg-web-primary hover:bg-web-secondary'
          : 'bg-gray-300 hover:bg-gray-400',
        disabled && [
          'cursor-not-allowed opacity-50',
          isChecked ? 'bg-disabled-background' : 'bg-disabled-background',
        ],
        className
      )}
      {...props}
    > 
      <span
        className={cn(
          'pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
          translateClasses[size],
          thumbSizeClasses[size],
          disabled && 'bg-disabled-background'
        )}
      />
    </button>
  );
});