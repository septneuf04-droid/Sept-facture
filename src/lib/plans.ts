import { PlanLimits } from "./types";

export const PLANS: Record<"free" | "pro", PlanLimits & { name: string; priceUsd: number }> = {
  free: {
    name: "Gratuit Illimité",
    priceUsd: 0,
    companiesMax: Infinity,
    invoicesPerMonth: Infinity,
    clientsMax: Infinity,
    hasWatermark: false,
    reportsEnabled: true,
    csvExportEnabled: true,
    autoRemindersEnabled: true,
  },
  pro: {
    name: "Gratuit Illimité",
    priceUsd: 0,
    companiesMax: Infinity,
    invoicesPerMonth: Infinity,
    clientsMax: Infinity,
    hasWatermark: false,
    reportsEnabled: true,
    csvExportEnabled: true,
    autoRemindersEnabled: true,
  },
};
