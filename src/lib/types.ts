import { Currency } from "./money";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export type PaymentMethod =
  | "cash"
  | "mpesa"
  | "airtel_money"
  | "orange_money"
  | "afrimoney"
  | "transfer"
  | "cheque"
  | "card";

export interface Company {
  id: string;
  name: string;
  tagline?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logoUrl?: string;
  nif: string; // Numéro d'Identité Fiscale
  rccm: string; // Registre du Commerce et du Crédit Mobilier
  idNat: string; // Identification Nationale
  defaultCurrency: Currency;
  exchangeRate: number; // 1 USD = X CDF (ex: 2850)
  exchangeRateUpdatedAt: string;
  defaultVatRate: number; // 16%
  invoicePrefix: string; // "FAC"
  paymentTermsDays: number; // 30
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  taxNumber?: string;
  paymentTermsDays: number;
  paymentMethodPreference?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  position: number;
  description: string;
  quantity: number;
  unitPrice: number; // en centimes
  vatRate: number; // ex: 16 ou 0
  lineTotal: number; // en centimes (HT)
}

export interface Invoice {
  id: string;
  companyId: string;
  clientId: string;
  client?: Client;
  number: string; // ex: "FAC-2026-0001" (vide si draft)
  title: string; // ex: "Système CRM & Intégration M-Pesa"
  category?: string; // ex: "Développement", "Conseil"
  priority?: "Basse" | "Normale" | "Haute";
  currency: Currency;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number; // centimes HT
  vatTotal: number; // centimes TVA
  total: number; // centimes TTC
  amountPaid: number; // centimes
  notes?: string;
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
  items: InvoiceItem[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  companyId: string;
  amount: number; // centimes
  currency: Currency;
  exchangeRate: number;
  amountInInvoiceCurrency: number;
  method: PaymentMethod;
  reference: string;
  paidOn: string;
  createdAt: string;
}

export interface PlanLimits {
  companiesMax: number;
  invoicesPerMonth: number;
  clientsMax: number;
  hasWatermark: boolean;
  reportsEnabled: boolean;
  csvExportEnabled: boolean;
  autoRemindersEnabled: boolean;
}
