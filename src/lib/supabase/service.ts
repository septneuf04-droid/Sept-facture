import { createClient } from "./client";
import { Company, Client, Invoice, Payment, InvoiceItem } from "../types";

// ==========================================
// VÉRIFICATION DE LA CONNEXION
// ==========================================
export function isSupabaseConfigured(): boolean {
  const supabase = createClient();
  return supabase !== null;
}

// ==========================================
// CONVERTISSEURS DE DONNÉES (CAMEL <-> SNAKE)
// ==========================================
function mapCompanyFromDb(row: any): Company {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline || undefined,
    address: row.address,
    city: row.city,
    phone: row.phone,
    email: row.email,
    logoUrl: row.logo_url || undefined,
    nif: row.nif || "",
    rccm: row.rccm || "",
    idNat: row.id_nat || "",
    defaultCurrency: row.default_currency,
    exchangeRate: Number(row.exchange_rate) || 2850,
    exchangeRateUpdatedAt: row.exchange_rate_updated_at || new Date().toISOString(),
    defaultVatRate: Number(row.default_vat_rate) || 16,
    invoicePrefix: row.invoice_prefix || "FAC",
    paymentTermsDays: Number(row.payment_terms_days) || 30,
  };
}

function mapClientFromDb(row: any): Client {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    contactPerson: row.contact_person || undefined,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    taxNumber: row.tax_number || undefined,
    paymentTermsDays: Number(row.payment_terms_days) || 30,
    paymentMethodPreference: row.payment_method_preference || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at,
  };
}

function mapInvoiceFromDb(row: any, items: InvoiceItem[] = []): Invoice {
  return {
    id: row.id,
    companyId: row.company_id,
    clientId: row.client_id,
    number: row.number,
    title: row.title,
    category: row.category || undefined,
    priority: row.priority || "Normale",
    currency: row.currency,
    status: row.status,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    subtotal: Number(row.subtotal),
    vatTotal: Number(row.vat_total),
    total: Number(row.total),
    amountPaid: Number(row.amount_paid) || 0,
    notes: row.notes || undefined,
    createdAt: row.created_at,
    sentAt: row.sent_at || undefined,
    paidAt: row.paid_at || undefined,
    items: items,
  };
}

function mapPaymentFromDb(row: any): Payment {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    invoiceNumber: row.invoices?.number || "",
    clientName: row.invoices?.clients?.name || "Client",
    companyId: row.company_id,
    amount: Number(row.amount),
    currency: row.currency,
    exchangeRate: Number(row.exchange_rate) || 2850,
    amountInInvoiceCurrency: Number(row.amount_in_invoice_currency),
    method: row.method,
    reference: row.reference,
    paidOn: row.paid_on,
    createdAt: row.created_at,
  };
}

// ==========================================
// OPÉRATIONS ENTREPRISES
// ==========================================
export async function getCompaniesFromSupabase(): Promise<Company[] | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: true });
  if (error || !data) {
    console.error("Erreur Supabase getCompanies:", error);
    return null;
  }

  return data.map(mapCompanyFromDb);
}

export async function upsertCompanyToSupabase(company: Company): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("companies").upsert({
    id: company.id,
    user_id: user?.id || null,
    name: company.name,
    tagline: company.tagline,
    address: company.address,
    city: company.city,
    phone: company.phone,
    email: company.email,
    logo_url: company.logoUrl,
    nif: company.nif,
    rccm: company.rccm,
    id_nat: company.idNat,
    default_currency: company.defaultCurrency,
    exchangeRate: company.exchangeRate,
    exchange_rate: company.exchangeRate,
    exchange_rate_updated_at: company.exchangeRateUpdatedAt,
    default_vat_rate: company.defaultVatRate,
    invoice_prefix: company.invoicePrefix,
    payment_terms_days: company.paymentTermsDays,
  } as any);

  if (error) {
    console.error("Erreur Supabase upsertCompany:", error);
    return false;
  }
  return true;
}

// ==========================================
// OPÉRATIONS CLIENTS
// ==========================================
export async function getClientsFromSupabase(companyId: string): Promise<Client[] | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Erreur Supabase getClients:", error);
    return null;
  }

  return data.map(mapClientFromDb);
}

