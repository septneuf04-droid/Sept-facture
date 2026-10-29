"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowUp,
  FileText,
  Clock,
  AlertTriangle,
  TrendingUp,
  Building2,
  Smartphone,
  CheckCircle2,
  Calendar,
  Eye,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Money } from "@/components/ui/Money";
import { useAppStore } from "@/lib/store";
import { getDashboardStats } from "@/lib/data/dashboard";
import { getInvoices } from "@/lib/data/invoices";
import { getPayments } from "@/lib/data/payments";
import { getActiveCompany } from "@/lib/data/companies";
import { Currency, formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/useHydrated";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const [activeCurrencyTab, setActiveCurrencyTab] = useState<Currency>("CDF");
  const mounted = useHydrated();

  const { invoices, payments, activeCompanyId } = useAppStore();

  const company = getActiveCompany();
  const stats = getDashboardStats(activeCurrencyTab);
  const allInvoices = getInvoices();
  const allPayments = getPayments();

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-3.5 sm:space-y-6 overflow-y-auto bg-white dark:bg-[#0F172A] transition-colors">
      {/* Header & Fil d'Ariane */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-400 font-medium mb-0.5 sm:mb-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-semibold truncate max-w-[200px]">
              {company.name}
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Dashboard Financier
          </h1>
          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Suivi en temps réel de votre facturation en CDF & USD (Taux : 1 $ = {company.exchangeRate} FC)
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Switcher Multidevise RDC (CDF / USD) */}
          <div className="flex p-0.5 sm:p-1 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-xl text-[11px] sm:text-xs font-semibold border border-transparent dark:border-[#334155]">
            <button
              type="button"
              onClick={() => setActiveCurrencyTab("CDF")}
              className={cn(
                "px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg transition-all",
                activeCurrencyTab === "CDF"
                  ? "bg-white dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] shadow-xs font-bold"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              CDF (FC)
            </button>
            <button
              type="button"
              onClick={() => setActiveCurrencyTab("USD")}
              className={cn(
                "px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg transition-all",
                activeCurrencyTab === "USD"
                  ? "bg-white dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] shadow-xs font-bold"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              USD ($)
            </button>
          </div>

          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] sm:text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Créer Facture</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards (Optimisées 2x2 sur mobile et 4 colonnes sur desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {/* Total Facturé */}
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-2.5 sm:p-4.5 bg-white dark:bg-[#1E293B]/40 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 sm:mb-2 font-medium">
            <span className="truncate">Total Facturé</span>
            <span className="p-1 sm:p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA]">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="text-sm sm:text-lg lg:text-xl font-bold text-[#0F172A] dark:text-white mb-0.5 sm:mb-1 truncate">
            <Money amount={stats.totalInvoiced} currency={activeCurrencyTab} size="xl" />
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 truncate">
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span>{allInvoices.length} factures</span>
          </div>
        </div>

        {/* Montant Encaissé */}
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-2.5 sm:p-4.5 bg-white dark:bg-[#1E293B]/40 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 sm:mb-2 font-medium">
            <span className="truncate">Encaissé</span>
            <span className="p-1 sm:p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="text-sm sm:text-lg lg:text-xl font-bold text-[#0F172A] dark:text-white mb-0.5 sm:mb-1 truncate">
            <Money amount={stats.totalCollected} currency={activeCurrencyTab} size="xl" />
          </div>
          <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
            Taux : <span className="font-bold text-neutral-800 dark:text-neutral-200">{stats.collectionRate}%</span>
          </div>
        </div>

        {/* Montant en attente */}
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-2.5 sm:p-4.5 bg-white dark:bg-[#1E293B]/40 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 sm:mb-2 font-medium">
            <span className="truncate">En Attente</span>
            <span className="p-1 sm:p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="text-sm sm:text-lg lg:text-xl font-bold text-[#0F172A] dark:text-white mb-0.5 sm:mb-1 truncate">
            <Money amount={stats.totalPending} currency={activeCurrencyTab} size="xl" />
          </div>
          <div className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-semibold truncate">
            {stats.openCount} en cours
          </div>
        </div>

        {/* Retard */}
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-2.5 sm:p-4.5 bg-white dark:bg-[#1E293B]/40 shadow-2xs">
          <div className="flex justify-between items-center text-xs text-rose-600 dark:text-rose-400 mb-1.5 sm:mb-2 font-medium">
            <span className="truncate">Échu / Retard</span>
            <span className="p-1 sm:p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="text-sm sm:text-lg lg:text-xl font-bold text-[#0F172A] dark:text-white mb-0.5 sm:mb-1 truncate">
            <Money amount={stats.overdueAmount} currency={activeCurrencyTab} size="xl" />
          </div>
          <div className="text-[10px] sm:text-[11px] text-rose-600 dark:text-rose-400 font-semibold truncate">
            {stats.overdueCount} facture(s)
          </div>
        </div>
      </div>

      {/* Main Grid : Invoices & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Colonne Gauche (2/3) : Factures récentes */}
        <div className="lg:col-span-2 border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#0F172A] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
                Factures Récentes
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Dernières émissions et règlements
              </p>
            </div>
            <Link
              href="/invoices"
              className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* VUE MOBILE : Liste de Cartes tactiles (écrans < md) */}
          <div className="md:hidden space-y-2.5">
            {allInvoices.slice(0, 5).map((inv) => (
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="block p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-[#F8FAFC]/60 dark:bg-[#1E293B]/40 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white">
                    {inv.number || "BROUILLON"}
                  </span>
                  <StatusBadge status={inv.status} size="sm" />
                </div>
                <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate mb-1">
                  {inv.client?.name || "Client"}
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-200/50 dark:border-neutral-800">
                  <span>Échéance : {formatDate(inv.dueDate)}</span>
                  <span className="font-bold text-neutral-900 dark:text-white text-xs">
                    {formatMoney(inv.total, inv.currency || activeCurrencyTab)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* VUE TABLETTE & DESKTOP (écrans >= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 text-[11px] font-semibold">
                  <th className="py-2.5">N° Facture</th>
                  <th className="py-2.5">Client</th>
                  <th className="py-2.5">Échéance</th>
                  <th className="py-2.5">Statut</th>
                  <th className="py-2.5 text-right">Montant</th>
                  <th className="py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/60">
                {allInvoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                      <Link href={`/invoices/${inv.id}`} className="hover:text-[#2563EB] dark:hover:text-[#60A5FA]">
                        {inv.number || "BROUILLON"}
                      </Link>
                    </td>
                    <td className="py-3 font-semibold text-neutral-900 dark:text-white">
                      {inv.client?.name || "Client"}
                    </td>
                    <td className="py-3 text-neutral-500 dark:text-neutral-400">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3 text-right font-bold text-neutral-900 dark:text-white">
                      {formatMoney(inv.total, inv.currency || activeCurrencyTab)}
                    </td>
                    <td className="py-3 text-center">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        title="Consulter"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Colonne Droite (1/3) : Transactions Récentes */}
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#0F172A] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
                Règlements Récents
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Virements & Mobile Money
              </p>
            </div>
            <Link
              href="/payments"
              className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
            >
              Tous →
            </Link>
          </div>

          <div className="space-y-2.5">
            {allPayments.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-[#F8FAFC] dark:bg-[#1E293B]/40"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ArrowUp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                      {p.clientName}
                    </div>
                    <div className="text-[10px] text-neutral-400 capitalize truncate">
                      {p.method.replace("_", " ")} • {formatDate(p.paidOn)}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    {formatMoney(p.amount, p.currency || activeCurrencyTab)}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {p.reference.slice(0, 10)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/invoices/new"
              className="w-full py-2.5 rounded-xl border border-dashed border-[#CBD5E1] dark:border-[#334155] text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-[#2563EB] dark:hover:border-[#3B82F6] transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer une Facture</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
