"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Settings,
  ArrowLeft,
  PieChart,
  HelpCircle,
  PlusCircle,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/invoices", icon: FileText, label: "Factures" },
  { href: "/clients", icon: Users, label: "Clients" },
  { href: "/payments", icon: CreditCard, label: "Paiements" },
  { href: "/settings/billing", icon: PieChart, label: "Rapports & Plan" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

export function IconSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar (Left vertical icons) */}
      <aside className="hidden md:flex flex-col items-center py-6 px-3 fixed left-4 top-24 bottom-6 w-16 bg-white/70 backdrop-blur-md rounded-3xl border border-neutral-200/70 shadow-finora z-30 justify-between">
        <div className="flex flex-col items-center gap-3">
          {/* Quick back or quick action button */}
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 transition-colors shadow-xs"
            title="Accueil"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </Link>

          <div className="w-8 h-[1px] bg-neutral-200/60 my-1" />

          {/* Navigation icons */}
          <div className="flex flex-col items-center gap-2">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 group relative",
                    isActive
                      ? "bg-[#0A0A0A] text-white shadow-md shadow-black/10 scale-105"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-white/90"
                  )}
                >
                  <Icon className="w-4 h-4 stroke-[1.9]" />

                  {/* Tooltip on hover */}
                  <span className="absolute left-14 px-2.5 py-1 bg-neutral-900 text-white text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom icon: Quick invoice create */}
        <Link
          href="/invoices/new"
          className="w-10 h-10 rounded-2xl bg-[#6C5CE7] hover:bg-[#5B4BD8] text-white flex items-center justify-center transition-all shadow-md shadow-[#6C5CE7]/30 hover:scale-105"
          title="Nouvelle Facture"
        >
          <PlusCircle className="w-5 h-5 stroke-[2]" />
        </Link>
      </aside>

      {/* Mobile Bottom Bar (Screen < 768px) */}
      <nav className="md:hidden fixed bottom-3 left-4 right-4 h-16 bg-white/95 backdrop-blur-lg rounded-full border border-neutral-200/80 shadow-2xl flex items-center justify-around px-3 z-50">
        {SIDEBAR_ITEMS.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                isActive
                  ? "bg-[#0A0A0A] text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <Icon className="w-4 h-4 stroke-[2]" />
            </Link>
          );
        })}

        {/* Quick New Invoice Mobile */}
        <Link
          href="/invoices/new"
          className="w-10 h-10 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center shadow-md shadow-[#6C5CE7]/30"
          title="Nouvelle facture"
        >
          <PlusCircle className="w-5 h-5 stroke-[2]" />
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            pathname?.startsWith("/settings")
              ? "bg-[#0A0A0A] text-white"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          <Settings className="w-4 h-4 stroke-[2]" />
        </Link>
      </nav>
    </>
  );
}
