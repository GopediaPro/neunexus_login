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
              "flex h-[3.125rem] w-full border rounded-[0.5rem] transition-all duration-200 ease-in-out",
              "px-3 py-3 text-body-l",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",

              !error && "text-text-base-500 bg-fill-alt-200",
              error && "bg-error-100 text-error-500",

              currentVariant === 'default' && !error && "placeholder:text-text-base-400",
              currentVariant === 'focused' && !error && "placeholder:text-primary-500",
              currentVariant === 'error' && "placeholder:text-error-500",
              "placeholder:font-normal",
              
              currentVariant === 'default' && [
                "border-stroke-base-100",
                "hover:border-stroke-base-100",
                "focus:border-primary-500 focus:text-text-base-500"
              ],
              currentVariant === 'focused' && [
                "border-[2px] border-primary-500 text-text-base-500"
              ],
              currentVariant === 'error' && [
                "border-[2px] border-error-500",
                "focus:border-error-500 focus:text-error-500"
              ],

              onIcons && "pr-10",

              props.disabled && [
                "bg-fill-alt-100 text-text-base-200",
                "border-stroke-base-100 cursor-not-allowed", 
                "placeholder:text-text-base-300",
                "hover:border-stroke-base-100 focus:border-stroke-base-100"
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
          <p className="text-caption text-text-base-400 mt-1">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
