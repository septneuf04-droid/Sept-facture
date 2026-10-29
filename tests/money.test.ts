import {
  formatMoney,
  calculateLineTotals,
  calculateInvoiceTotals,
  convertCurrency,
} from "../src/lib/money";

function assertEqual(actual: any, expected: any, testName: string) {
  if (actual === expected) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName} - Attendu: ${expected}, Reçu: ${actual}`);
    process.exit(1);
  }
}

console.log("=== TESTS UNITAIRES MONEY.TS ===");

// 1. Formatage USD et CDF (normalisation des espaces insécables \u202F et \u00A0)
const cleanSpace = (str: string) => str.replace(/[\u202F\u00A0]/g, " ");
assertEqual(cleanSpace(formatMoney(125000, "USD")), "1 250,00 $", "Formatage USD avec centimes");
assertEqual(cleanSpace(formatMoney(250000000, "CDF")), "2 500 000 FC", "Formatage CDF gros montant");

// 2. Calcul ligne normale avec TVA 16%
const line1 = calculateLineTotals(1, 10000, 16); // 100.00 $
assertEqual(line1.lineTotalHtCents, 10000, "Ligne HT");
assertEqual(line1.lineVatCents, 1600, "Ligne TVA 16%");
assertEqual(line1.lineTotalTtcCents, 11600, "Ligne TTC");

// 3. Calcul ligne avec quantité décimale (ex: 2.5 jours de consultation)
const lineDec = calculateLineTotals(2.5, 20000, 16);
assertEqual(lineDec.lineTotalHtCents, 50000, "Quantité décimale HT");
assertEqual(lineDec.lineVatCents, 8000, "Quantité décimale TVA");

// 4. Exonération TVA 0%
const lineExo = calculateLineTotals(1, 50000, 0);
assertEqual(lineExo.lineVatCents, 0, "Exonération TVA 0%");
assertEqual(lineExo.lineTotalTtcCents, 50000, "Exonération TTC égal HT");

// 5. Totaux complets de facture
const invoiceTotals = calculateInvoiceTotals([
  { quantity: 1, unitPrice: 4500000, vatRate: 16 },
  { quantity: 1, unitPrice: 1250000, vatRate: 16 },
]);
assertEqual(invoiceTotals.subtotalCents, 5750000, "Sous-total facture");
assertEqual(invoiceTotals.vatTotalCents, 920000, "Total TVA facture");
assertEqual(invoiceTotals.totalCents, 6670000, "Total TTC facture");

// 6. Conversion de devise avec taux RDC (ex: 1 USD = 2850 CDF)
const convertedToCdf = convertCurrency(10000, "USD", "CDF", 2850);
assertEqual(convertedToCdf, 28500000, "Conversion 100 USD -> CDF");
const convertedToUsd = convertCurrency(28500000, "CDF", "USD", 2850);
assertEqual(convertedToUsd, 10000, "Conversion CDF -> 100 USD");

console.log("=== TOUS LES TESTS MONEY.TS SONT AU VERT ! ===");
