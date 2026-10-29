import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variantClasses = {
      primary:
        "bg-[#0A0A0A] text-white hover:bg-[#262626] focus:ring-neutral-900 shadow-sm",
      secondary:
        "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-400",
      accent:
        "bg-[#6C5CE7] text-white hover:bg-[#5B4BD8] focus:ring-[#6C5CE7] shadow-sm",
      outline:
        "border border-neutral-200/90 bg-white text-neutral-800 hover:bg-neutral-50 focus:ring-neutral-300 shadow-xs",
      ghost:
        "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 focus:ring-neutral-300",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    };

    const sizeClasses = {
      sm: "px-3.5 py-1.5 text-xs rounded-full gap-1.5",
      md: "px-5 py-2.5 text-xs md:text-sm rounded-full gap-2",
      lg: "px-6 py-3 text-sm md:text-base rounded-full gap-2.5",
      icon: "w-9 h-9 rounded-full p-0 flex items-center justify-center shrink-0 border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 shadow-xs",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
