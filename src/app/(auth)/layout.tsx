import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#EEF0F4] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 antialiased transition-colors duration-200">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* En-tête / Logo de l'application */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-white"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h.01" />
                <path d="M17 17h.01" />
                <path d="M7 17h10" />
              </svg>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                  Sept-facture
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-[#60A5FA]">
                  RDC
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium -mt-0.5">
                Facturation & Finance
              </p>
            </div>
          </Link>
        </div>

        {/* Contenu de la page Auth */}
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 sm:p-8 shadow-paper">
          {children}
        </div>

        {/* Pied de page informatif */}
        <div className="text-center text-[11px] text-neutral-400 dark:text-neutral-500">
          Facturation bidevise (CDF / USD) & conforme fiscalité RDC.
        </div>
      </div>
    </div>
  );
}
