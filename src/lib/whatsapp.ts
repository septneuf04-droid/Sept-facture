import { Invoice, Company, Client } from "./types";
import { formatMoney } from "./money";
import { formatDate } from "./utils";

/**
 * Normalise un numéro de téléphone congolais ou international pour WhatsApp
 * Exemples :
 * - "0976208355" -> "243976208355"
 * - "+243 976 208 355" -> "243976208355"
 * - "812345678" -> "243812345678"
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  // Format RDC local avec zéro initial (ex: 0976208355 -> 243976208355)
  if (digits.startsWith("0") && digits.length === 10) {
    return "243" + digits.slice(1);
  }

  // 9 chiffres sans indicatif (ex: 976208355 -> 243976208355)
  if (digits.length === 9) {
    return "243" + digits;
  }

  return digits;
}

/**
 * Génère le message professionnel WhatsApp formaté pour la facture
 */
export function generateInvoiceWhatsAppMessage(params: {
  invoice: Invoice;
  company: Company;
  client?: Client | null;
}): string {
  const { invoice, company, client } = params;
  const num = invoice.number || "Brouillon";
  const clientName = client?.name || "Cher client";
  const solde = invoice.total - invoice.amountPaid;

  const lines = [
    `🧾 *FACTURE N° ${num}*`,
    `🏢 Émise par : *${company.name}*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Client :* ${clientName}`,
    `📝 *Objet :* ${invoice.title}`,
    `📅 *Date d'émission :* ${formatDate(invoice.issueDate)}`,
    `⏰ *Échéance :* ${formatDate(invoice.dueDate)}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `💰 *Montant Total TTC :* *${formatMoney(invoice.total, invoice.currency)}*`,
  ];

  if (invoice.amountPaid > 0) {
    lines.push(`✅ *Déjà réglé :* ${formatMoney(invoice.amountPaid, invoice.currency)}`);
    lines.push(`⚠️ *Solde restant dû :* *${formatMoney(solde, invoice.currency)}*`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📱 *Moyens de paiement acceptés :* M-Pesa, Airtel Money, Orange Money ou virement bancaire.`);
  if (company.phone) {
    lines.push(`📞 *Contact / WhatsApp émetteur :* ${company.phone}`);
  }
  lines.push(``);
  lines.push(`Merci pour votre confiance ! Veuillez trouver le détail de votre facture ci-dessus.`);

  return lines.join("\n");
}

/**
 * Crée le lien WhatsApp complet https://wa.me/...
 */
export function getWhatsAppInvoiceUrl(params: {
  phone: string;
  invoice: Invoice;
  company: Company;
  client?: Client | null;
}): string {
  const cleanPhone = normalizePhoneForWhatsApp(params.phone);
  const message = generateInvoiceWhatsAppMessage(params);
  const encoded = encodeURIComponent(message);

  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

