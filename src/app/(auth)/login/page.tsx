"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PasswordField } from "@/components/auth/PasswordField";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Vue Mot de passe oublié
  const [isForgotView, setIsForgotView] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { signInWithPassword, resetPasswordForEmail } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Veuillez renseigner votre email et mot de passe.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signInWithPassword(email.trim(), password);

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setErrorMessage(
            "Votre adresse email n'est pas encore confirmée. Veuillez vérifier votre messagerie."
          );
          router.push("/verify-email");
        } else {
          // Message générique anti-énumération conforme OWASP
          setErrorMessage("Email ou mot de passe incorrect.");
        }
        toast.error("Échec de connexion");
      } else {
        toast.success("Connexion réussie !");
        router.push("/dashboard");
      }
    } catch {
      setErrorMessage("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error("Veuillez renseigner votre email");
      return;
    }

    setIsResetting(true);
    try {
      await resetPasswordForEmail(resetEmail.trim());
      // Réponse identique que le compte existe ou non pour éviter l'énumération
      setResetSent(true);
      toast.success("Demande prise en compte");
    } catch {
      toast.error("Erreur de communication avec le serveur");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {isForgotView ? (
        /* Vue Réinitialisation mot de passe */
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="space-y-1.5 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Mot de passe oublié
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Recevez un lien sécurisé pour redéfinir votre mot de passe
            </p>
          </div>

          {resetSent ? (
            <div className="space-y-4 text-center py-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Si un compte correspond à cette adresse, vous recevrez un email contenant les instructions de réinitialisation.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsForgotView(false);
                  setResetSent(false);
                }}
                className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="notched-input-group">
                <label htmlFor="reset-email" className="notched-label">
                  Votre adresse email *
                </label>
                <div className="relative">
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="nom@entreprise.cd"
                    className="notched-input text-neutral-900 dark:text-white"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsForgotView(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {isResetting ? "Envoi..." : "Envoyer le lien"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Vue Connexion Principale */
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] text-[11px] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espace Facturation Conforme</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Connexion à Sept-facture
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Accédez à vos entreprises, factures bidevises et règlements
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="notched-input-group">
              <label htmlFor="login-email" className="notched-label">
                Adresse email *
              </label>
              <div className="relative">
                <input
                  id="login-email"
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
            </div>

            <PasswordField
              id="login-password"
              name="password"
              label="Mot de passe"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              showStrengthMeter={false}
            />

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsForgotView(true);
                }}
                className="text-xs text-[#2563EB] dark:text-[#60A5FA] hover:underline font-semibold"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-2">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
