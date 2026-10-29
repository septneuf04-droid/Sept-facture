"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, RefreshCw, ArrowLeft } from "lucide-react";
import { resendVerificationEmailAction } from "@/app/actions/auth";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || cooldown > 0) return;

    setIsResending(true);
    try {
      const result = await resendVerificationEmailAction(email);
      if (result.success) {
        toast.success(result.message || "Email envoyé !");
        setCooldown(60);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(result.message || "Erreur lors du renvoi");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center animate-in fade-in duration-200">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] mx-auto flex items-center justify-center shadow-xs">
        <Mail className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
          Vérifiez votre boîte de réception
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
          Pour des raisons de sécurité, vous devez confirmer votre adresse email avant d&apos;accéder à votre espace de facturation.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#334155] text-left text-xs text-neutral-600 dark:text-neutral-300 space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>Cliquez sur le lien de validation sécurisé reçu dans votre messagerie.</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>Vérifiez vos dossiers <strong>Spams</strong> ou <strong>Courrier indésirable</strong> si l&apos;email tarde à arriver.</span>
        </div>
      </div>

      {/* Formulaire de renvoi sécurisé */}
      <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
        <div className="notched-input-group">
          <label htmlFor="resend-email" className="notched-label">
            Votre adresse email
          </label>
          <input
            id="resend-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nom@entreprise.cd"
            className="notched-input text-neutral-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isResending || cooldown > 0 || !email.trim()}
          className="w-full py-2.5 px-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
          <span>
            {cooldown > 0
              ? `Patientez ${cooldown}s pour renvoyer`
              : isResending
              ? "Envoi en cours..."
              : "Renvoyer l'email de confirmation"}
          </span>
        </button>
      </form>

      <div className="pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à la page de connexion</span>
        </Link>
      </div>
    </div>
  );
}

