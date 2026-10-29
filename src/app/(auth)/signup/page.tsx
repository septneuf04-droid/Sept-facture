"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  User,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { registerUserAction } from "@/app/actions/auth";
import { PasswordField } from "@/components/auth/PasswordField";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!acceptTerms) {
      setErrorMessage("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUserAction({
        fullName,
        companyName,
        email,
        password,
        confirmPassword,
      });

      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setErrorMessage(result.message || "Erreur de validation");
        toast.error("Erreur lors de la création du compte");
      } else {
        setIsSuccess(true);
        toast.success("Compte initialisé !");
      }
    } catch {
      setErrorMessage("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-5 text-center py-4 animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">
            Vérifiez votre boîte mail
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Un email contenant un lien de confirmation sécurisé a été envoyé à{" "}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{email}</span>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-left text-xs text-neutral-600 dark:text-neutral-300 space-y-1.5">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            Prochaines étapes :
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <li>Ouvrez l&apos;email de validation expédié par Sept-facture</li>
            <li>Cliquez sur le lien pour valider votre adresse</li>
            <li>Connectez-vous pour commencer à émettre vos factures conformes</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Aller à la connexion</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* En-tête */}
      <div className="space-y-1.5 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] text-[11px] font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inscription Sécurisée SaaS</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
          Créer un compte Sept-facture
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Facturation conforme RDC, gestion bidevise CDF & USD
        </p>
      </div>

      {/* Message d'erreur global */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* Formulaire d'inscription */}
      <form onSubmit={handleSignUp} className="space-y-3.5">
        <div className="notched-input-group">
          <label htmlFor="fullName" className="notched-label">
            Nom complet *
          </label>
          <div className="relative">
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Jean Mukendi"
              autoComplete="name"
              className="notched-input text-neutral-900 dark:text-white"
            />
            <User className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {fieldErrors.fullName && (
            <p className="text-xs text-rose-500 font-medium mt-1">{fieldErrors.fullName}</p>
          )}
        </div>

        <div className="notched-input-group">
          <label htmlFor="companyName" className="notched-label">
            Nom de votre entreprise *
          </label>
          <div className="relative">
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Katanga Mining Services SARL"
              autoComplete="organization"
              className="notched-input text-neutral-900 dark:text-white"
            />
            <Building2 className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {fieldErrors.companyName && (
            <p className="text-xs text-rose-500 font-medium mt-1">{fieldErrors.companyName}</p>
          )}
        </div>

        <div className="notched-input-group">
          <label htmlFor="signup-email" className="notched-label">
            Email professionnel *
          </label>
          <div className="relative">
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@entreprise.cd"
              autoComplete="email"
              className="notched-input text-neutral-900 dark:text-white"
            />
            <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {fieldErrors.email && (
            <p className="text-xs text-rose-500 font-medium mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Champ mot de passe fort avec jauge et critères dynamiques */}
        <PasswordField
          id="signup-password"
          name="password"
          label="Mot de passe robuste"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          error={fieldErrors.password}
          showStrengthMeter={true}
        />

        {/* Confirmation du mot de passe */}
        <PasswordField
          id="confirm-password"
          name="confirmPassword"
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          showStrengthMeter={false}
        />

        {/* CGU */}
        <div className="flex items-start gap-2 pt-1 text-xs text-neutral-600 dark:text-neutral-400">
          <input
            id="accept-terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 rounded border-neutral-300 text-[#2563EB] focus:ring-[#2563EB]"
          />
          <label htmlFor="accept-terms" className="leading-snug select-none cursor-pointer">
            J&apos;accepte les{" "}
            <Link href="/terms" className="text-[#2563EB] dark:text-[#60A5FA] font-medium hover:underline">
              Conditions Générales d&apos;Utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/privacy" className="text-[#2563EB] dark:text-[#60A5FA] font-medium hover:underline">
              Politique de Confidentialité
            </Link>
            .
          </label>
        </div>

        {/* Bouton d'action */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Création du compte en cours...</span>
            </div>
          ) : (
            <>
              <span>Créer mon compte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Pied de page vers login */}
      <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-1">
        Vous avez déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
