import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] dark:border-[#1E293B] pb-3">
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour</span>
        </Link>
        <span className="text-[11px] text-neutral-500 font-medium">Sept-facture RDC</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">
          Conditions Générales d&apos;Utilisation (CGU)
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Dernière mise à jour : 28 octobre 2026
        </p>
      </div>

      <div className="space-y-4 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">1. Objet du Service</h2>
          <p>
            Sept-facture est une plateforme logicielle conçue pour faciliter l&apos;émission, la gestion et le suivi des factures bidevises (Franc Congolais CDF et Dollar US), conformément aux normes commerciales et fiscales en vigueur en République Démocratique du Congo.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">2. Responsabilité de l&apos;utilisateur</h2>
          <p>
            L&apos;utilisateur est seul responsable de l&apos;exactitude des données financières, des taux de TVA appliqués, ainsi que des mentions légales et fiscales (NIF, RCCM, Identification Nationale) saisies sur ses factures.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">3. Sécurité des Accès</h2>
          <p>
            L&apos;identifiant et le mot de passe sont strictement confidentiels. Toute transaction ou facturation effectuée depuis votre compte est réputée avoir été validée par le représentant légal de l&apos;entreprise.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">4. Disponibilité du Service</h2>
          <p>
            Sept-facture s&apos;engage à mettre en œuvre tous les moyens raisonnables pour assurer un accès continu et performant au service 24h/24 et 7j/7, sous réserve d&apos;éventuelles opérations de maintenance.
          </p>
        </section>
      </div>
    </div>
  );
}

