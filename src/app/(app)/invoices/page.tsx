"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Send,
  FileText,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAppStore } from "@/lib/store";
import { getInvoices, sendInvoiceData, deleteInvoiceData } from "@/lib/data/invoices";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { InvoiceStatus } from "@/lib/types";
import { useHydrated } from "@/lib/useHydrated";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { getActiveCompany } from "@/lib/data/companies";
import { WhatsAppInvoiceModal } from "@/components/invoices/WhatsAppInvoiceModal";

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInvoiceForWhatsApp, setSelectedInvoiceForWhatsApp] = useState<any | null>(null);
  const mounted = useHydrated();

  const { invoices } = useAppStore();
  const company = getActiveCompany();

  const allInvoices = getInvoices();

  // Filtre par statut & recherche par nom de client
  const filteredInvoices = allInvoices.filter((inv) => {
    if (activeTab !== "all" && inv.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchClient = inv.client?.name.toLowerCase().includes(q) || false;
      const matchNum = inv.number.toLowerCase().includes(q);
      const matchTitle = inv.title.toLowerCase().includes(q);
      if (!matchClient && !matchNum && !matchTitle) return false;
    }
    return true;
  });

  const tabCounts = {
    all: allInvoices.length,
    draft: allInvoices.filter((i) => i.status === "draft").length,
    sent: allInvoices.filter((i) => i.status === "sent").length,
    paid: allInvoices.filter((i) => i.status === "paid").length,
    overdue: allInvoices.filter((i) => i.status === "overdue").length,
  };

  const handleSendInvoice = (id: string, num: string) => {
    const res = sendInvoiceData(id);
    if (res.success) {
      toast.success(`Facture ${num || "brouillon"} envoyée avec succès !`);
    } else {
      toast.error(res.error || "Erreur lors de l'envoi");
    }
  };

  const handleDeleteInvoice = (id: string, num: string) => {
    deleteInvoiceData(id);
    toast.success(`Facture ${num || "brouillon"} supprimée`);
  };

  if (!mounted) {
    return <TableSkeleton />;
  }

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-3.5 sm:space-y-6 overflow-y-auto bg-white dark:bg-[#0F172A] transition-colors">
      {/* Fil d'Ariane & Header Dashboard Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-400 font-medium mb-0.5 sm:mb-1">
            <span>Facturation</span>
            <span>&gt;</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Toutes les factures</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Factures
          </h1>
          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Suivi des émissions, échéances et encaissements en CDF et USD
          </p>
        </div>

        <Link
          href="/invoices/new"
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] sm:text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Créer une facture</span>
        </Link>
      </div>

      {/* Barre de filtres par statut & Barre de recherche par client */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Filtres par statut (Tous, Brouillon, Envoyée, Payée, En retard) */}
        <div className="flex p-1 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 overflow-x-auto border border-transparent dark:border-[#334155] no-scrollbar">
          {[
            { id: "all", label: "Tous", count: tabCounts.all },
            { id: "draft", label: "Brouillons", count: tabCounts.draft },
            { id: "sent", label: "Envoyées", count: tabCounts.sent },
            { id: "paid", label: "Payées", count: tabCounts.paid },
            { id: "overdue", label: "En retard", count: tabCounts.overdue },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white shadow-xs font-bold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full",
                  activeTab === tab.id
                    ? "bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-[#60A5FA] font-bold"
                    : "bg-neutral-200/60 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Barre de recherche par nom de client */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par nom de client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
          />
        </div>
      </div>

      {/* VUE MOBILE : Liste de Cartes Tactiles (Dual-Rendering md:hidden) */}
      <div className="md:hidden space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#1E293B]/20">
            <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Aucune facture trouvée</p>
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl p-3 sm:p-4 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-2.5"
            >
              {/* En-tête : Numéro + Statut avec badge coloré */}
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="font-mono font-bold text-xs text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                >
                  {inv.number || "BROUILLON"}
                </Link>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {inv.currency || "CDF"}
                  </span>
                  <StatusBadge status={inv.status} size="sm" />
                </div>
              </div>

              {/* Corps : Client + Dates formatées jour/mois/année */}
              <div>
                <Link
                  href={`/invoices/${inv.id}`}
                  className="text-xs font-bold text-neutral-900 dark:text-white block hover:text-[#2563EB]"
                >
                  {inv.client?.name || "Client non assigné"}
                </Link>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center justify-between">
                  <span>Émise : {formatDate(inv.issueDate)}</span>
                  <span>Échéance : {formatDate(inv.dueDate)}</span>
                </div>
              </div>

              {/* Pied : Montant fort + Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div>
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-semibold block">
                    Montant TTC
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">
                    {formatMoney(inv.total, inv.currency || "CDF")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceForWhatsApp(inv)}
                    className="h-8 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#25D366] text-[11px] font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5"
                    title="Envoyer par WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  <Link
                    href={`/invoices/${inv.id}`}
                    className="h-8 px-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Détail</span>
                  </Link>

                  {inv.status === "draft" && (
                    <button
                      type="button"
                      onClick={() => handleSendInvoice(inv.id, inv.number)}
                      className="h-8 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] text-[11px] font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VUE DESKTOP & TABLETTE : Tableau Minimaliste (hidden md:block) */}
      <div className="hidden md:block border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl overflow-hidden bg-white dark:bg-[#0F172A] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-[#1E293B]/60 border-b border-[#E2E8F0] dark:border-[#1E293B] text-neutral-400 dark:text-neutral-500 text-[11px] font-semibold">
                <th className="py-3 px-5">N° Facture</th>
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Date d&apos;émission</th>
                <th className="py-3 px-5">Date d&apos;échéance</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5 text-right">Montant TTC</th>
                <th className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    Aucune facture trouvée pour ces critères
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-neutral-900 dark:text-white">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="hover:text-[#2563EB] dark:hover:text-[#60A5FA]"
                      >
                        {inv.number || "BROUILLON"}
                      </Link>
                    </td>

                    <td className="py-3.5 px-5 font-semibold text-neutral-900 dark:text-white">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="hover:text-[#2563EB] dark:hover:text-[#60A5FA]"
                      >
                        {inv.client?.name || "Client non assigné"}
                      </Link>
                    </td>

                    <td className="py-3.5 px-5 text-neutral-500 dark:text-neutral-400">
                      {formatDate(inv.issueDate)}
                    </td>

                    <td className="py-3.5 px-5 text-neutral-500 dark:text-neutral-400">
                      {formatDate(inv.dueDate)}
                    </td>

                    <td className="py-3.5 px-5">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-5 text-right font-extrabold text-neutral-900 dark:text-white">
                      {formatMoney(inv.total, inv.currency || "CDF")}
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoiceForWhatsApp(inv);
                          }}
                          className="w-8 h-8 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-[#25D366] flex items-center justify-center transition-colors shadow-2xs"
                          title="Envoyer par WhatsApp"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </button>

                        <Link
                          href={`/invoices/${inv.id}`}
                          className="w-8 h-8 rounded-xl border border-[#E2E8F0] dark:border-[#334155] hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors"
                          title="Voir le détail de la facture"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {inv.status === "draft" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendInvoice(inv.id, inv.number);
                            }}
                            className="w-8 h-8 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center transition-colors"
                            title="Envoyer la facture"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvoice(inv.id, inv.number);
                          }}
                          className="w-8 h-8 rounded-xl border border-[#E2E8F0] dark:border-[#334155] hover:bg-rose-50 dark:hover:bg-rose-950/60 text-neutral-400 hover:text-rose-600 hover:border-rose-300 transition-colors flex items-center justify-center"
                          title="Supprimer la facture"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale d'envoi WhatsApp */}
      {selectedInvoiceForWhatsApp && (
        <WhatsAppInvoiceModal
          isOpen={Boolean(selectedInvoiceForWhatsApp)}
          onClose={() => setSelectedInvoiceForWhatsApp(null)}
          invoice={selectedInvoiceForWhatsApp}
          company={company}
          client={selectedInvoiceForWhatsApp.client}
          onInvoiceSent={() => {
            if (selectedInvoiceForWhatsApp.status === "draft") {
              handleSendInvoice(selectedInvoiceForWhatsApp.id, selectedInvoiceForWhatsApp.number);
            }
          }}
        />
      )}
    </div>
  );
}
