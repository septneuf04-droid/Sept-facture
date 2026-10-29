"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Receipt,
  User,
  ArrowLeftRight,
  Smartphone,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [activeCurrencyMock, setActiveCurrencyMock] = useState<"CDF" | "USD">("CDF");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ======================================================== */}
      {/* 1. NAVBAR / HEADER                                       */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h.01" />
                <path d="M17 17h.01" />
                <path d="M7 17h10" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-[#0F172A] tracking-tight">
                  Sept-facture
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-100">
                  RDC
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium -mt-0.5">
                Facturation & Finance
              </p>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-600">
            <a href="#features" className="hover:text-[#2563EB] transition-colors">
              Fonctionnalités
            </a>
            <a href="#features" className="hover:text-[#2563EB] transition-colors">
              Gestion & Devis
            </a>
            <a href="#conformite" className="hover:text-[#2563EB] flex items-center gap-1.5 transition-colors">
              <span>Conformité DGI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </a>
            <a href="#tarifs" className="hover:text-[#2563EB] transition-colors">
              Tarifs CDF/USD
            </a>
            <a href="#temoignages" className="hover:text-[#2563EB] transition-colors">
              Témoignages
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-semibold text-neutral-700 hover:text-[#0F172A] transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span>Créer un compte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-neutral-200 text-neutral-700"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-[#E2E8F0] bg-white p-4 space-y-3 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2 text-xs font-semibold text-neutral-600 pb-3 border-b border-neutral-100">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1">Fonctionnalités</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1">Gestion & Devis</a>
              <a href="#conformite" onClick={() => setMobileMenuOpen(false)} className="py-1 flex items-center justify-between">
                <span>Conformité DGI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </a>
              <a href="#tarifs" onClick={() => setMobileMenuOpen(false)} className="py-1">Tarifs CDF/USD</a>
              <a href="#temoignages" onClick={() => setMobileMenuOpen(false)} className="py-1">Témoignages</a>
            </nav>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-xs font-semibold text-neutral-700 border border-neutral-200 rounded-xl"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-xs font-bold bg-[#2563EB] text-white rounded-xl shadow-sm"
            >
              Créer un compte
            </Link>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="pt-10 sm:pt-14 pb-12 overflow-hidden bg-gradient-to-b from-blue-50/30 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          
          {/* Top Pill Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[#2563EB] text-xs font-semibold shadow-2xs">
            <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">✨</span>
            <span>Logiciel de Facturation Conforme RDC • DGI & NIF Validé</span>
          </div>

          {/* Headline avec soulignement CDF & USD */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.18] max-w-4xl mx-auto">
            Facturez en{" "}
            <span className="relative inline-block text-[#2563EB]">
              CDF
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-[#2563EB]/40"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 10 Q25 20, 50 10 T100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            et{" "}
            <span className="relative inline-block text-[#10B981]">
              USD
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-[#10B981]/40"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 10 Q25 20, 50 10 T100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            en
            <br className="hidden sm:inline" /> toute simplicité
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            La solution tout-en-un conçue pour les PME, startups et freelances congolais.
            <br className="hidden sm:inline" />
            Émission de factures bidevises certifiées, calcul automatique de la TVA à 16%,
            <br className="hidden sm:inline" />
            gestion commerciale simplifiée et suivi rigoureux des échéances.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
            >
              <span>Démarrer gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-700 transition-colors shadow-2xs"
            >
              <User className="w-4 h-4 text-neutral-500" />
              <span>Accéder à mon espace</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-1 flex items-center justify-center gap-4 text-[11px] text-neutral-500 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Sans carte bancaire requise</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Conforme loi de finances RDC</span>
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. PRODUCT MOCKUP WINDOW (MAC / DASHBOARD PREVIEW)       */}
        {/* ======================================================== */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="rounded-3xl border border-[#CBD5E1] bg-[#0A0F1D] p-2 sm:p-2.5 shadow-2xl">
            
            {/* Top Mac Window Header */}
            <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-neutral-800 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="ml-3 font-mono text-[11px] text-neutral-400 hidden sm:inline">
                  sept-facture.cd/app/dashboard
                </span>
              </div>

              {/* Taux BCC du jour & Currency Switcher */}
              <div className="flex items-center gap-2.5">
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E293B] border border-neutral-700/60 text-[11px] text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Taux BCC du jour :</span>
                  <strong className="text-white font-mono">1 USD = 2 850,00 CDF</strong>
                </div>

                <div className="flex p-0.5 rounded-lg bg-[#1E293B] border border-neutral-700/60 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveCurrencyMock("CDF")}
                    className={`px-2 py-0.5 rounded transition-colors ${activeCurrencyMock === "CDF" ? "bg-[#2563EB] text-white" : "text-neutral-400 hover:text-white"}`}
                  >
                    CDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCurrencyMock("USD")}
                    className={`px-2 py-0.5 rounded transition-colors ${activeCurrencyMock === "USD" ? "bg-[#2563EB] text-white" : "text-neutral-400 hover:text-white"}`}
                  >
                    USD
                  </button>
                </div>
              </div>
            </div>

            {/* Inner Dashboard Canvas (White Sheet) */}
            <div className="bg-white text-neutral-800 p-4 sm:p-6 lg:p-7 rounded-2xl space-y-5">
              
              {/* 3 KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* KPI 1 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    CHIFFRE D&apos;AFFAIRES (MOIS)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-black text-neutral-900 font-mono">
                      $14,250.00
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                      +18.4%
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500">
                    = 40 612 500 CDF
                  </p>
                </div>

                {/* KPI 2 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    TAUX DE RECOUVREMENT
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-black text-neutral-900 font-mono">
                      94.2%
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200 text-[#2563EB]">
                      Suivi actif
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Factures clients à échéance
                  </p>
                </div>

                {/* KPI 3 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    TVA 16% COLLECTÉE (DGI)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg sm:text-xl font-black text-neutral-900 font-mono">
                      6 498 000 CDF
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2563EB]">
                      Déclaration prête
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Bordereau conforme DGI
                  </p>
                </div>
              </div>

              {/* Certified Invoice Preview Card */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 space-y-4 shadow-sm text-xs">
                
                {/* Header Facture */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs">
                      FACTURE ASF-2026-089
                    </span>
                    <span className="font-bold text-neutral-800">
                      Client : Vodacom Congo (RDC) SA
                    </span>
                    <span className="text-neutral-400 font-mono text-[11px]">
                      NIF: A0701234T
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-semibold self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    <span>Facture Émise • En attente de règlement</span>
                  </span>
                </div>

                {/* Items Rows */}
                <div className="space-y-2 py-1">
                  <div className="flex justify-between items-center py-1.5 border-b border-neutral-100 font-medium">
                    <span className="text-neutral-800">
                      Prestation Consulting Cloud & Intégration
                    </span>
                    <span className="font-mono font-bold text-neutral-900">
                      $2,500.00 / 7 125 000 CDF
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-neutral-100 font-medium">
                    <span className="text-neutral-800">
                      Maintenance Mensuelle Infrastructures
                    </span>
                    <span className="font-mono font-bold text-neutral-900">
                      $1,000.00 / 2 850 000 CDF
                    </span>
                  </div>
                </div>

                {/* Invoice Footer Details & Totals */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
                  <div className="space-y-1 text-[11px] text-neutral-500">
                    <p>Conditions : Échéance à réception • Mentions RCCM & NIF conformes</p>
                    <p className="font-medium text-neutral-700">Suivi échéancier : J-15</p>
                  </div>

                  <div className="w-full sm:w-80 p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 text-right font-mono">
                    <div className="flex justify-between text-neutral-600 text-[11px]">
                      <span>Total Hors Taxe (HT) :</span>
                      <span className="font-bold text-neutral-900">$3,500.00</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 text-[11px]">
                      <span>TVA RDC (16%) :</span>
                      <span className="font-bold text-[#2563EB]">+$560.00</span>
                    </div>
                    <div className="flex justify-between text-neutral-900 font-black text-sm pt-1 border-t border-neutral-200">
                      <span>Total TTC (USD) :</span>
                      <span className="text-emerald-600">$4,060.00</span>
                    </div>
                    <div className="text-right pt-1">
                      <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                        Équivalent légal CDF : 11 571 000 CDF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. PARTNERS / MOBILE MONEY & BANQUES RDC                 */}
      {/* ======================================================== */}
      <section className="py-10 border-y border-[#E2E8F0] bg-white text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              CONÇU POUR LES STANDARDS COMMERCIAUX & FISCAUX EN RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
            </p>
            <p className="text-[11px] text-[#2563EB] font-medium">
              (À venir : Intégrations passerelles Mobile Money & Banques RDC (en cours de développement))
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap pt-2 text-xs font-semibold text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span className="text-neutral-400">•</span>
              <span>Vodacom M-Pesa</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-neutral-400">•</span>
              <span>Airtel Money</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-neutral-400">•</span>
              <span>Orange Money</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-neutral-400">•</span>
              <span>Rawbank Illico Cash</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-neutral-400">•</span>
              <span>Equity BCDC</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-neutral-400">•</span>
              <span>Ecobank RDC</span>
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FEATURES / PILIERS FONDAMENTAUX                       */}
      {/* ======================================================== */}
      <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-bold uppercase tracking-wider">
              PILIERS FONDAMENTAUX
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Tout ce qu&apos;exige la gestion financière en
              <br />
              RDC
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Oubliez les fichiers Excel complexes. Gérez vos devis, factures d&apos;acompte et quittances
              <br className="hidden sm:inline" />
              dans un environnement sécurisé et conforme.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 hover:border-blue-200 transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Bidevise Natif CDF & USD
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Basculez vos devis et factures entre Franc Congolais (arrondi légal sans décimales) et Dollar US au taux de change officiel de la BCC ou personnalisé au quotidien.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-100">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[11px] font-medium text-[#2563EB]">
                  Taux temps réel & archivage
                </span>
                <Link href="/signup" className="text-neutral-500 hover:text-[#2563EB] font-semibold flex items-center gap-1">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 hover:border-emerald-200 transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Suivi des Règlements & Échéances
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Enregistrez manuellement les règlements clients, éditez des quittances et suivez vos encours. Passerelles directes Mobile Money & banques en cours d&apos;intégration.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-100">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[11px] font-medium text-emerald-600">
                  Passerelles bientôt disponibles
                </span>
                <Link href="/signup" className="text-neutral-500 hover:text-emerald-600 font-semibold flex items-center gap-1">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div id="conformite" className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 hover:border-indigo-200 transition-all">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Conformité Fiscale & DGI
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Intégration systématique du NIF, RCCM, Id. Nationale et calcul légal de la TVA à 16% avec mentions obligatoires prêtes pour l&apos;audit et contrôles fiscaux.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-100">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[11px] font-medium text-[#2563EB]">
                  Conforme OHADA & DGI
                </span>
                <Link href="/signup" className="text-neutral-500 hover:text-indigo-600 font-semibold flex items-center gap-1">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. BIG CALL TO ACTION BANNER                             */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-[#2563EB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Prêt à moderniser votre facturation en RDC ?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Rejoignez plus de 1 200 entreprises kins-shasa, katangaises et de tout le pays
            <br className="hidden sm:inline" />
            qui émettent des factures certifiées sans perte de temps.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-[#2563EB] hover:bg-neutral-50 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              Démarrer gratuitement
            </Link>
            <a
              href="https://wa.me/243976208355?text=Bonjour%20Sept-facture,%20je%20souhaite%20des%20informations"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current text-emerald-300" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Contacter sur WhatsApp (0976208355)</span>
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FULL DARK NAVY FOOTER                                 */}
      {/* ======================================================== */}
      <footer className="bg-[#0A0F1D] text-neutral-300 pt-16 pb-8 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h.01" />
                    <path d="M17 17h.01" />
                    <path d="M7 17h10" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-white tracking-tight">
                    Sept-facture
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-900/60 text-[#60A5FA]">
                    RDC
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                La solution de gestion commerciale de référence en République Démocratique du Congo.
              </p>

              <div className="space-y-2 text-xs text-neutral-400 pt-1">
                <p className="flex items-start gap-2">
                  <span>📍</span>
                  <span>Route Kazembe, Péniel, Kolwezi (Lualaba, RDC)</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>💬</span>
                  <a
                    href="https://wa.me/243976208355?text=Bonjour%20Sept-facture"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>WhatsApp :</span>
                    <span className="font-semibold text-white">+243 976 208 355</span>
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono">0976208355</span>
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span>✉️</span>
                  <a
                    href="mailto:septneuf04@gmail.com"
                    className="hover:text-white transition-colors font-medium"
                  >
                    septneuf04@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Col 2: Produit */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                PRODUIT
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><Link href="/signup" className="hover:text-white transition-colors">Facturation Bidevise</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Modèle TVA RDC 16%</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Suivi des Règlements (Mobile Money à venir)</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Exports Comptables DGI</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Tarifs PME & Grandes Entreprises</Link></li>
              </ul>
            </div>

            {/* Col 3: Conformité RDC */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                CONFORMITÉ RDC
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Guide DGI : Mentions de factures</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Calcul TVA & Centimes CDF</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Suivi des Règlements (Mobile Money à venir)</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Sécurité des données & Sauvegardes</Link></li>
              </ul>
            </div>

            {/* Col 4: Statut Plateforme */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                DISPONIBILITÉ PLATEFORME
              </h4>
              <div className="p-3.5 rounded-xl border border-neutral-800 bg-[#0F172A]/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[11px]">Disponibilité Kolwezi & RDC:</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    100% Opérationnel
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                  <span className="text-neutral-400 text-[11px]">Taux BCC synchronisé:</span>
                  <span className="text-white font-mono font-medium text-[11px]">Quotidien</span>
                </div>
              </div>
            </div>

          </div>

          {/* Legal Bar */}
          <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p>© 2026 Sept-facture RDC. Tous droits réservés.</p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/terms" className="hover:text-neutral-300 transition-colors">
                Conditions Générales (CGU)
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
                Politique de Confidentialité
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-neutral-300 transition-colors">
                Mentions Légales RDC
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Quick Contact Button */}
      <a
        href="https://wa.me/243976208355?text=Bonjour%20Sept-facture,%20je%20souhaite%20des%20informations"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp au 0976208355"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 active:scale-95 group font-medium text-xs sm:text-sm"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="hidden sm:inline">Assistance WhatsApp</span>
        <span className="sm:hidden">WhatsApp</span>
      </a>
    </div>
  );
}
