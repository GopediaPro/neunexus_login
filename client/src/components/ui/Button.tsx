import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const buttonPadding = {
  ctaDefault: "px-5 py-4 rounded-xl text-h3",
  ctaCompact: "px-5 py-3 rounded-xl text-h3",
  sidebarMenu: "px-3 py-4 rounded-lg text-h3",
  tabSm: "px-2 py-1 rounded-md text-h3",
  tabMd: "px-5 py-4 rounded-xl text-h3",
  viewBtn: "px-4 py-1 rounded-lg text-h3",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  nameType?: keyof typeof buttonPadding;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, loading, children, disabled, nameType = "ctaDefault", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          buttonPadding[nameType],
          className
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <Loader className="w-4 h-4 animate-spin mr-2 text-gray-300" />
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };