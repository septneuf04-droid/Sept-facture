"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

interface UpgradeBannerProps {
  className?: string;
}

export function UpgradeBanner({ className }: UpgradeBannerProps) {
  const { invoices, activeCompanyId, subscription } = useAppStore();

  // Ne pas afficher si l'utilisateur est déjà en plan Pro
  if (subscription.plan === "pro") {
    return null;
  }

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentCount = invoices.filter(
    (i) => i.companyId === activeCompanyId && i.createdAt.startsWith(currentMonth)
  ).length;

  const maxCount = PLANS.free.invoicesPerMonth;

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-violet-200/60 rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-finora-sm",
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#6C5CE7]/30">
          <Sparkles className="w-5 h-5 fill-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7] bg-white px-2 py-0.5 rounded-full border border-violet-100">
              Plan Gratuit
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              {currentCount} sur {maxCount} factures ce mois-ci
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Débloquez les factures illimitées, supprimez le filigrane PDF et exportez vos données comptables.
          </p>
        </div>
      </div>

      <Link
        href="/settings/billing"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
      >
        <span>Passer à Pro (9 $/mois)</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
