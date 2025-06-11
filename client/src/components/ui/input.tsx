import { forwardRef, useState, type FocusEvent } from "react";

import { cn } from "@/lib/utils"
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { 
    label?: string;
    error?: string;
    helperText?: string;
    variant?: 'default' | 'focused' | 'error';
  }

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    helperText,
    error,
    variant = 'default',
    className,
    type,
    onFocus,
    onBlur,
    ...props 
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const currentVariant = error ? 'error' : (isFocused ? 'focused' : variant);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    }

    return (
      <div>
        {label && (
          <label>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-[3.125rem] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              
              currentVariant === 'default' && "border-gray2 focus:border-blue-500",
              currentVariant === 'focused' && "border-blue-500",
              currentVariant === 'error' && "border-redNotice",

              error && "pr-10",
              props.disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
              className,

            )}
            ref={ref}
            autoComplete="off"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <img src="/image/alert.svg" alt="에러 이미지" />
            </div>
          )}
        </div>

        {error && <ErrorMessage message={error} />}
        {helperText && !error && <p className="text-sm text-gray2">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
