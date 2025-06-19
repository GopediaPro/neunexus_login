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
              "flex h-[3.125rem] w-full border-2 rounded-[0.5rem] transition-all duration-200 ease-in-out",
              "px-3 py-3 text-base font-normal",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",

              !error && "bg-white dark:bg-input-background",
              error && "bg-background-error",
              "text-input-font",

              currentVariant === 'default' && !error && "placeholder:text-font-tertiary",
              currentVariant === 'focused' && !error && "placeholder:text-web-focus",
              currentVariant === 'error' && "placeholder:text-web-error",
              "placeholder:font-normal",
              
              currentVariant === 'default' && [
                "border-border-default",
                "hover:border-border-icon",
                "focus:border-web-focus focus:text-input-font"
              ],
              currentVariant === 'focused' && [
                "border-web-focus text-input-font"
              ],
              currentVariant === 'error' && [
                "border-border-error",
                "focus:border-border-error focus:text-input-font"
              ],

              onIcons && "pr-10",

              props.disabled && [
                "bg-disabled-background text-disabled-text",
                "border-disabled-border cursor-not-allowed", 
                "placeholder:text-disabled-placeholder",
                "hover:border-disabled-border focus:border-disabled-border"
              ],
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
