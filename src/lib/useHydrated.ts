"use client";

import { useState, useEffect } from "react";

// Variable en mémoire persistée pendant toute la session de navigation SPA
let isClientHydrated = false;

/**
 * Hook d'hydratation ultra-performant.
 * - Sur le tout premier chargement SSR/Hydration : attend le premier montage pour éviter les désynchronisations.
 * - Sur TOUTES les transitions de page suivantes (client-side navigation) : renvoie true IMMÉDIATEMENT,
 *   éliminant tout flash "Chargement...", tout double-render et rendant la navigation instantanée.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(isClientHydrated);

  useEffect(() => {
    if (!isClientHydrated) {
      isClientHydrated = true;
      setHydrated(true);
    }
  }, []);

  return hydrated;
}

