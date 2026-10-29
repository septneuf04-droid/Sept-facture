import React from "react";
import { cn } from "@/lib/utils";

interface DataRowProps {
  icon?: React.ReactNode;
  iconBg?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailingTop?: React.ReactNode;
  trailingBottom?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DataRow({
  icon,
  iconBg = "bg-neutral-100 text-neutral-600",
  title,
  subtitle,
  trailingTop,
  trailingBottom,
  className,
  onClick,
}: DataRowProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between py-3 px-3.5 rounded-2xl transition-all duration-200 text-left",
        onClick && "hover:bg-neutral-50/80 active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold",
              iconBg
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-neutral-900 truncate">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-neutral-500 mt-0.5 truncate">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {(trailingTop || trailingBottom) && (
        <div className="text-right shrink-0 pl-3">
          {trailingTop && (
            <div className="text-sm font-semibold text-neutral-900">
              {trailingTop}
            </div>
          )}
          {trailingBottom && (
            <div className="text-xs text-neutral-500 mt-0.5">
              {trailingBottom}
            </div>
          )}
        </div>
      )}
    </Component>
  );
}
