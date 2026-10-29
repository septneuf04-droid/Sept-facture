"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function SupabaseSyncProvider({ children }: { children: React.ReactNode }) {
  const hydrateFromSupabase = useAppStore((state) => state.hydrateFromSupabase);

  useEffect(() => {
    hydrateFromSupabase();
  }, [hydrateFromSupabase]);

  return <>{children}</>;
}

