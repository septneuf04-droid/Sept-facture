"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Trash2,
  Plus,
  Save,
  Flower2,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getInvoiceById, updateInvoiceData } from "@/lib/data/invoices";
import { getClients } from "@/lib/data/clients";
import { formatMoney, calculateInvoiceTotals, Currency } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { InvoiceDetailSkeleton } from "@/components/ui/Skeleton";

interface FormItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  const [mounted, setMounted] = useState(false);
  const companyClients = getClients();
  const invoice = getInvoiceById(invoiceId);

  const [clientId, setClientId] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("CDF");
  const [issueDate, setIssueDate] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [invoiceTitle, setInvoiceTitle] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [items, setItems] = useState<FormItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (invoice) {
      setClientId(invoice.clientId);
      setCurrency(invoice.currency || "CDF");
      setIssueDate(invoice.issueDate);
      setDueDate(invoice.dueDate);
      setInvoiceTitle(invoice.title);
      setNotes(invoice.notes || "");
      setItems(
        invoice.items.map((i) => ({
          id: i.id,
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          vatRate: i.vatRate || 16,
        }))
      );
    }
  }, [invoice]);

  if (!mounted || !invoice) {
    return <InvoiceDetailSkeleton />;
  }

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        vatRate: 16,
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

  const totals = calculateInvoiceTotals(items, 16);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    const res = updateInvoiceData(invoice.id, {
      clientId,
      currency,
      title: invoiceTitle || items[0]?.description || "Facture",
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

    if (res.success) {
      toast.success("Facture mise à jour avec succès !");
      router.push(`/invoices/${invoice.id}`);
    } else {
      toast.error(res.error || "Erreur lors de la modification");
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto bg-white dark:bg-[#0F172A] transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            href={`/invoices/${invoice.id}`}
            className="w-9 h-9 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-0.5">
              <Link href="/invoices">Factures</Link>
              <span>&gt;</span>
              <Link href={`/invoices/${invoice.id}`}>{invoice.number || "Détail"}</Link>
              <span>&gt;</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Modifier</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Modifier la Facture {invoice.number || "Brouillon"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/invoices/${invoice.id}`}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 shadow-2xs"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* SECTION 1 : Client & Dates */}
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
            1. Client & Dates
          </h2>

          <div className="notched-input-group">
            <label className="notched-label">Client Destinataire *</label>
            <div className="relative flex items-center">
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Flower2 className="w-3 h-3 text-emerald-200" />
              </div>
              <select
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="notched-input-group">
              <label className="notched-label">Date d&apos;émission *</label>
              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="notched-input !pl-11"
                />
              </div>
            </div>

            <div className="notched-input-group">
              <label className="notched-label">Date d&apos;échéance *</label>
              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="notched-input !pl-11"
                />
              </div>
            </div>
          </div>

          <div className="notched-input-group">
            <label className="notched-label">Objet de la facture</label>
            <input
              type="text"
              value={invoiceTitle}
              onChange={(e) => setInvoiceTitle(e.target.value)}
              placeholder="Ex: Prestation de services informatiques"
              className="notched-input"
            />
          </div>
        </div>

        {/* SECTION 2 : Lignes de Facture */}
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
              2. Lignes d&apos;Articles
            </h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold hover:bg-blue-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une ligne</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const lineTotal = Math.round((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));

              return (
                <div
                  key={item.id}
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-3.5 sm:p-4 bg-[#F8FAFC] dark:bg-[#0F172A]/60 space-y-3 relative shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    <span>Ligne {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length <= 1}
                      className="text-neutral-400 hover:text-rose-600 disabled:opacity-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="notched-input-group">
                    <label className="notched-label">Description *</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="notched-input-group">
                      <label className="notched-label">Quantité *</label>
                      <input
                        type="number"
                        min="1"
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

                    <div className="notched-input-group">
                      <label className="notched-label">Prix Unitaire ({currency === "USD" ? "$" : "FC"}) *</label>
                      <input
                        type="number"
                        min="0"
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
                        className="notched-input font-bold"
                      />
                    </div>

                    <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-3 py-2 bg-white dark:bg-[#1E293B]/40 flex flex-col justify-center">
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                        Total HT
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
        </div>

        {/* SECTION 3 : Totaux */}
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-2 text-xs">
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
              Total TTC
            </span>
            <span className="text-base font-extrabold text-[#2563EB] dark:text-[#60A5FA]">
              {formatMoney(totals.total, currency)}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
