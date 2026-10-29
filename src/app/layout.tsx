import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/supabase/auth-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sept-facture | Facturation intelligente bidevise (CDF / USD) en RDC",
  description: "Plateforme SaaS de facturation multidevises, gestion des identifiants fiscaux (NIF, RCCM), calcul automatique de TVA 16% et suivi des paiements Mobile Money (M-Pesa, Airtel, Orange) pour entrepreneurs en RDC.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sept-facture.cd"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sept-facture RDC — Logiciel de Facturation Bidevise CDF & USD",
    description: "Émettez des factures professionnelles en Franc Congolais et Dollar US, calculez automatiquement la TVA légale et suivez vos encaissements.",
    url: "https://sept-facture.cd",
    siteName: "Sept-facture RDC",
    locale: "fr_CD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sept-facture RDC — Facturation intelligente",
    description: "Facturation bidevise (CDF & USD), TVA automatique et Mobile Money pour les entreprises de RDC.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
