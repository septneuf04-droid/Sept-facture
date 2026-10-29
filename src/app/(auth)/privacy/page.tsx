import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
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
          Politique de Confidentialité
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Dernière mise à jour : 28 octobre 2026
        </p>
      </div>

      <div className="space-y-4 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">1. Collecte des Données</h2>
          <p>
            Nous collectons uniquement les informations nécessaires au bon fonctionnement de la facturation : coordonnées de l&apos;entreprise, identifiants fiscaux, coordonnées des clients et historique des paiements (Mobile Money, virements bancaires).
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">2. Utilisation et Confidentialité</h2>
          <p>
            Vos données financières et clients vous appartiennent exclusivement. Elles ne sont ni vendues, ni louées, ni transmises à des tiers sans votre consentement préalable.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">3. Sécurité et Chiffrement</h2>
          <p>
            Toutes les communications transitent par des canaux chiffrés HTTPS/TLS. Les bases de données sont isolées au niveau des lignes de données (Row Level Security - RLS) assurant qu&apos;aucune entreprise ne puisse accéder aux dossiers d&apos;une autre.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">4. Vos Droits</h2>
          <p>
            Vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;exportation de l&apos;intégralité de vos factures et données clients à tout moment depuis les paramètres de votre compte.
          </p>
        </section>
      </div>
    </div>
  );
}

