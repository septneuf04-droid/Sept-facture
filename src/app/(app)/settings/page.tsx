"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  Upload,
  Sparkles,
  RotateCcw,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  Plus,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getActiveCompany, updateCompanyData } from "@/lib/data/companies";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useHydrated } from "@/lib/useHydrated";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsPage() {
  const mounted = useHydrated();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddingNewCompany, setIsAddingNewCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyCity, setNewCompanyCity] = useState("Kolwezi");
  const [newCompanyCurrency, setNewCompanyCurrency] = useState<"USD" | "CDF">("USD");

  const { companies, activeCompanyId, setActiveCompanyId, addCompany, resetToMock, hydrateFromSupabase } = useAppStore();

  const company = getActiveCompany();

  const [companyName, setCompanyName] = useState(company.name);
  const [city, setCity] = useState(company.city);
  const [address, setAddress] = useState(company.address);
  const [phone, setPhone] = useState(company.phone);
  const [email, setEmail] = useState(company.email);
  const [nif, setNif] = useState(company.nif);
  const [rccm, setRccm] = useState(company.rccm);
  const [idNat, setIdNat] = useState(company.idNat);
  const [exchangeRate, setExchangeRate] = useState(company.exchangeRate.toString());
  const [defaultCurrency, setDefaultCurrency] = useState(company.defaultCurrency);
  const [vatRate, setVatRate] = useState(company.defaultVatRate.toString());
  const [prefix, setPrefix] = useState(company.invoicePrefix);
  const [paymentDays, setPaymentDays] = useState(company.paymentTermsDays.toString());

  useEffect(() => {
    setCompanyName(company.name);
    setCity(company.city);
    setAddress(company.address);
    setPhone(company.phone);
    setEmail(company.email);
    setNif(company.nif);
    setRccm(company.rccm);
    setIdNat(company.idNat);
    setExchangeRate(company.exchangeRate.toString());
    setDefaultCurrency(company.defaultCurrency);
    setVatRate(company.defaultVatRate.toString());
    setPrefix(company.invoicePrefix);
    setPaymentDays(company.paymentTermsDays.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompanyId]);

  const supabaseActive = mounted ? isSupabaseConfigured() : false;

  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    try {
      await hydrateFromSupabase();
      toast.success("Synchronisation Supabase effectuée avec succès !");
    } catch {
      toast.error("Échec de la synchronisation Supabase");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateCompanyFromSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const success = addCompany({
      name: newCompanyName.trim(),
      tagline: "Entreprise commerciale",
      city: newCompanyCity,
      address: `${newCompanyCity}, RDC`,
      phone: "+243 81 000 0000",
      email: `contact@${newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.cd`,
      nif: "A" + Math.floor(1000000 + Math.random() * 9000000) + "X",
      rccm: "CD/KIN/RCCM/26-B-001",
      idNat: "01-83-N00000",
      defaultCurrency: newCompanyCurrency,
      exchangeRate: 2850,
      exchangeRateUpdatedAt: new Date().toISOString().split("T")[0],
      defaultVatRate: 16,
      invoicePrefix: newCompanyName.slice(0, 3).toUpperCase(),
      paymentTermsDays: 30,
    });

    if (success) {
      toast.success(`Entreprise "${newCompanyName.trim()}" créée avec succès !`);
      setNewCompanyName("");
      setIsAddingNewCompany(false);
    } else {
      toast.error("Erreur lors de la création de l'entreprise");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(exchangeRate) || 2850;
    const vatNum = parseFloat(vatRate) || 16;
    const daysNum = parseInt(paymentDays, 10) || 30;

    updateCompanyData(company.id, {
      name: companyName,
      city,
      address,
      phone,
      email,
      nif,
      rccm,
      idNat,
      exchangeRate: rateNum,
      exchangeRateUpdatedAt: new Date().toISOString().split("T")[0],
      defaultCurrency,
      defaultVatRate: vatNum,
      invoicePrefix: prefix.trim() || "FAC",
      paymentTermsDays: daysNum,
    });

    toast.success("Paramètres enregistrés avec succès !");
  };

  if (!mounted) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto bg-white dark:bg-[#0F172A] transition-colors"
    >
      {/* Fil d'Ariane & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
            <span>Configuration</span>
            <span>&gt;</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-semibold">{company.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Paramètres Entreprise
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Informations légales, fiscalité RDC et taux de change
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <Link
            href="/settings/billing"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
            <span>Mon Abonnement</span>
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Colonne Principale (2/3) */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* Identité de l'entreprise */}
          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 space-y-4 sm:space-y-5 shadow-2xs">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
              Identité Commerciale
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="notched-input-group">
                <label htmlFor="settings-company-name" className="notched-label">Nom Commercial *</label>
                <input
                  id="settings-company-name"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: Cometix SARL"
                  className="notched-input"
                />
              </div>

              <div className="notched-input-group">
                <label htmlFor="settings-city" className="notched-label">Ville *</label>
                <input
                  id="settings-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Kinshasa"
                  className="notched-input"
                />
              </div>
            </div>

            <div className="notched-input-group">
              <label htmlFor="settings-address" className="notched-label">Adresse Complète *</label>
              <input
                id="settings-address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Av. Colonel Mondjiba, Concession COTEX, Kinshasa"
                className="notched-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="notched-input-group">
                <label htmlFor="settings-phone" className="notched-label">Téléphone *</label>
                <input
                  id="settings-phone"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: +243 81 234 5678"
                  className="notched-input"
                />
              </div>

              <div className="notched-input-group">
                <label htmlFor="settings-email" className="notched-label">Email Professionnel *</label>
                <input
                  id="settings-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: contact@cometix.cd"
                  className="notched-input"
                />
              </div>
            </div>
          </div>

          {/* Identifiants Légaux RDC */}
          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 space-y-4 sm:space-y-5 shadow-2xs">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
              Identifiants Fiscaux & Réglementaires RDC
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div className="notched-input-group">
                <label htmlFor="settings-nif" className="notched-label">NIF (DGI) *</label>
                <input
                  id="settings-nif"
                  type="text"
                  required
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  placeholder="Ex: A0900123K"
                  className="notched-input font-mono"
                />
              </div>

              <div className="notched-input-group">
                <label htmlFor="settings-rccm" className="notched-label">RCCM *</label>
                <input
                  id="settings-rccm"
                  type="text"
                  required
                  value={rccm}
                  onChange={(e) => setRccm(e.target.value)}
                  placeholder="Ex: CD/KIN/RCCM/14-B-3200"
                  className="notched-input font-mono"
                />
              </div>

              <div className="notched-input-group">
                <label htmlFor="settings-idnat" className="notched-label">Id. Nat. *</label>
                <input
                  id="settings-idnat"
                  type="text"
                  required
                  value={idNat}
                  onChange={(e) => setIdNat(e.target.value)}
                  placeholder="Ex: 01-610-N38000F"
                  className="notched-input font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite (1/3) : Multi-entreprises, Taux de change & Facturation */}
        <div className="space-y-5 sm:space-y-6">
          {/* CARTE MULTI-ENTREPRISES & AJOUT DIRECT */}
          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA]">
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
                    Mes Entreprises ({companies.length})
                  </h2>
                  <p className="text-[10px] text-neutral-400">Gérez plusieurs structures</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                Illimité
              </span>
            </div>

            {!isAddingNewCompany ? (
              <div className="space-y-2.5">
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {companies.map((c) => (
                    <div
                      key={c.id}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs",
                        c.id === activeCompanyId
                          ? "bg-blue-50/80 dark:bg-blue-950/50 border-[#2563EB]/40 font-bold text-[#2563EB] dark:text-[#60A5FA]"
                          : "bg-[#F8FAFC] dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155] text-neutral-700 dark:text-neutral-300"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {c.name.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate">{c.name}</div>
                          <div className="text-[10px] text-neutral-400 font-normal truncate">
                            {c.city} • {c.defaultCurrency}
                          </div>
                        </div>
                      </div>

                      {c.id === activeCompanyId ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#2563EB] text-white text-[10px] font-bold">
                          Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCompanyId(c.id);
                            toast.info(`Bascule vers ${c.name}`);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-white dark:hover:bg-neutral-800 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 transition-colors"
                        >
                          Basculer
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingNewCompany(true)}
                  className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une nouvelle entreprise</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-blue-200/60 dark:border-blue-900/60">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCompany(false)}
                    className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-semibold"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Retour</span>
                  </button>
                  <span className="text-[11px] font-bold text-neutral-900 dark:text-white">Créer une entreprise</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-neutral-500">Nom commercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kinshasa Logistics SARL"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-neutral-500">Ville</label>
                    <select
                      value={newCompanyCity}
                      onChange={(e) => setNewCompanyCity(e.target.value)}
                      className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-2 py-1.5 text-xs text-neutral-900 dark:text-white"
                    >
                      <option value="Kolwezi">Kolwezi</option>
                      <option value="Kinshasa">Kinshasa</option>
                      <option value="Lubumbashi">Lubumbashi</option>
                      <option value="Goma">Goma</option>
                      <option value="Matadi">Matadi</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-neutral-500">Devise</label>
                    <select
                      value={newCompanyCurrency}
                      onChange={(e) => setNewCompanyCurrency(e.target.value as "USD" | "CDF")}
                      className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-2 py-1.5 text-xs text-neutral-900 dark:text-white font-semibold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="CDF">CDF (FC)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateCompanyFromSettings}
                  className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  Confirmer et créer
                </button>
              </div>
            )}
          </div>

          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
              Taux de Change & Devise
            </h2>

            <div className="notched-input-group">
              <label htmlFor="settings-currency" className="notched-label">Devise Principale</label>
              <select
                id="settings-currency"
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value as "USD" | "CDF")}
                className="notched-input bg-white dark:bg-[#0F172A] font-semibold"
              >
                <option value="USD">USD ($)</option>
                <option value="CDF">CDF (FC)</option>
              </select>
            </div>

            <div className="notched-input-group">
              <label htmlFor="settings-rate" className="notched-label">Taux (1 USD = X CDF)</label>
              <input
                id="settings-rate"
                type="number"
                step="any"
                required
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                placeholder="2850"
                className="notched-input font-bold"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed">
              <strong>Taux unique garanti :</strong> Toute mise à jour s&apos;applique immédiatement aux futurs paiements sans altérer l&apos;historique comptable.
            </div>
          </div>

          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
              Paramètres Facturation
            </h2>

            <div className="notched-input-group">
              <label htmlFor="settings-vat" className="notched-label">Taux TVA Standard (%)</label>
              <input
                id="settings-vat"
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                placeholder="16"
                className="notched-input"
              />
            </div>

            <div className="notched-input-group">
              <label htmlFor="settings-prefix" className="notched-label">Préfixe Numérotation</label>
              <input
                id="settings-prefix"
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="FAC"
                className="notched-input font-mono font-bold"
              />
            </div>

            <div className="notched-input-group">
              <label htmlFor="settings-days" className="notched-label">Délai Règlement (Jours)</label>
              <input
                id="settings-days"
                type="number"
                value={paymentDays}
                onChange={(e) => setPaymentDays(e.target.value)}
                placeholder="30"
                className="notched-input"
              />
            </div>
          </div>

          {/* Section Intégration Supabase */}
          <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E293B]/40 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Database className="w-4 h-4" />
                </span>
                <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
                  Base de Données Supabase
                </h2>
              </div>
              {supabaseActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> Connecté
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <AlertCircle className="w-3 h-3" /> Non configuré
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {supabaseActive
                ? "L'application est connectée à votre instance Supabase. Les entreprises, clients, factures et paiements sont synchronisés en temps réel avec PostgreSQL."
                : "Renseignez vos clés dans le fichier .env.local (NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY) et exécutez le script supabase/schema.sql."}
            </p>

            {supabaseActive && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSyncSupabase}
                  disabled={isSyncing}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs transition-colors"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
                  {isSyncing ? "Synchronisation en cours..." : "Recharger depuis Supabase"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
