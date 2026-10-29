"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface PillTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function PillTabs({
  tabs,
  activeId,
  onChange,
  className,
  size = "md",
}: PillTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-md rounded-full border border-neutral-200/60 shadow-sm",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-full font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap",
              size === "sm"
                ? "px-3.5 py-1 text-xs"
                : "px-4 py-1.5 text-xs md:text-sm",
              isActive
                ? "bg-[#0A0A0A] text-white shadow-sm"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
            )}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-200/80 text-neutral-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
