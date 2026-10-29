import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InvoiceChipProps {
  number: string;
  href?: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function InvoiceChip({
  number,
  href,
  isActive = false,
  className,
  onClick,
}: InvoiceChipProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200",
        isActive
          ? "bg-[#6C5CE7] text-white shadow-sm ring-2 ring-[#6C5CE7]/30"
          : "bg-[#ECE9FB] text-[#5243C2] hover:bg-[#E2DEFA]",
        className
      )}
    >
      {number || "BROUILLON"}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block" onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="inline-block text-left">
        {content}
      </button>
    );
  }

  return content;
}
