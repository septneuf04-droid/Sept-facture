import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate une date en jour/mois/année (ex: 16/10/2026)
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  // Si déjà au format DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  
  // Format YYYY-MM-DD
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  
  return dateStr;
}

/**
 * Retourne la date du jour au format ISO YYYY-MM-DD (pour les inputs HTML date)
 */
export function getTodayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Retourne la date d'échéance par défaut (+30 jours) au format ISO YYYY-MM-DD
 */
export function getDefaultDueDateIso(days: number = 30): string {
  const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return date.toISOString().split("T")[0];
}
