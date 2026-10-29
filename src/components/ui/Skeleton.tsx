import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-neutral-200/80 dark:bg-neutral-800/70 transition-colors",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton pour le Dashboard complet (KPIs, graphiques, listes d'activités récentes)
 */
export function DashboardSkeleton() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-3.5 w-40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 4 Cartes KPI (2x2 sur mobile, 4 sur desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <Skeleton className="h-6 sm:h-7 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Deux grands panneaux (Factures récentes & Derniers encaissements) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/60"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton pour les vues tabulaires (Factures, Clients, Transactions)
 */
export function TableSkeleton({ title = "Chargement..." }: { title?: string }) {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Filtres & Recherche */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
        <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
      </div>

      {/* Rendu mobile (cartes) */}
      <div className="md:hidden space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 bg-white dark:bg-[#1E293B]/40 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-36" />
            <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Rendu desktop (tableau complet) */}
      <div className="hidden md:block border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 bg-white dark:bg-[#1E293B]/40 space-y-3">
        <div className="grid grid-cols-6 gap-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-3.5 w-20" />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 py-3 items-center border-b border-neutral-50 dark:border-neutral-800/40 last:border-0"
          >
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton pour la page Détail de Facture (style A4)
 */
export function InvoiceDetailSkeleton() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Barre d'action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-6 w-44" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* Feuille A4 */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#1E293B]/60 rounded-2xl border border-[#E2E8F0] dark:border-neutral-700 p-6 sm:p-10 space-y-6">
        <div className="flex justify-between items-start pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-12 w-44 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>

        <div className="flex justify-end pt-4">
          <Skeleton className="h-32 w-72 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