export async function upsertClientToSupabase(client: Client): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("clients").upsert({
    id: client.id,
    company_id: client.companyId,
    name: client.name,
    contact_person: client.contactPerson,
    email: client.email,
    phone: client.phone,
    address: client.address,
    city: client.city,
    tax_number: client.taxNumber,
    payment_terms_days: client.paymentTermsDays,
    payment_method_preference: client.paymentMethodPreference,
    notes: client.notes,
    created_at: client.createdAt,
  });

  if (error) {
    console.error("Erreur Supabase upsertClient:", error);
    return false;
  }
  return true;
}

export async function deleteClientFromSupabase(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    console.error("Erreur Supabase deleteClient:", error);
    return false;
  }
  return true;
}

// ==========================================
// OPÉRATIONS FACTURES & LIGNES
// ==========================================
export async function getInvoicesFromSupabase(companyId: string): Promise<Invoice[] | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data: invoicesData, error: invError } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (invError || !invoicesData) {
    console.error("Erreur Supabase getInvoices:", invError);
    return null;
  }

  return invoicesData.map((inv: any) => {
    const items: InvoiceItem[] = (inv.invoice_items || []).map((it: any) => ({
      id: it.id,
      invoiceId: it.invoice_id,
      position: it.position,
      description: it.description,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unit_price),
      vatRate: Number(it.vat_rate),
      lineTotal: Number(it.line_total),
    }));
    return mapInvoiceFromDb(inv, items);
  });
}

export async function upsertInvoiceToSupabase(invoice: Invoice): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error: invError } = await supabase.from("invoices").upsert({
    id: invoice.id,
    company_id: invoice.companyId,
    client_id: invoice.clientId,
    number: invoice.number,
    title: invoice.title,
    category: invoice.category,
    priority: invoice.priority,
    currency: invoice.currency,
    status: invoice.status,
    issue_date: invoice.issueDate,
    due_date: invoice.dueDate,
    subtotal: invoice.subtotal,
    vat_total: invoice.vatTotal,
    total: invoice.total,
    amount_paid: invoice.amountPaid,
    notes: invoice.notes,
    created_at: invoice.createdAt,
    sent_at: invoice.sentAt,
    paid_at: invoice.paidAt,
  });

  if (invError) {
    console.error("Erreur Supabase upsertInvoice:", invError);
    return false;
  }

  // Synchroniser les lignes de facture
  if (invoice.items && invoice.items.length > 0) {
    // Supprimer les anciennes lignes pour éviter les doublons/conflits d'ordonnancement
    await supabase.from("invoice_items").delete().eq("invoice_id", invoice.id);

    const itemsToInsert = invoice.items.map((item, idx) => ({
      id: item.id,
      invoice_id: invoice.id,
      position: item.position ?? idx,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      vat_rate: item.vatRate,
      line_total: item.lineTotal,
    }));

    const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert);
    if (itemsError) {
      console.error("Erreur Supabase insert invoice_items:", itemsError);
    }
  }

  return true;
}

export async function deleteInvoiceFromSupabase(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) {
    console.error("Erreur Supabase deleteInvoice:", error);
    return false;
  }
  return true;
}

// ==========================================
// OPÉRATIONS PAIEMENTS
// ==========================================
export async function getPaymentsFromSupabase(companyId: string): Promise<Payment[] | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("payments")
    .select("*, invoices(number, clients(name))")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Erreur Supabase getPayments:", error);
    return null;
  }

  return data.map(mapPaymentFromDb);
}

export async function upsertPaymentToSupabase(payment: Payment): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("payments").upsert({
    id: payment.id,
    invoice_id: payment.invoiceId,
    company_id: payment.companyId,
    amount: payment.amount,
    currency: payment.currency,
    exchange_rate: payment.exchangeRate,
    amount_in_invoice_currency: payment.amountInInvoiceCurrency,
    method: payment.method,
    reference: payment.reference,
    paid_on: payment.paidOn,
    created_at: payment.createdAt,
  });

  if (error) {
    console.error("Erreur Supabase upsertPayment:", error);
    return false;
  }
  return true;
}

