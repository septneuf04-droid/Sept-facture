"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { CompanySwitcher } from "./CompanySwitcher";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/invoices", label: "Factures" },
  { href: "/clients", label: "Clients" },
  { href: "/payments", label: "Paiements" },
  { href: "/settings", label: "Paramètres" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-40 px-4 md:px-8 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-2">
        {/* Brand & Company Switcher */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-[#6C5CE7]/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="hidden lg:block">
              <span className="font-bold text-neutral-900 tracking-tight text-lg">
                Sept-facture
              </span>
              <p className="text-[10px] text-neutral-400 font-medium -mt-1">
                Smart Finance RDC
              </p>
            </div>
          </Link>

          <CompanySwitcher />
        </div>

        {/* Central Pill Navigation (Style Finora exact) */}
        <nav className="hidden md:flex items-center p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-neutral-200/70 shadow-finora-sm">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname?.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 tracking-tight",
                  isActive
                    ? "bg-[#0A0A0A] text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pro Upgrade pill */}
          <Link
            href="/settings/billing"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-pink-100 text-[#6C5CE7] text-xs font-semibold hover:opacity-90 transition-opacity border border-violet-200/50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#6C5CE7]" />
            <span>Passer à Pro</span>
          </Link>

          {/* Quick search button */}
          <button
            type="button"
            className="w-9 h-9 rounded-full border border-neutral-200/80 bg-white/80 hover:bg-white text-neutral-700 flex items-center justify-center transition-colors shadow-xs"
            title="Recherche (Ctrl + K)"
          >
            <Search className="w-4 h-4 stroke-[1.8]" />
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative w-9 h-9 rounded-full border border-neutral-200/80 bg-white/80 hover:bg-white text-neutral-700 flex items-center justify-center transition-colors shadow-xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#6C5CE7]" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-9 h-9 rounded-full ring-2 ring-white overflow-hidden shadow-xs bg-gradient-to-tr from-amber-200 to-rose-200 flex items-center justify-center font-semibold text-neutral-800 text-xs">
              <span className="text-xs font-bold">MK</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
