export type Currency = "CDF" | "USD";

/**
 * Formate un montant en chaîne monétaire lisible selon la devise.
 * CDF: 2 500 000 FC (arrondi à l'entier)
 * USD: 1 250,00 $
 */
export function formatMoney(amount: number | bigint, currency: Currency = "CDF"): string {
  const numericAmount = typeof amount === "bigint" ? Number(amount) : amount;

  if (currency === "USD") {
    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
    return `${formatted}\u00A0$`;
  } else {
    // CDF (Franc Congolais)
    const integerAmount = Math.round(numericAmount);
    const formatted = new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0,
    }).format(integerAmount);
    return `${formatted}\u00A0FC`;
  }
}

/**
 * Calcul des totaux d'une ligne d'article
 * quantité (peut être décimale) x prix_unitaire
 * TVA par défaut à 16% (RDC)
 */
export function calculateLineTotals(quantity: number, unitPrice: number, vatRatePercent: number = 16) {
  const lineTotalHt = Math.round(quantity * unitPrice);
  const lineVat = Math.round((lineTotalHt * vatRatePercent) / 100);
  const lineTotalTtc = lineTotalHt + lineVat;

  return {
    lineTotalHtCents: lineTotalHt,
    lineVatCents: lineVat,
    lineTotalTtcCents: lineTotalTtc,
    lineTotalHt,
    lineVat,
    lineTotalTtc,
  };
}

/**
 * Calcul des totaux complets d'une facture (Sous-total, TVA 16%, Total TTC)
 */
export function calculateInvoiceTotals(
  items: Array<{ quantity: number; unitPrice: number; vatRate?: number }>,
  defaultVat: number = 16
) {
  let subtotal = 0;
  let vatTotal = 0;

  for (const item of items) {
    const vatRate = item.vatRate !== undefined ? item.vatRate : defaultVat;
    const totals = calculateLineTotals(item.quantity, item.unitPrice, vatRate);
    subtotal += totals.lineTotalHt;
    vatTotal += totals.lineVat;
  }

  const total = subtotal + vatTotal;

  return {
    subtotal,
    vatTotal,
    total,
    subtotalCents: subtotal,
    vatTotalCents: vatTotal,
    totalCents: total,
  };
}

/**
 * Conversion de devises entre CDF et USD (taux de change indicatif 2850 CDF = 1 USD)
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  exchangeRate: number = 2850
): number {
  if (from === to) return amount;
  if (from === "USD" && to === "CDF") {
    return Math.round(amount * exchangeRate);
  }
  if (from === "CDF" && to === "USD") {
    return Number((amount / exchangeRate).toFixed(2));
  }
  return amount;
}
