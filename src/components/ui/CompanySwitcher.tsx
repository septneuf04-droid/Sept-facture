"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Check, ArrowLeft, Building2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CompanySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    companies,
    activeCompanyId,
    setActiveCompanyId,
    addCompany,
    subscription,
  } = useAppStore();

  const activeCompany =
    companies.find((c) => c.id === activeCompanyId) || companies[0];

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCity, setNewCity] = useState("Kolwezi");
  const [newCurrency, setNewCurrency] = useState<"USD" | "CDF">("USD");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingCompany(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const success = addCompany({
      name: newCompanyName.trim(),
      tagline: "Entreprise commerciale",
      city: newCity,
      address: `${newCity}, RDC`,
      phone: "+243 976 208 355",
      email: `contact@${newCompanyName.toLowerCase().replace(/\s+/g, "")}.cd`,
      nif: "A" + Math.floor(1000000 + Math.random() * 9000000) + "X",
      rccm: "CD/KIN/RCCM/26-B-001",
      idNat: "01-83-N00000",
      defaultCurrency: newCurrency,
      exchangeRate: 2850,
      exchangeRateUpdatedAt: new Date().toISOString().split("T")[0],
      defaultVatRate: 16,
      invoicePrefix: newCompanyName.slice(0, 3).toUpperCase(),
      paymentTermsDays: 30,
    });

    if (success) {
      toast.success(`Entreprise ${newCompanyName} créée avec succès !`);
      setNewCompanyName("");
      setIsAddingCompany(false);
      setIsOpen(false);
    } else {
      toast.error("Erreur lors de la création de l'entreprise.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsAddingCompany(false);
        }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-[#1E293B] hover:bg-white dark:hover:bg-[#1E293B]/80 border border-neutral-200/70 dark:border-[#334155] shadow-xs transition-all text-left"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center text-xs font-bold shadow-xs">
          {activeCompany.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
            {activeCompany.name}
          </div>
          <div className="text-[10px] text-neutral-400 font-medium">
            {activeCompany.city} • {activeCompany.defaultCurrency}
          </div>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 ml-0.5 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#1E293B] rounded-2xl p-2.5 shadow-xl border border-[#E2E8F0] dark:border-[#334155] z-50 animate-in fade-in zoom-in-95 duration-150">
          {!isAddingCompany ? (
            <>
              <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Mes Entreprises</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{companies.length} (Illimité)</span>
              </div>

              <div className="space-y-1 max-h-56 overflow-y-auto">
                {companies.map((company) => {
                  const isSelected = company.id === activeCompany.id;
                  return (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => {
                        setActiveCompanyId(company.id);
                        setIsOpen(false);
                        toast.info(`Entreprise active : ${company.name}`);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors",
                        isSelected
                          ? "bg-blue-50/70 dark:bg-blue-950/50 text-[#2563EB] dark:text-[#60A5FA] font-bold"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 text-xs font-bold text-neutral-700 dark:text-neutral-200">
                          {company.name.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs truncate">{company.name}</div>
                          <div className="text-[10px] text-neutral-400 truncate">
                            1 $ = {company.exchangeRate} FC
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="my-1.5 border-t border-neutral-100 dark:border-neutral-800" />

              <button
                type="button"
                onClick={() => setIsAddingCompany(true)}
                className="w-full flex items-center gap-2 p-2 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 text-neutral-400" />
                <span>Ajouter une entreprise</span>
              </button>
            </>
          ) : (
            /* Formulaire intégré dans le menu (Zéro popup) */
            <form onSubmit={handleCreateCompany} className="space-y-3 p-1 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddingCompany(false)}
                  className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-[11px] font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>
                <span className="text-[11px] font-bold text-[#0F172A] dark:text-white">Nouvelle structure</span>
              </div>

              <div className="notched-input-group">
                <label className="notched-label">Nom commercial *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kinshasa Digital SARL"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="notched-input"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="notched-input-group">
                  <label className="notched-label">Ville</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="notched-input bg-white dark:bg-[#0F172A]"
                  >
                    <option value="Kolwezi">Kolwezi</option>
                    <option value="Kinshasa">Kinshasa</option>
                    <option value="Lubumbashi">Lubumbashi</option>
                    <option value="Goma">Goma</option>
                    <option value="Matadi">Matadi</option>
                  </select>
                </div>
                <div className="notched-input-group">
                  <label className="notched-label">Devise</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value as "USD" | "CDF")}
                    className="notched-input bg-white dark:bg-[#0F172A]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CDF">CDF (FC)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCompany(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-semibold text-[11px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[11px] shadow-sm shadow-blue-500/20"
                >
                  Créer
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
