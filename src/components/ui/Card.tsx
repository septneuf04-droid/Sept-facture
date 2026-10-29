import React from "react";
import { cn } from "@/lib/utils";
import { Plus, ArrowUpRight } from "lucide-react";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  onAddClick?: () => void;
  onExpandClick?: () => void;
  headerAction?: React.ReactNode;
  showActionButtons?: boolean;
}

export function Card({
  className,
  title,
  subtitle,
  badge,
  onAddClick,
  onExpandClick,
  headerAction,
  showActionButtons = false,
  children,
  ...props
}: CardProps) {
  const hasHeader = title || subtitle || badge || headerAction || showActionButtons;

  return (
    <div
      className={cn(
        "bg-white rounded-3xl p-6 md:p-7 shadow-finora border border-black/[0.03] transition-all duration-300",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div>
              {title && (
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">
                    {title}
                  </h3>
                  {badge}
                </div>
              )}
              {subtitle && (
                <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {headerAction}
            {showActionButtons && (
              <>
                {onAddClick && (
                  <button
                    type="button"
                    onClick={onAddClick}
                    className="w-8 h-8 rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 transition-colors shadow-sm"
                    title="Ajouter"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                )}
                {onExpandClick && (
                  <button
                    type="button"
                    onClick={onExpandClick}
                    className="w-8 h-8 rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 transition-colors shadow-sm"
                    title="Détails"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
