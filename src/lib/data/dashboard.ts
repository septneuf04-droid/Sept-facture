import { Currency, convertCurrency } from "../money";
import { getInvoices } from "./invoices";
import { getPayments } from "./payments";
import { getActiveCompany } from "./companies";

export interface DashboardStats {
  currency: Currency;
  totalInvoiced: number; // en centimes
  totalCollected: number; // en centimes
  totalPending: number; // en centimes
  overdueAmount: number; // en centimes
  overdueCount: number;
  openCount: number;
  collectionRate: number; // pourcentage
  exchangeRate: number;
}

export function getDashboardStats(targetCurrency: Currency): DashboardStats {
  const company = getActiveCompany();
  const invoices = getInvoices();
  const payments = getPayments();
  const rate = company.exchangeRate;

  let totalInvoiced = 0;
  let totalCollected = 0;
  let totalPending = 0;
  let overdueAmount = 0;
  let overdueCount = 0;
  let openCount = 0;

  for (const inv of invoices) {
    if (inv.status === "cancelled") continue;

    // Convertir les montants de la facture vers la devise ciblée
    const invTotalInTarget = convertCurrency(inv.total, inv.currency, targetCurrency, rate);
    const invPaidInTarget = convertCurrency(inv.amountPaid, inv.currency, targetCurrency, rate);
    const invRemainingInTarget = invTotalInTarget - invPaidInTarget;

    totalInvoiced += invTotalInTarget;
    totalCollected += invPaidInTarget;

    if (inv.status === "sent" || inv.status === "draft" || inv.status === "overdue") {
      openCount++;
      totalPending += invRemainingInTarget;
    }

    if (inv.status === "overdue") {
      overdueCount++;
      overdueAmount += invRemainingInTarget;
    }
  }

  const collectionRate =
    totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  return {
    currency: targetCurrency,
    totalInvoiced,
    totalCollected,
    totalPending,
    overdueAmount,
    overdueCount,
    openCount,
    collectionRate,
    exchangeRate: rate,
  };
}
