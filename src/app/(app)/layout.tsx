import React from "react";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SupabaseSyncProvider } from "@/components/SupabaseSyncProvider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseSyncProvider>
      <div className="min-h-screen min-h-[100dvh] bg-[#EEF0F4] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col justify-start lg:justify-center p-0 sm:p-3 lg:p-6 antialiased transition-colors duration-200">
        {/* Conteneur principal façon fenêtre d'application moderne */}
        <div className="w-full max-w-[1600px] mx-auto bg-white dark:bg-[#0F172A] rounded-none sm:rounded-2xl lg:rounded-[28px] shadow-none sm:shadow-paper border-0 sm:border border-[#E2E8F0] dark:border-[#1E293B] flex flex-col lg:flex-row min-h-screen min-h-[100dvh] lg:min-h-[92vh] overflow-x-hidden">
          {/* Barre latérale (Sidebar desktop & Header mobile avec burger pro) */}
          <AppSidebar />

          {/* Zone de contenu principale scrollable et responsive */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF] dark:bg-[#0F172A] overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SupabaseSyncProvider>
  );
}
