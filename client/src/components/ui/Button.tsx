import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.5rem] text-button transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-text-contrast-500 shadow hover:bg-primary-600",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary-500 underline-offset-4 hover:underline",
        focus: "bg-primary-500 text-text-contrast-500 hover:bg-primary-600",
        light: "bg-fill-base-100 text-text-base-500 border border-stroke-base-100 hover:bg-fill-alt-100",
      },
      size: {
        default: "h-[48px] px-8 py-4 text-[16px]",
        compact: "h-[48px] px-8 py-3 text-[12px]", 
        sidebar: "h-[32px] px-4 py-2 text-[16px]",
        tabSm: "h-8 px-2 py-1 text-[12px]",
        tabMd: "h-[40px] px-5 py-4 text-[16px]",
        view: "px-1 py-2 text-[10px] text-text-base-400 rounded-full",
        auth: "h-14 w-full px-2.5 py-[18px] rounded-xl text-body-m tracking-[0.06px]"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
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

export { Button, buttonVariants };