"use client";

import React from "react";
import {
  Sparkles,
  Check,
  FileText,
  Users,
  Building2,
  Download,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BillingPage() {
  const mounted = useHydrated();
  const { invoices, clients, companies, activeCompanyId } = useAppStore();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const invoicesThisMonth = invoices.filter(
    (i) => i.companyId === activeCompanyId && i.createdAt.startsWith(currentMonth)
  ).length;

  const clientsCount = clients.filter((c) => c.companyId === activeCompanyId).length;

  if (!mounted) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto bg-white dark:bg-[#0F172A] transition-colors">
      {/* Fil d'Ariane & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
            <span>Paramètres</span>
            <span>&gt;</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
              Formule & Utilisation
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
            <span>Accès 100% Gratuit & Illimité</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              Actif
            </span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Toutes les fonctionnalités de facturation CDF et USD sont offertes gratuitement sans limite.
          </p>
        </div>
      </div>

      {/* Bannière "100% Gratuit" */}
      <div className="border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-emerald-50/70 to-blue-50/50 dark:from-emerald-950/20 dark:to-blue-950/20 shadow-2xs space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>Aucun abonnement requis — Libre et gratuit pour tous les entrepreneurs</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
          Sept-facture est conçu pour faciliter le commerce et la facturation en RDC. Vous profitez de toutes les options avancées (multi-entreprises, export PDF officiel, suivi Mobile Money, calcul automatique TVA à 16%) sans jamais devoir payer.
        </p>
      </div>

      {/* Jauges d'utilisation illimitée */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-200">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
              Factures ce mois-ci
            </span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {invoicesThisMonth} (Illimité)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div className="h-full bg-[#2563EB] rounded-full w-full" />
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ Aucune restriction de volume
          </p>
        </div>

        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-200">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Clients enregistrés
            </span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {clientsCount} (Illimité)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full" />
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ Carnet d&apos;adresses illimité
          </p>
        </div>

        <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-200">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Entreprises actives
            </span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {companies.length} (Illimité)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full w-full" />
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ Multi-sociétés sans limitation
          </p>
        </div>
      </div>

      {/* Liste des fonctionnalités incluses sans frais */}
      <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Fonctionnalités complètes incluses sans frais</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {[
            "Facturation bidevise (Franc Congolais CDF & Dollar USD)",
            "Téléchargement direct des factures en PDF haute définition",
            "Calcul automatique légal de la TVA à 16%",
            "Gestion multi-entreprises avec isolation des données",
            "Enregistrement des paiements (Mobile Money, virements, espèces)",
            "Tableau de bord financier avec indicateurs et taux de recouvrement",
            "Numérotation séquentielle automatique (FAC-2026-XXXX)",
            "Sans aucun filigrane ni publicité",
            "Mode sombre / clair synchronisé",
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300"
            >
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
