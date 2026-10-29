"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function HamburgerButton({
  isOpen,
  onClick,
  className,
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
      aria-expanded={isOpen}
      className={cn(
        "relative group flex items-center justify-center w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl transition-all duration-300 ease-out",
        "bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm",
        "border border-[#E2E8F0] dark:border-[#334155]",
        "hover:border-[#2563EB]/40 dark:hover:border-[#3B82F6]/50",
        "hover:shadow-md hover:shadow-blue-500/10 active:scale-90",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
        isOpen && "bg-blue-50/80 dark:bg-blue-950/40 border-[#2563EB]/40 dark:border-[#3B82F6]/50 shadow-sm shadow-blue-500/15",
        className
      )}
    >
      {/* Halo lumineux subtil en arrière-plan lors de l'activation */}
      <span
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-tr from-[#2563EB]/10 via-[#3B82F6]/5 to-transparent transition-opacity duration-300 pointer-events-none",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 group-hover:opacity-100"
        )}
      />

      {/* Conteneur des barres animées (Burger to Cross morph) */}
      <div className="relative w-5 h-4 flex flex-col justify-between items-center z-10">
        {/* Barre du haut */}
        <span
          className={cn(
            "w-5 h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center",
            isOpen
              ? "bg-[#2563EB] dark:bg-[#60A5FA] translate-y-[7px] rotate-45"
              : "bg-[#0F172A] dark:bg-slate-200 group-hover:bg-[#2563EB] dark:group-hover:bg-[#3B82F6]"
          )}
        />

        {/* Barre du milieu */}
        <span
          className={cn(
            "w-5 h-[2px] rounded-full transition-all duration-200 ease-in-out",
            isOpen
              ? "opacity-0 scale-x-0 -translate-x-2"
              : "opacity-100 scale-x-100 bg-[#0F172A] dark:bg-slate-200 group-hover:bg-[#2563EB] dark:group-hover:bg-[#3B82F6]"
          )}
        />

        {/* Barre du bas */}
        <span
          className={cn(
            "w-5 h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center",
            isOpen
              ? "bg-[#2563EB] dark:bg-[#60A5FA] -translate-y-[7px] -rotate-45"
              : "bg-[#0F172A] dark:bg-slate-200 group-hover:bg-[#2563EB] dark:group-hover:bg-[#3B82F6]"
          )}
        />
      </div>
    </button>
  );
}
