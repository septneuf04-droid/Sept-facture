"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Search,
  Download,
  Smartphone,
  Building2,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { Money } from "@/components/ui/Money";
import { useAppStore } from "@/lib/store";
import { getPayments } from "@/lib/data/payments";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useHydrated } from "@/lib/useHydrated";
import { TableSkeleton } from "@/components/ui/Skeleton";

export default function PaymentsPage() {
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const mounted = useHydrated();

  const { payments } = useAppStore();

  const allPayments = getPayments();

  const filteredPayments = allPayments.filter((payment) => {
    if (methodFilter !== "all" && payment.method !== methodFilter) return false;
    if (currencyFilter !== "all" && payment.currency !== currencyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = payment.reference.toLowerCase().includes(q);
      const matchClient = payment.clientName.toLowerCase().includes(q);
      const matchInv = payment.invoiceNumber.toLowerCase().includes(q);
      if (!matchRef && !matchClient && !matchInv) return false;
    }
    return true;
  });

  if (!mounted) {
    return <TableSkeleton title="Chargement des transactions..." />;
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "mpesa":
      case "airtel_money":
      case "orange_money":
        return <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "transfer":
        return <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-3.5 sm:space-y-6 overflow-y-auto bg-white dark:bg-[#0F172A] transition-colors">
      {/* Fil d'Ariane & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
            <span>Finances</span>
            <span>&gt;</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Transactions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Transactions & Règlements
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Historique complet des encaissements Mobile Money et virements bancaires
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => toast.success("Export comptable CSV généré")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Encaisser Facture</span>
          </Link>
        </div>
      </div>

      {/* Barre d'outils et filtres */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        <div className="flex p-1 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 overflow-x-auto border border-transparent dark:border-[#334155]">
          {[
            { id: "all", label: "Toutes méthodes" },
            { id: "mpesa", label: "M-Pesa" },
            { id: "airtel_money", label: "Airtel Money" },
            { id: "orange_money", label: "Orange Money" },
            { id: "transfer", label: "Virements" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethodFilter(m.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all whitespace-nowrap",
                methodFilter === m.id
                  ? "bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white shadow-xs font-bold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher réf, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
            />
          </div>

          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-3 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1E293B]"
          >
            <option value="all">Devise</option>
            <option value="USD">USD ($)</option>
            <option value="CDF">CDF (FC)</option>
          </select>
        </div>
      </div>

      {/* VUE MOBILE : Cartes de Transactions (< md) */}
      <div className="md:hidden space-y-3">
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <Wallet className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs text-neutral-500">Aucune transaction trouvée</p>
          </div>
        ) : (
          filteredPayments.map((p) => (
            <div
              key={p.id}
              className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl p-3 sm:p-4 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center">
                    {getMethodIcon(p.method)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white capitalize block">
                      {p.method.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {p.reference}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 block">
                    +{formatMoney(p.amount, p.currency)}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    {p.paidOn}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-300 font-medium truncate max-w-[180px]">
                  {p.clientName}
                </span>
                <Link
                  href={`/invoices/${p.invoiceId}`}
                  className="font-mono text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
                >
                  <span>{p.invoiceNumber}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VUE TABLETTE & DESKTOP (>= md) */}
      <div className="hidden md:block border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl overflow-hidden bg-white dark:bg-[#0F172A] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-[#1E293B]/60 border-b border-[#E2E8F0] dark:border-[#1E293B] text-neutral-400 dark:text-neutral-500 text-[11px] font-semibold">
                <th className="py-3 px-5">Méthode</th>
                <th className="py-3 px-5">Référence</th>
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Facture liée</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-right">Montant Encaissé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center">
                        {getMethodIcon(p.method)}
                      </div>
                      <span className="font-semibold text-neutral-900 dark:text-white capitalize">
                        {p.method.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-mono text-neutral-600 dark:text-neutral-400">
                    {p.reference}
                  </td>
                  <td className="py-3 px-5 font-medium text-neutral-900 dark:text-white">
                    {p.clientName}
                  </td>
                  <td className="py-3 px-5">
                    <Link
                      href={`/invoices/${p.invoiceId}`}
                      className="font-mono text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                    >
                      {p.invoiceNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-5 text-neutral-500 dark:text-neutral-400">{p.paidOn}</td>
                  <td className="py-3 px-5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatMoney(p.amount, p.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
