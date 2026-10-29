import React from "react";
import { Currency, formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

interface MoneyProps {
  amount: number | bigint;
  currency: Currency;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  showSign?: boolean;
}

export function Money({
  amount,
  currency,
  className,
  size = "md",
  showSign = false,
}: MoneyProps) {
  const formatted = formatMoney(amount, currency);
  const numeric = typeof amount === "bigint" ? Number(amount) : amount;
  const isPositive = numeric > 0;
  const sign = showSign && isPositive ? "+" : "";

  const sizeClasses = {
    xs: "text-xs font-medium",
    sm: "text-sm font-medium",
    md: "text-base font-semibold",
    lg: "text-lg font-semibold tracking-tight",
    xl: "text-xl font-bold tracking-tight",
    "2xl": "text-2xl font-bold tracking-tight",
    "3xl": "text-3xl md:text-4xl font-bold tracking-tight",
  };

  return (
    <span
      className={cn(
        "tabular-nums text-neutral-900 inline-block font-sans",
        sizeClasses[size],
        className
      )}
    >
      {sign}
      {formatted}
    </span>
  );
}
