import React from "react";
import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  paid: {
    label: "Payée",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    border: "border-emerald-200/80 dark:border-emerald-800/80",
  },
  sent: {
    label: "Envoyée",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    border: "border-amber-200/80 dark:border-amber-800/80",
  },
  overdue: {
    label: "En retard",
    bg: "bg-rose-50 dark:bg-rose-950/60",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    border: "border-rose-200/80 dark:border-rose-800/80",
  },
  draft: {
    label: "Brouillon",
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-600 dark:text-neutral-300",
    dot: "bg-neutral-400",
    border: "border-neutral-200 dark:border-neutral-700",
  },
  cancelled: {
    label: "Annulée",
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-500 dark:text-neutral-400",
    dot: "bg-neutral-400",
    border: "border-neutral-200 dark:border-neutral-700",
  },
};

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold tracking-tight whitespace-nowrap border",
        config.bg,
        config.text,
        config.border,
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
