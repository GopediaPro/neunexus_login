import { forwardRef, useState, type FocusEvent } from "react";

import { cn } from "@/lib/utils"
import { InputSuffix } from "@/components/ui/InputSuffix";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { 
    error?: string;
    helperText?: string;
    variant?: 'default' | 'focused' | 'error';
    showPasswordToggle?: boolean;
  }

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    helperText,
    error,
    variant = 'default',
    className,
    type: propType,
    onFocus,
    onBlur,
    showPasswordToggle = false,
    ...props 
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordInput = propType === 'password';
    const currentType = isPasswordInput && showPassword ? 'text' : propType;
    const onIcons = error || (isPasswordInput && showPasswordToggle);

    const currentVariant = error ? 'error' : (isFocused ? 'focused' : variant);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    }

    return (
      <div>
        <div className="relative">
          <input
            type={currentType}
            className={cn(
              "flex h-[3.125rem] w-full rounded-lg border transition-colors",
              "px-3 py-1 text-base shadow-sm",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "focus-visible:outline-none focus-visible:ring-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "md:text-sm",
              
              currentVariant === 'default' && "border-border-default focus:border-web-primary",
              currentVariant === 'focused' && "border-web-primary focus-visible:ring-web-primary/20",
              currentVariant === 'error' && "border-border-error focus:border-border-error focus-visible:ring-web-error/20",

              onIcons && "pr-10",
              props.disabled && "bg-gray-100 text-gray-400 cursor-not-allowed border-border-subtle",
              className,
            )}
            ref={ref}
            autoComplete="off"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {onIcons && (
            <InputSuffix
              error={error}
              showPassword={showPassword}
              onTogglePassword={isPasswordInput && showPasswordToggle ? handleTogglePassword : undefined}
              type={propType}
            />
          )}
        </div>

        {helperText && !error && (
          <p className="text-sm text-font-tertiary mt-1">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
