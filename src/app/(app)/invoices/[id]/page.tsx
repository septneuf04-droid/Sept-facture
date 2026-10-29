"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Send,
  Trash2,
  Flower2,
  Check,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Edit,
  RefreshCw,
  ChevronDown,
  Mail,
  Printer,
  Loader2,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAppStore } from "@/lib/store";
import { getInvoiceById, updateInvoiceStatusData, deleteInvoiceData } from "@/lib/data/invoices";
import { getActiveCompany } from "@/lib/data/companies";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { InvoiceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useHydrated } from "@/lib/useHydrated";
import { downloadInvoicePdf } from "@/lib/pdf";
import { InvoiceDetailSkeleton } from "@/components/ui/Skeleton";
import { WhatsAppInvoiceModal } from "@/components/invoices/WhatsAppInvoiceModal";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  const mounted = useHydrated();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const { invoices } = useAppStore();

  const company = getActiveCompany();
  const invoice = getInvoiceById(invoiceId);

  if (!mounted || !invoice) {
    return <InvoiceDetailSkeleton />;
  }

  const client = invoice.client;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    toast.info("Génération du document PDF...");
    try {
      const filename = invoice.number ? `facture-${invoice.number}` : `facture-brouillon-${invoice.id}`;
      const success = await downloadInvoicePdf("invoice-document", filename);
      if (success) {
        toast.success("Facture PDF téléchargée !");
      } else {
        toast.error("Échec de la génération PDF");
      }
    } catch {
      toast.error("Une erreur est survenue lors du téléchargement");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleChangeStatus = (newStatus: InvoiceStatus) => {
    const res = updateInvoiceStatusData(invoice.id, newStatus);
    if (res.success) {
      toast.success(`Statut mis à jour : ${newStatus}`);
      setShowStatusDropdown(false);
    } else {
      toast.error(res.error || "Erreur lors de la mise à jour");
    }
  };

  const handleConfirmDelete = () => {
    deleteInvoiceData(invoice.id);
    toast.success("Facture supprimée");
    router.push("/invoices");
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto bg-white dark:bg-[#0F172A] transition-colors">
      {/* Fil d'Ariane & Barre d'actions supérieure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="w-9 h-9 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors shadow-2xs"
            title="Retour à la liste des factures"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-0.5">
              <Link href="/invoices" className="hover:text-neutral-700 dark:hover:text-neutral-200">
                Factures
              </Link>
              <span>&gt;</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
                {invoice.number || "Détail Brouillon"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2.5">
              <span>{invoice.number || "Facture Brouillon"}</span>
              <StatusBadge status={invoice.status} />
            </h1>
          </div>
        </div>

        {/* 3 Boutons d'Action requis : Changer Statut (Popover inline), Modifier, Supprimer (Inline confirm) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Menu déroulant Popover inline pour le statut */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs transition-colors"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] transition-transform", showStatusDropdown && "rotate-180")} />
              <span>Changer le statut</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {showStatusDropdown && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowStatusDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-1.5 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800/80">
                    Nouveau statut
                  </div>
                  {[
                    { id: "draft", desc: "Non encore émise" },
                    { id: "sent", desc: "Transmise au client" },
                    { id: "paid", desc: "Règlement intégral" },
                    { id: "overdue", desc: "Échéance dépassée" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleChangeStatus(s.id as InvoiceStatus)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors",
                        invoice.status === s.id
                          ? "bg-blue-50 dark:bg-blue-950/60 font-bold text-[#2563EB] dark:text-[#60A5FA]"
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <StatusBadge status={s.id as InvoiceStatus} size="sm" />
                        <span className="text-[11px] text-neutral-400">{s.desc}</span>
                      </div>
                      {invoice.status === s.id && (
                        <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bouton Envoyer par WhatsApp */}
          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-sm shadow-emerald-500/25 active:scale-95 transition-all"
            title="Transmettre la facture au client via WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp</span>
          </button>

          {/* Bouton Télécharger PDF (Client-side A4 direct) */}
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-60"
            title="Télécharger la facture en document PDF officiel"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingPdf ? "Création..." : "Télécharger PDF"}</span>
          </button>

          {/* Bouton Imprimer */}
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs transition-colors"
            title="Imprimer directement"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>Imprimer</span>
          </button>

          {/* Bouton Modifier (formulaire pré-rempli) */}
          <Link
            href={`/invoices/${invoice.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Modifier</span>
          </Link>

          {/* Bouton Supprimer avec confirmation inline professionnelle */}
          {isDeleting ? (
            <div className="inline-flex items-center gap-1.5 animate-in fade-in duration-150">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmer</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="px-2.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsDeleting(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-[#1E293B] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer</span>
            </button>
          )}
        </div>
      </div>

      {/* FEUILLE DE FACTURE BLANCHE OFFICIELLE (Style Dashboard A4) */}
      <div
        id="invoice-document"
        className="max-w-4xl mx-auto bg-white text-neutral-800 rounded-2xl shadow-paper border border-[#E2E8F0] dark:border-neutral-700 p-6 sm:p-10 space-y-8 text-xs"
      >
        {/* Entête du document */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-neutral-100 dark:border-neutral-200">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-wider mb-2">
              FACTURE
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-medium">Numéro :</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                  {invoice.number || "BROUILLON"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-medium">Statut actuel :</span>
                <StatusBadge status={invoice.status} size="sm" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
              <Flower2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#0F172A]">
                {company.name}
              </div>
              <div className="text-xs text-neutral-500">
                {company.email}
              </div>
            </div>
          </div>
        </div>

        {/* Coordonnées Émetteur & Client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Émetteur */}
          <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
              Émis par :
            </span>
            <div className="font-bold text-[#0F172A] text-sm">
              {company.name}
            </div>
            <div className="text-neutral-600">{company.address}</div>
            <div className="text-neutral-600">{company.city}</div>
            <div className="text-neutral-500 pt-1 font-mono text-[11px]">
              Tél: {company.phone} • Email: {company.email}
            </div>
          </div>

          {/* Destinataire */}
          <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
              Facturé à :
            </span>
            <div className="font-bold text-[#0F172A] text-sm">
              {client?.name || "Client non assigné"}
            </div>
            <div className="text-neutral-600">{client?.address || "Adresse non renseignée"}</div>
            <div className="text-neutral-600">{client?.city || "Ville non renseignée"}</div>
            <div className="text-neutral-500 pt-1 font-mono text-[11px]">
              Tél: {client?.phone || "-"} • Email: {client?.email || "-"}
            </div>
          </div>
        </div>

        {/* Dates au format jour/mois/année */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-blue-50/40 border border-blue-100/60 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
              Date d&apos;émission
            </span>
            <span className="font-bold text-neutral-900 text-sm">
              {formatDate(invoice.issueDate)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
              Date d&apos;échéance
            </span>
            <span className="font-bold text-neutral-900 text-sm">
              {formatDate(invoice.dueDate)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
              Devise
            </span>
            <span className="font-bold text-neutral-900 text-sm">
              {invoice.currency === "USD" ? "Dollar Américain (USD / $)" : "Franc Congolais (CDF / FC)"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
              Taux TVA
            </span>
            <span className="font-bold text-neutral-900 text-sm">
              16%
            </span>
          </div>
        </div>

        {/* Tableau complet avec toutes les lignes de la facture */}
        <div>
          <h2 className="text-sm font-bold text-[#0F172A] mb-3">
            Détail des Lignes de Facture
          </h2>

          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold text-[11px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Description de la prestation</th>
                  <th className="py-3 px-4 text-center">Quantité</th>
                  <th className="py-3 px-4 text-right">Prix Unitaire HT</th>
                  <th className="py-3 px-4 text-right">Total Ligne HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {invoice.items.map((item, idx) => {
                  const lineTotal = Math.round(item.quantity * item.unitPrice);
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/50">
                      <td className="py-3.5 px-4 font-mono text-neutral-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-900">
                        {item.description}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-neutral-700">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-neutral-700">
                        {formatMoney(item.unitPrice, invoice.currency || "CDF")}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-900">
                        {formatMoney(lineTotal, invoice.currency || "CDF")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Récapitulatif : Sous-total, TVA 16%, Total TTC */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-neutral-200">
          <div className="max-w-sm space-y-1.5 text-xs text-neutral-500">
            <span className="font-bold text-neutral-700 block">Notes & Conditions :</span>
            <p className="italic">
              {invoice.notes || "Paiement exigible sous 30 jours à réception de facture par virement bancaire ou mobile money."}
            </p>
          </div>

          <div className="w-full sm:w-72 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Sous-total HT :</span>
              <span className="font-semibold text-neutral-900">
                {formatMoney(invoice.subtotal, invoice.currency || "CDF")}
              </span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>TVA (16%) :</span>
              <span className="font-semibold text-neutral-900">
                +{formatMoney(invoice.vatTotal, invoice.currency || "CDF")}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-neutral-300 text-sm font-extrabold text-[#0F172A]">
              <span>Total TTC :</span>
              <span className="text-[#2563EB]">
                {formatMoney(invoice.total, invoice.currency || "CDF")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modale d'envoi WhatsApp */}
      <WhatsAppInvoiceModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        invoice={invoice}
        company={company}
        client={client}
        onInvoiceSent={() => {
          if (invoice.status === "draft") {
            handleChangeStatus("sent");
          }
        }}
      />
    </div>
  );
}
