import React from "react";
import { cn } from "@/lib/utils";
import { Currency } from "@/lib/money";

interface CurrencyBadgeProps {
  currency: Currency;
  className?: string;
  size?: "sm" | "md";
}

export function CurrencyBadge({ currency, className, size = "md" }: CurrencyBadgeProps) {
  const isUsd = currency === "USD";
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full tracking-wider border",
        isUsd
          ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
          : "bg-blue-50 text-blue-700 border-blue-200/60",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        className
      )}
    >
      {currency}
    </span>
  );
}
