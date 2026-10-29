"use client";

import React, { useState } from "react";
import { Invoice, Company, Client } from "@/lib/types";
import {
  generateInvoiceWhatsAppMessage,
  getWhatsAppInvoiceUrl,
  normalizePhoneForWhatsApp,
} from "@/lib/whatsapp";
import { X, Copy, Check, MessageSquare, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface WhatsAppInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  company: Company;
  client?: Client | null;
  onInvoiceSent?: () => void;
}

export function WhatsAppInvoiceModal({
  isOpen,
  onClose,
  invoice,
  company,
  client,
  onInvoiceSent,
}: WhatsAppInvoiceModalProps) {
  const [phone, setPhone] = useState(client?.phone || "");
  const [copied, setCopied] = useState(false);
  const [markAsSent, setMarkAsSent] = useState(invoice.status === "draft");

  if (!isOpen) return null;

  const normalizedPhone = normalizePhoneForWhatsApp(phone);
  const messagePreview = generateInvoiceWhatsAppMessage({ invoice, company, client });

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messagePreview);
      setCopied(true);
      toast.success("Texte copié dans le presse-papier !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier automatiquement");
    }
  };

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppInvoiceUrl({
      phone,
      invoice,
      company,
      client,
    });

    if (markAsSent && onInvoiceSent) {
      onInvoiceSent();
    }

    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Discussion WhatsApp ouverte !");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-neutral-700 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 z-10">
        {/* En-tête de la modale */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#25D366] flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-white">
                Envoyer par WhatsApp
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {invoice.number ? `Facture ${invoice.number}` : "Facture Brouillon"} • {client?.name || "Client"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Saisie du Numéro du Destinataire */}
        <div className="space-y-1.5">
          <div className="notched-input-group">
            <label htmlFor="whatsapp-recipient-phone" className="notched-label">
              Numéro WhatsApp du destinataire *
            </label>
            <input
              id="whatsapp-recipient-phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 0976208355 ou +243 976 208 355"
              className="notched-input font-medium text-neutral-900 dark:text-white"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
            <span>Format RDC accepté (081..., 097..., 099...)</span>
            {normalizedPhone && (
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                +{normalizedPhone}
              </span>
            )}
          </div>
        </div>

        {/* Aperçu Bulle de Discussion WhatsApp */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Aperçu du message formaté :</span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copié !" : "Copier le texte"}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#DCF8C6]/30 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-xs text-neutral-800 dark:text-neutral-200 font-mono whitespace-pre-wrap leading-relaxed shadow-2xs max-h-48 overflow-y-auto">
            {messagePreview}
          </div>
        </div>

        {/* Option pour marquer comme transmise */}
        {invoice.status === "draft" && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs">
            <input
              id="mark-sent-check"
              type="checkbox"
              checked={markAsSent}
              onChange={(e) => setMarkAsSent(e.target.checked)}
              className="rounded border-neutral-300 text-[#2563EB] focus:ring-[#2563EB]"
            />
            <label htmlFor="mark-sent-check" className="text-neutral-700 dark:text-neutral-300 select-none cursor-pointer">
              Générer le numéro officiel et marquer la facture comme <strong>Envoyée</strong>
            </label>
          </div>
        )}

        {/* Boutons d'Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Ouvrir dans WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

