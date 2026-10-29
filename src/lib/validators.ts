import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Le nom du client doit comporter au moins 2 caractères"),
  contactPerson: z.string().optional(),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  address: z.string().min(3, "Adresse requise"),
  city: z.string().min(2, "Ville requise (ex: Kinshasa)"),
  taxNumber: z.string().optional(),
  paymentTermsDays: z.coerce.number().min(0).default(30),
  paymentMethodPreference: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description de ligne requise"),
  quantity: z.coerce.number().positive("La quantité doit être supérieure à 0"),
  unitPrice: z.coerce.number().min(0, "Le prix unitaire doit être positif"),
  vatRate: z.coerce.number().default(16),
});

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  title: z.string().min(3, "L'objet de la facture est requis"),
  category: z.string().optional(),
  currency: z.enum(["USD", "CDF"]),
  issueDate: z.string().min(1, "Date d'émission requise"),
  dueDate: z.string().min(1, "Date d'échéance requise"),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "La facture doit comporter au moins une ligne"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, "Facture requise"),
  amount: z.coerce.number().positive("Le montant doit être supérieur à 0"),
  currency: z.enum(["USD", "CDF"]),
  method: z.enum([
    "cash",
    "mpesa",
    "airtel_money",
    "orange_money",
    "afrimoney",
    "transfer",
    "cheque",
    "card",
  ]),
  reference: z.string().min(2, "Référence SMS ou bancaire requise"),
  paidOn: z.string().min(1, "Date du versement requise"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const companySchema = z.object({
  name: z.string().min(2, "Nom d'entreprise requis"),
  tagline: z.string().optional(),
  address: z.string().min(3, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  phone: z.string().min(6, "Téléphone requis"),
  email: z.string().email("Email invalide"),
  nif: z.string().min(3, "Numéro NIF requis"),
  rccm: z.string().min(3, "RCCM requis"),
  idNat: z.string().min(3, "Id. Nationale requise"),
  defaultCurrency: z.enum(["USD", "CDF"]),
  exchangeRate: z.coerce.number().positive("Taux de change requis"),
  defaultVatRate: z.coerce.number().default(16),
  invoicePrefix: z.string().min(1).default("FAC"),
  paymentTermsDays: z.coerce.number().min(0).default(30),
});

export type CompanyFormData = z.infer<typeof companySchema>;
