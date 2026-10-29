"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ArrowDownUp,
  FileText,
  Users,
  Settings,
  Moon,
  Sun,
  ChevronsUpDown,
  Check,
  X,
  Plus,
  LogOut,
  User,
  LogIn,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/supabase/auth-context";
import { initTheme, toggleTheme, isDarkMode } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { HamburgerButton } from "./HamburgerButton";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/invoices", label: "Factures", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/payments", label: "Paiements", icon: ArrowDownUp },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCity, setNewCity] = useState("Kolwezi");
  const [newCurrency, setNewCurrency] = useState<"USD" | "CDF">("USD");

  const { companies, activeCompanyId, setActiveCompanyId, addCompany } = useAppStore();
  const { user, signOut } = useAuth();
  const activeCompany =
    companies.find((c) => c.id === activeCompanyId) || companies[0];

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const success = addCompany({
      name: newCompanyName.trim(),
      tagline: "Entreprise commerciale",
      city: newCity,
      address: `${newCity}, RDC`,
      phone: "+243 81 000 0000",
      email: `contact@${newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.cd`,
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
      toast.success(`Entreprise "${newCompanyName.trim()}" créée avec succès !`);
      setNewCompanyName("");
      setIsAddingCompany(false);
      setIsCompanyDropdownOpen(false);
    } else {
      toast.error("Erreur lors de la création de l'entreprise");
    }
  };

  useEffect(() => {
    initTheme();
    setDarkMode(isDarkMode());
  }, []);

  // Fermer le menu mobile lors d'un changement d'URL
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Bloquer le scroll d'arrière-plan quand le drawer mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsCompanyDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleDarkMode = () => {
    const newDark = toggleTheme();
    setDarkMode(newDark);
    toast.info(newDark ? "Mode sombre activé" : "Mode clair activé");
  };

  // Contenu unifié de la navigation
  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 sm:p-5 text-sm select-none overflow-y-auto">
      <div className="space-y-5">
        {/* En-tête / Logo de l'application */}
        <div className="flex items-center justify-between px-1 py-1">
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg
                width="20"
                height="20"
                className="w-5 h-5 text-white shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h.01" />
                <path d="M17 17h.01" />
                <path d="M7 17h10" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                  Sept-facture
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-[#60A5FA]">
                  RDC
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium -mt-0.5">
                Facturation & Finance
              </p>
            </div>
          </Link>

          {/* Bouton de fermeture sur mobile */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fermer le menu"
            className="lg:hidden w-8 h-8 rounded-xl border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sélecteur d'entreprise (Workspace Switcher en haut sous le logo) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
              setIsAddingCompany(false);
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#1E293B]/70 hover:bg-neutral-100 dark:hover:bg-[#1E293B] transition-colors text-left shadow-2xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shrink-0 flex items-center justify-center font-bold text-[10px] shadow-xs">
                {activeCompany.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {activeCompany.name}
                </div>
                <div className="text-[10px] text-neutral-400 truncate -mt-0.5">
                  {activeCompany.city || "RDC"} • {activeCompany.defaultCurrency}
                </div>
              </div>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </button>

          {/* Dropdown choix d'entreprise & ajout multi-entreprises */}
          {isCompanyDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-full bg-white dark:bg-[#1E293B] rounded-2xl p-2.5 shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 animate-in fade-in zoom-in-95">
              {!isAddingCompany ? (
                <>
                  <div className="px-2 py-1 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase flex items-center justify-between">
                    <span>Mes Entreprises</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{companies.length}</span>
                  </div>

                  <div className="space-y-1 mt-1 max-h-48 overflow-y-auto">
                    {companies.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setActiveCompanyId(c.id);
                          setIsCompanyDropdownOpen(false);
                          toast.info(`Entreprise active : ${c.name}`);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors",
                          c.id === activeCompanyId
                            ? "bg-blue-50 dark:bg-blue-950/60 font-bold text-[#2563EB] dark:text-[#60A5FA]"
                            : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[9px] font-bold shrink-0">
                            {c.name.slice(0, 1)}
                          </div>
                          <span className="truncate">{c.name}</span>
                        </div>
                        {c.id === activeCompanyId && (
                          <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="my-1.5 border-t border-neutral-100 dark:border-neutral-800" />

                  {/* Bouton visible pour ajouter plusieurs entreprises */}
                  <button
                    type="button"
                    onClick={() => setIsAddingCompany(true)}
                    className="w-full flex items-center justify-center gap-1.5 p-2 text-xs text-[#2563EB] dark:text-[#60A5FA] bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-colors font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une entreprise</span>
                  </button>
                </>
              ) : (
                /* Formulaire d'ajout rapide d'une nouvelle structure */
                <form onSubmit={handleCreateCompany} className="space-y-2.5 p-1 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingCompany(false)}
                      className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-[11px] font-semibold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Retour</span>
                    </button>
                    <span className="text-[11px] font-bold text-[#0F172A] dark:text-white">Nouvelle structure</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                      Nom commercial *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Kinshasa Digital SARL"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6]"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                        Ville
                      </label>
                      <select
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-2 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                      >
                        <option value="Kolwezi">Kolwezi</option>
                        <option value="Kinshasa">Kinshasa</option>
                        <option value="Lubumbashi">Lubumbashi</option>
                        <option value="Goma">Goma</option>
                        <option value="Matadi">Matadi</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                        Devise
                      </label>
                      <select
                        value={newCurrency}
                        onChange={(e) => setNewCurrency(e.target.value as "USD" | "CDF")}
                        className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-2 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none font-semibold"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="CDF">CDF (FC)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    Créer l&apos;entreprise
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Section MENU */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
            Navigation
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.href === "/invoices" && (pathname === "/invoices" || pathname?.startsWith("/invoices/"))) ||
                (item.href === "/dashboard" && pathname === "/dashboard") ||
                (item.href === "/clients" && pathname === "/clients") ||
                (item.href === "/payments" && pathname === "/payments") ||
                (item.href === "/settings" && pathname === "/settings");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[42px]",
                    isActive
                      ? "bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#2563EB] dark:text-[#60A5FA] shadow-xs font-bold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 stroke-[2]",
                      isActive
                        ? "text-[#2563EB] dark:text-[#60A5FA]"
                        : "text-neutral-400 dark:text-neutral-500"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bas de Sidebar */}
      <div className="space-y-3 pt-4 border-t border-[#F1F5F9] dark:border-[#1E293B] mt-6">
        {/* Support WhatsApp & Email direct */}
        <a
          href="https://wa.me/243976208355?text=Bonjour%20Sept-facture,%20j'ai%20besoin%20d'aide"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Assistance WhatsApp</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-white dark:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            0976208355
          </span>
        </a>

        <div className="space-y-1">
          {/* Dark Mode toggle interactif */}
          <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-400" />
              )}
              <span>{darkMode ? "Mode Sombre" : "Mode Clair"}</span>
            </div>
            <button
              type="button"
              onClick={handleToggleDarkMode}
              aria-label="Changer de thème"
              className={cn(
                "w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]",
                darkMode ? "bg-[#2563EB]" : "bg-neutral-200 dark:bg-neutral-700"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform shadow-xs",
                  darkMode ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Compte Utilisateur & Déconnexion (Unique profil au bas de la sidebar) */}
        {user ? (
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center font-bold text-xs shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </div>
                <div className="text-[10px] text-neutral-400 truncate -mt-0.5">
                  {user.email}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                toast.success("Déconnexion réussie");
              }}
              title="Se déconnecter"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-[#E2E8F0] dark:border-[#334155] text-neutral-600 dark:text-neutral-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:border-[#2563EB] text-xs font-semibold transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Connexion Compte</span>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. NAVBAR MOBILE PRO AVEC BOUTON BURGER ANIMÉ (Affichée uniquement < 1024px) */}
      <header className="lg:hidden w-full bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1E293B] px-3.5 py-2 flex items-center justify-between sticky top-0 z-40 transition-colors">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold shadow-xs">
            <svg
              width="14"
              height="14"
              className="w-3.5 h-3.5 text-white shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h.01" />
              <path d="M17 17h.01" />
              <path d="M7 17h10" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                Sept-facture
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-[#60A5FA]">
                RDC
              </span>
            </div>
            <p className="text-[9px] text-neutral-400 font-medium truncate max-w-[120px] -mt-0.5">
              {activeCompany.name}
            </p>
          </div>
        </Link>

        {/* Action icons & Pro Animated Hamburger */}
        <div className="flex items-center gap-1.5">
          {/* Quick theme toggle */}
          <button
            type="button"
            onClick={handleToggleDarkMode}
            className="w-8 h-8 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white/80 dark:bg-[#1E293B]/80 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs"
            title="Changer de thème"
            aria-label="Changer de thème"
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </button>

          {/* Bouton Hamburger avec effet Pro */}
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </header>

      {/* 2. TIROIR LATÉRAL (DRAWER) MOBILE AVEC BACKDROP BLUR & SMOOTH SLIDE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Arrière-plan flouté semi-transparent cliquable */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Contenu du tiroir */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-[#0F172A] h-full shadow-2xl z-10 flex flex-col border-r border-[#E2E8F0] dark:border-[#1E293B] animate-in slide-in-from-left duration-300 ease-out">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* 3. SIDEBAR DESKTOP FIXE (Affichée sur écrans >= 1024px) */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-[#0F172A] border-r border-[#E2E8F0] dark:border-[#1E293B] flex-col justify-between shrink-0 min-h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
