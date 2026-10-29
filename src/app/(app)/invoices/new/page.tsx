"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Hash,
  Trash2,
  Plus,
  Send,
  FileText,
  Save,
  ChevronDown,
  Layers,
  Percent,
  Sparkles,
  Flower2,
  Check,
  Eye,
  PenTool,
  ArrowLeft,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getClients } from "@/lib/data/clients";
import { createInvoiceData } from "@/lib/data/invoices";
import { getActiveCompany } from "@/lib/data/companies";
import { formatMoney, calculateLineTotals, calculateInvoiceTotals, Currency } from "@/lib/money";
import { formatDate, getTodayIsoDate, getDefaultDueDateIso } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FormItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // en CDF ou USD
  vatRate: number; // 16% par défaut
}

import { useHydrated } from "@/lib/useHydrated";
import { InvoiceDetailSkeleton } from "@/components/ui/Skeleton";

export default function CreateInvoicePage() {
  const router = useRouter();
  const mounted = useHydrated();
  const [showPreview, setShowPreview] = useState(true);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  const { activeCompanyId } = useAppStore();
  const company = getActiveCompany();
  const companyClients = getClients();

  const [currency, setCurrency] = useState<Currency>("CDF");
  const [clientId, setClientId] = useState<string>(companyClients[0]?.id || "");
  const [issueDate, setIssueDate] = useState<string>(getTodayIsoDate());
  const [dueDate, setDueDate] = useState<string>(getDefaultDueDateIso(30));
  const [invoiceTitle, setInvoiceTitle] = useState<string>("Prestation de services");
  const [notes, setNotes] = useState<string>("Règlement par virement bancaire ou mobile money à 30 jours.");

  // Lignes de la facture (CDF ou USD, TVA 16%)
  const [items, setItems] = useState<FormItem[]>([
    {
      id: "1",
      description: "Conception & Développement Web",
      quantity: 1,
      unitPrice: 2800000,
      vatRate: 16,
    },
    {
      id: "2",
      description: "Hébergement Cloud & Sécurité (1 an)",
      quantity: 1,
      unitPrice: 850000,
      vatRate: 16,
    },
  ]);

  const selectedClient =
    companyClients.find((c) => c.id === clientId) || companyClients[0];

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        vatRate: 18,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("La facture doit comporter au moins une ligne");
      return;
    }
    setItems(items.filter((i) => i.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof FormItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Calcul automatique du sous-total, de la TVA 18% et du total TTC
  const totals = calculateInvoiceTotals(items, 16);

  const handleSubmit = (status: "draft" | "sent") => {
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    const hasEmptyDescription = items.some((i) => !i.description.trim());
    if (hasEmptyDescription) {
      toast.error("Veuillez renseigner la description de chaque ligne d'article");
      return;
    }

    const res = createInvoiceData({
      clientId: selectedClient.id,
      title: invoiceTitle || items[0]?.description || "Facture commerciale",
      category: "Facturation",
      currency,
      status,
      issueDate,
      dueDate,
      notes,
      items: items.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity) || 1,
        unitPrice: Math.round(Number(i.unitPrice) || 0),
        vatRate: 16,
      })),
    });

    if (res.success && res.invoice) {
      toast.success(
        status === "sent"
          ? `Facture ${res.invoice.number} émise avec succès !`
          : "Facture enregistrée comme brouillon !"
      );
      router.push(`/invoices/${res.invoice.id}`);
    } else {
      toast.error(res.error || "Erreur lors de la création de la facture");
    }
  };

  if (!mounted) {
    return <InvoiceDetailSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0F172A] transition-colors">
      {/* SÉLECTEUR D'ONGLET MOBILE (Formulaire vs Aperçu Live) */}
      <div className="xl:hidden p-3 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#1E293B]/40 sticky top-0 z-30">
        <div className="flex p-1 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileTab("form")}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
              mobileTab === "form"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            )}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Formulaire</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
              mobileTab === "preview"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu Facture</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row min-w-0">
        {/* ======================================================== */}
        {/* COLONNE GAUCHE : Formulaire de Saisie Facture           */}
        {/* ======================================================== */}
        <div
          className={cn(
            "flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-5 sm:space-y-6 transition-all duration-300",
            showPreview ? "xl:max-w-[55%]" : "max-w-4xl mx-auto",
            mobileTab !== "form" && "hidden xl:block"
          )}
        >
          {/* Fil d'Ariane & Retour */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <Link
              href="/invoices"
              className="hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Factures</span>
            </Link>
            <span>&gt;</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Créer une facture</span>
          </div>

          {/* En-tête de page */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                Nouvelle Facture
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Remplissez les lignes de prestations. Facturation multidevise CDF & USD (TVA 16%).
              </p>
            </div>

            {/* Toggle Aperçu Desktop */}
            <div className="hidden xl:flex items-center gap-2.5 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Aperçu
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={cn(
                  "w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5",
                  showPreview ? "bg-[#2563EB]" : "bg-neutral-300 dark:bg-neutral-700"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform shadow-xs",
                    showPreview ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          {/* SECTION 1 : Client, Devise & Dates */}
          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
                1. Informations Générales
              </h2>

              {/* Sélecteur de Devise CDF / USD */}
              <div className="flex p-0.5 bg-[#F1F5F9] dark:bg-[#0F172A] rounded-xl text-xs font-semibold border border-[#E2E8F0] dark:border-[#334155]">
                <button
                  type="button"
                  onClick={() => setCurrency("CDF")}
                  className={cn(
                    "px-3 py-1 rounded-lg transition-all",
                    currency === "CDF"
                      ? "bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] shadow-xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  CDF (FC)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={cn(
                    "px-3 py-1 rounded-lg transition-all",
                    currency === "USD"
                      ? "bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] shadow-xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Client (liste déroulante) */}
            <div className="notched-input-group">
              <label htmlFor="inv-client" className="notched-label">
                Client Destinataire <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Flower2 className="w-3 h-3 text-emerald-200" />
                </div>
                <select
                  id="inv-client"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="notched-input !pl-11 pr-8 appearance-none bg-white dark:bg-[#0F172A] font-semibold cursor-pointer"
                >
                  {companyClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Date d'émission & Date d'échéance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="notched-input-group">
                <label htmlFor="inv-issue-date" className="notched-label">
                  Date d&apos;émission <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="inv-issue-date"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="notched-input !pl-11"
                  />
                </div>
              </div>

              <div className="notched-input-group">
                <label htmlFor="inv-due-date" className="notched-label">
                  Date d&apos;échéance <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="inv-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="notched-input !pl-11"
                  />
                </div>
              </div>
            </div>

            {/* Objet / Intitulé de facture */}
            <div className="notched-input-group">
              <label htmlFor="inv-title" className="notched-label">Objet de la facture</label>
              <input
                id="inv-title"
                type="text"
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
                placeholder="Ex: Prestation de services informatiques"
                className="notched-input"
              />
            </div>
          </div>

          {/* SECTION 2 : Lignes de Facture */}
          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
                  2. Lignes de Facture
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Description, quantité et prix unitaire en {currency === "USD" ? "USD ($)" : "CDF (FC)"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une ligne</span>
              </button>
            </div>

            {/* Liste dynamique des lignes d'articles */}
            <div className="space-y-3">
              {items.map((item, index) => {
                const lineTotal = Math.round((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));

                return (
                  <div
                    key={item.id}
                    className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-[#F8FAFC] dark:bg-[#0F172A]/60 space-y-2.5 sm:space-y-3 relative shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      <span>Ligne {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length <= 1}
                        className="text-neutral-400 hover:text-rose-600 transition-colors disabled:opacity-20 p-1 rounded-lg"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description */}
                    <div className="notched-input-group">
                      <label className="notched-label">Description du service ou produit *</label>
                      <input
                        type="text"
                        required
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.id, "description", e.target.value)
                        }
                        placeholder="Ex: Audit réseau et sécurité"
                        className="notched-input"
                      />
                    </div>

                    {/* Quantité, Prix Unitaire et Total Ligne */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                      {/* Quantité */}
                      <div className="notched-input-group">
                        <label className="notched-label">Quantité *</label>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          required
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="1"
                          className="notched-input"
                        />
                      </div>

                      {/* Prix Unitaire */}
                      <div className="notched-input-group">
                        <label className="notched-label">Prix Unitaire ({currency === "USD" ? "$" : "FC"}) *</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          required
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "unitPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="notched-input font-bold text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Total de la ligne calculé automatiquement */}
                      <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-3 py-2 bg-white dark:bg-[#1E293B]/40 flex flex-col justify-center">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                          Total ligne HT
                        </span>
                        <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">
                          {formatMoney(lineTotal, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bouton Ajouter une ligne (bas de liste) */}
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#CBD5E1] dark:border-[#334155] text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-[#2563EB] transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une ligne de prestation</span>
            </button>
          </div>

          {/* SECTION 3 : Récapitulatif Financier (Sous-total, TVA 16%, Total TTC) */}
          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
              3. Récapitulatif Financier ({currency === "USD" ? "USD" : "CDF"})
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300">
                <span>Sous-total HT</span>
                <span className="font-semibold text-neutral-900 dark:text-white text-sm">
                  {formatMoney(totals.subtotal, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300">
                <span>TVA (16%)</span>
                <span className="font-semibold text-neutral-900 dark:text-white text-sm">
                  +{formatMoney(totals.vatTotal, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-700 text-sm">
                <span className="font-bold text-[#0F172A] dark:text-white">
                  Total TTC à payer
                </span>
                <span className="text-base font-extrabold text-[#2563EB] dark:text-[#60A5FA]">
                  {formatMoney(totals.total, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* BOUTONS D'ACTION : Sauvegarder comme brouillon / Envoyer */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="flex-1 py-3 px-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-neutral-500" />
              <span>Sauvegarder comme brouillon</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("sent")}
              className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer la facture</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VOLET DROIT : Aperçu Facture Direct (Feuille A4)          */}
        {/* ======================================================== */}
        {showPreview && (
          <div
            className={cn(
              "flex-1 bg-[#F8FAFC] dark:bg-[#090D16] border-t xl:border-t-0 xl:border-l border-[#E2E8F0] dark:border-[#1E293B] p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-4",
              mobileTab !== "preview" && "hidden xl:block"
            )}
          >
            <div className="flex items-center justify-between max-w-xl mx-auto">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                Aperçu du document
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-[#60A5FA]">
                Devise : {currency}
              </span>
            </div>

            {/* FEUILLE BLANCHE DE FACTURE (A4) */}
            <div className="bg-white text-neutral-800 rounded-2xl shadow-paper border border-[#E2E8F0] dark:border-neutral-700 p-4 sm:p-8 space-y-6 max-w-xl mx-auto text-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0F172A] tracking-wider">
                    FACTURE
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-neutral-400">Réf :</span>
                    <span className="font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px]">
                      FAC-AUTO
                    </span>
                  </div>
                </div>

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#064E3B] text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                  <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-neutral-100 text-[11px]">
                <div>
                  <span className="text-neutral-400 font-semibold block mb-0.5">
                    Émetteur :
                  </span>
                  <span className="font-bold text-neutral-900 block truncate">
                    {company.name}
                  </span>
                  <span className="text-neutral-500 block truncate">
                    {company.email}
                  </span>
                  <span className="text-neutral-400 block mt-0.5 truncate">
                    {company.address}, {company.city}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 font-semibold block mb-0.5">
                    Client :
                  </span>
                  <span className="font-bold text-neutral-900 block truncate">
                    {selectedClient?.name || "Client"}
                  </span>
                  <span className="text-neutral-500 block truncate">
                    {selectedClient?.email}
                  </span>
                  <span className="text-neutral-400 block mt-0.5 truncate">
                    {selectedClient?.address || "Kinshasa, RDC"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] pt-1">
                <div>
                  <span className="text-neutral-400 font-semibold block mb-0.5">
                    Date d&apos;émission :
                  </span>
                  <span className="font-semibold text-neutral-800">
                    {formatDate(issueDate)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 font-semibold block mb-0.5">
                    Date d&apos;échéance :
                  </span>
                  <span className="font-semibold text-neutral-800">
                    {formatDate(dueDate)}
                  </span>
                </div>
              </div>

              {/* Tableau Articles */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-neutral-900 block mb-2">
                  Prestations facturées :
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400 font-semibold">
                        <th className="py-2">Description</th>
                        <th className="py-2 text-center">Qté</th>
                        <th className="py-2 text-right">P.U ({currency === "USD" ? "$" : "FC"})</th>
                        <th className="py-2 text-right">Total HT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {items.map((i) => (
                        <tr key={i.id}>
                          <td className="py-2.5 font-medium text-neutral-800">
                            {i.description || "Article sans libellé"}
                          </td>
                          <td className="py-2.5 text-center text-neutral-600">
                            {i.quantity}
                          </td>
                          <td className="py-2.5 text-right font-medium text-neutral-700">
                            {formatMoney(i.unitPrice, currency)}
                          </td>
                          <td className="py-2.5 text-right font-bold text-neutral-900">
                            {formatMoney(Math.round(i.quantity * i.unitPrice), currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totaux */}
              <div className="pt-4 border-t border-neutral-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Sous-total HT</span>
                  <span className="font-semibold text-neutral-800">
                    {formatMoney(totals.subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>TVA (16%)</span>
                  <span className="font-semibold text-neutral-800">
                    +{formatMoney(totals.vatTotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-900">
                  <span>Total TTC</span>
                  <span className="text-[#2563EB]">{formatMoney(totals.total, currency)}</span>
                </div>
              </div>

              {/* Note */}
              <div className="p-2.5 rounded-xl bg-neutral-50 text-[10px] text-neutral-500 italic">
                Note : {notes}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
