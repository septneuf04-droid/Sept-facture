import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Company, Client, Invoice, Payment, InvoiceItem, InvoiceStatus, PaymentMethod } from "./types";
import { Currency, calculateInvoiceTotals, convertCurrency } from "./money";
import { MOCK_COMPANIES, MOCK_CLIENTS, MOCK_INVOICES, MOCK_PAYMENTS } from "./mock-data";
import { PLANS } from "./plans";
import {
  upsertCompanyToSupabase,
  upsertClientToSupabase,
  deleteClientFromSupabase,
  upsertInvoiceToSupabase,
  deleteInvoiceFromSupabase,
  upsertPaymentToSupabase,
  getCompaniesFromSupabase,
  getClientsFromSupabase,
  getInvoicesFromSupabase,
  getPaymentsFromSupabase,
  isSupabaseConfigured,
} from "./supabase/service";

export interface CreateInvoiceInput {
  clientId: string;
  title: string;
  category?: string;
  currency: Currency;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: string;
  dueDate: string;
  notes?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number; // en CDF ou USD
    vatRate: number; // 16 par défaut (RDC)
  }>;
}

export interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  reference: string;
  paidOn: string;
}

interface AppStore {
  companies: Company[];
  activeCompanyId: string;
  clients: Client[];
  invoices: Invoice[];
  payments: Payment[];
  subscription: {
    plan: "free" | "pro";
    active: boolean;
  };

  // Actions Entreprises
  setActiveCompanyId: (id: string) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  addCompany: (companyData: Omit<Company, "id">) => boolean;

  // Actions Clients
  addClient: (clientData: Omit<Client, "id" | "createdAt" | "companyId">) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => boolean;

  // Actions Factures
  createInvoice: (data: CreateInvoiceInput) => { success: boolean; invoice?: Invoice; error?: string };
  updateInvoice: (id: string, data: Partial<CreateInvoiceInput>) => { success: boolean; error?: string };
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => { success: boolean; error?: string };
  sendInvoice: (id: string) => { success: boolean; error?: string };
  cancelInvoice: (id: string) => { success: boolean; error?: string };
  deleteInvoice: (id: string) => { success: boolean; error?: string };

  // Actions Paiements
  addPayment: (data: CreatePaymentInput) => { success: boolean; payment?: Payment; error?: string };

  // Abonnement
  upgradePlan: (plan: "pro") => void;

  // Supabase Sync
  hydrateFromSupabase: () => Promise<void>;

  // Réinitialisation aux données d'origine
  resetToMock: () => void;
}

// Fonction utilitaire pour générer le prochain numéro séquentiel par entreprise
function generateNextInvoiceNumber(company: Company, existingInvoices: Invoice[]): string {
  const year = new Date().getFullYear();
  const prefix = `${company.invoicePrefix || "FAC"}-${year}-`;
  
  const companyInvoices = existingInvoices.filter(
    (inv) => inv.companyId === company.id && inv.number && inv.number.startsWith(prefix)
  );

  let maxNum = 0;
  for (const inv of companyInvoices) {
    const parts = inv.number.split("-");
    const num = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(num) && num > maxNum) {
      maxNum = num;
    }
  }

  const nextNum = (maxNum + 1).toString().padStart(4, "0");
  return `${prefix}${nextNum}`;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      companies: MOCK_COMPANIES,
      activeCompanyId: MOCK_COMPANIES[0].id,
      clients: MOCK_CLIENTS,
      invoices: MOCK_INVOICES,
      payments: MOCK_PAYMENTS,
      subscription: {
        plan: "free",
        active: true,
      },

      setActiveCompanyId: (id: string) => {
        set({ activeCompanyId: id });
        // Synchroniser les données de la nouvelle entreprise active si Supabase est configuré
        if (isSupabaseConfigured()) {
          Promise.all([
            getClientsFromSupabase(id),
            getInvoicesFromSupabase(id),
            getPaymentsFromSupabase(id),
          ]).then(([remoteClients, remoteInvoices, remotePayments]) => {
            set((state) => ({
              clients: remoteClients && remoteClients.length > 0 ? remoteClients : state.clients,
              invoices: remoteInvoices && remoteInvoices.length > 0 ? remoteInvoices : state.invoices,
              payments: remotePayments && remotePayments.length > 0 ? remotePayments : state.payments,
            }));
          });
        }
      },

      updateCompany: (id: string, updates: Partial<Company>) => {
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
        const updated = get().companies.find((c) => c.id === id);
        if (updated) {
          upsertCompanyToSupabase(updated);
        }
      },

      addCompany: (companyData: Omit<Company, "id">) => {
        const newCompany: Company = {
          ...companyData,
          id: `comp-${Date.now()}`,
        };

        set((state) => ({
          companies: [...state.companies, newCompany],
          activeCompanyId: newCompany.id,
        }));
        upsertCompanyToSupabase(newCompany);
        return true;
      },

      addClient: (clientData) => {
        const { activeCompanyId } = get();
        const newClient: Client = {
          ...clientData,
          id: `cli-${Date.now()}`,
          companyId: activeCompanyId,
          createdAt: new Date().toISOString().split("T")[0],
        };

        set((state) => ({
          clients: [newClient, ...state.clients],
        }));

        upsertClientToSupabase(newClient);
        return newClient;
      },

      updateClient: (id: string, updates: Partial<Client>) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
        const updated = get().clients.find((c) => c.id === id);
        if (updated) {
          upsertClientToSupabase(updated);
        }
      },

      deleteClient: (id: string) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        }));
        deleteClientFromSupabase(id);
        return true;
      },

      createInvoice: (data) => {
        const { activeCompanyId, companies, invoices, subscription, clients } = get();
        const company = companies.find((c) => c.id === activeCompanyId);
        if (!company) return { success: false, error: "Entreprise introuvable" };

        // Recalcul des montants et de la TVA (16% par défaut en RDC)
        const vatRateToUse = company.defaultVatRate || 16;
        const totals = calculateInvoiceTotals(data.items, vatRateToUse);

        const newId = `inv-${Date.now()}`;
        const number =
          data.status === "sent" || data.status === "paid"
            ? generateNextInvoiceNumber(company, invoices)
            : "";

        const client = clients.find((c) => c.id === data.clientId);

        const invoiceItems: InvoiceItem[] = data.items.map((item, index) => {
          const lineTotal = Math.round(item.quantity * item.unitPrice);
          return {
            id: `item-${Date.now()}-${index}`,
            invoiceId: newId,
            position: index + 1,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vatRate: item.vatRate !== undefined ? item.vatRate : vatRateToUse,
            lineTotal,
          };
        });

        const newInvoice: Invoice = {
          id: newId,
          companyId: activeCompanyId,
          clientId: data.clientId,
          client,
          number,
          title: data.title,
          category: data.category || "Prestation",
          priority: "Normale",
          currency: data.currency || "CDF",
          status: data.status,
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          subtotal: totals.subtotal,
          vatTotal: totals.vatTotal,
          total: totals.total,
          amountPaid: data.status === "paid" ? totals.total : 0,
          notes: data.notes,
          createdAt: new Date().toISOString().split("T")[0],
          sentAt: data.status === "sent" ? new Date().toISOString() : undefined,
          paidAt: data.status === "paid" ? new Date().toISOString() : undefined,
          items: invoiceItems,
        };

        set((state) => ({
          invoices: [newInvoice, ...state.invoices],
        }));

        upsertInvoiceToSupabase(newInvoice);
        return { success: true, invoice: newInvoice };
      },

      updateInvoice: (id: string, data: Partial<CreateInvoiceInput>) => {
        const { invoices, clients, companies, activeCompanyId } = get();
        const invoice = invoices.find((inv) => inv.id === id);
        if (!invoice) return { success: false, error: "Facture introuvable" };
        const company = companies.find((c) => c.id === activeCompanyId);
        const vatRateToUse = company?.defaultVatRate || 16;

        let updatedItems = invoice.items;
        let subtotal = invoice.subtotal;
        let vatTotal = invoice.vatTotal;
        let total = invoice.total;

        if (data.items) {
          const totals = calculateInvoiceTotals(data.items, vatRateToUse);
          subtotal = totals.subtotal;
          vatTotal = totals.vatTotal;
          total = totals.total;

          updatedItems = data.items.map((item, index) => ({
            id: `item-${Date.now()}-${index}`,
            invoiceId: id,
            position: index + 1,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vatRate: item.vatRate !== undefined ? item.vatRate : vatRateToUse,
            lineTotal: Math.round(item.quantity * item.unitPrice),
          }));
        }

        const client = data.clientId
          ? clients.find((c) => c.id === data.clientId) || invoice.client
          : invoice.client;

        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  clientId: data.clientId || inv.clientId,
                  client,
                  title: data.title || inv.title,
                  category: data.category || inv.category,
                  currency: data.currency || inv.currency,
                  status: data.status || inv.status,
                  issueDate: data.issueDate || inv.issueDate,
                  dueDate: data.dueDate || inv.dueDate,
                  notes: data.notes !== undefined ? data.notes : inv.notes,
                  subtotal,
                  vatTotal,
                  total,
                  items: updatedItems,
                }
              : inv
          ),
        }));

        const updated = get().invoices.find((inv) => inv.id === id);
        if (updated) {
          upsertInvoiceToSupabase(updated);
        }

        return { success: true };
      },

      updateInvoiceStatus: (id: string, newStatus: InvoiceStatus) => {
        const { invoices, companies, activeCompanyId } = get();
        const invoice = invoices.find((i) => i.id === id);
        const company = companies.find((c) => c.id === activeCompanyId);
        if (!invoice) return { success: false, error: "Facture introuvable" };

        let number = invoice.number;
        if (!number && (newStatus === "sent" || newStatus === "paid" || newStatus === "overdue") && company) {
          number = generateNextInvoiceNumber(company, invoices);
        }

        const isPaid = newStatus === "paid";

        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  number: number || inv.number,
                  status: newStatus,
                  amountPaid: isPaid ? inv.total : (newStatus === "draft" ? 0 : inv.amountPaid),
                  paidAt: isPaid ? new Date().toISOString() : inv.paidAt,
                }
              : inv
          ),
        }));

        const updated = get().invoices.find((inv) => inv.id === id);
        if (updated) {
          upsertInvoiceToSupabase(updated);
        }

        return { success: true };
      },

      sendInvoice: (id: string) => {
        const { invoices, companies, activeCompanyId } = get();
        const invoice = invoices.find((i) => i.id === id);
        const company = companies.find((c) => c.id === activeCompanyId);
        if (!invoice || !company) return { success: false, error: "Facture introuvable" };

        const number = invoice.number || generateNextInvoiceNumber(company, invoices);

        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  number,
                  status: "sent",
                  sentAt: new Date().toISOString(),
                }
              : inv
          ),
        }));

        const updated = get().invoices.find((inv) => inv.id === id);
        if (updated) {
          upsertInvoiceToSupabase(updated);
        }

        return { success: true };
      },

      cancelInvoice: (id: string) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, status: "cancelled" } : inv
          ),
        }));
        const updated = get().invoices.find((inv) => inv.id === id);
        if (updated) {
          upsertInvoiceToSupabase(updated);
        }
        return { success: true };
      },

      deleteInvoice: (id: string) => {
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        }));
        deleteInvoiceFromSupabase(id);
        return { success: true };
      },

      addPayment: (data) => {
        const { invoices, companies, activeCompanyId } = get();
        const invoice = invoices.find((i) => i.id === data.invoiceId);
        const company = companies.find((c) => c.id === activeCompanyId);
        if (!invoice || !company) return { success: false, error: "Facture introuvable" };

        const newPayment: Payment = {
          id: `pay-${Date.now()}`,
          invoiceId: invoice.id,
          invoiceNumber: invoice.number || "BROUILLON",
          clientName: invoice.client?.name || "Client",
          companyId: activeCompanyId,
          amount: data.amount,
          currency: data.currency,
          exchangeRate: 1,
          amountInInvoiceCurrency: data.amount,
          method: data.method,
          reference: data.reference,
          paidOn: data.paidOn,
          createdAt: new Date().toISOString(),
        };

        const updatedAmountPaid = invoice.amountPaid + data.amount;
        const isFullyPaid = updatedAmountPaid >= invoice.total;
        const newStatus: InvoiceStatus = isFullyPaid ? "paid" : "sent";

        set((state) => ({
          payments: [newPayment, ...state.payments],
          invoices: state.invoices.map((inv) =>
            inv.id === invoice.id
              ? {
                  ...inv,
                  amountPaid: updatedAmountPaid,
                  status: newStatus,
                  paidAt: isFullyPaid ? new Date().toISOString() : inv.paidAt,
                }
              : inv
          ),
        }));

        upsertPaymentToSupabase(newPayment);
        const updatedInv = get().invoices.find((inv) => inv.id === invoice.id);
        if (updatedInv) {
          upsertInvoiceToSupabase(updatedInv);
        }

        return { success: true, payment: newPayment };
      },

      upgradePlan: (plan) => {
        set({
          subscription: {
            plan,
            active: true,
          },
        });
      },

      hydrateFromSupabase: async () => {
        if (!isSupabaseConfigured()) return;
        try {
          const remoteCompanies = await getCompaniesFromSupabase();
          if (remoteCompanies && remoteCompanies.length > 0) {
            const currentActiveId = get().activeCompanyId;
            const targetCompanyId = remoteCompanies.some((c) => c.id === currentActiveId)
              ? currentActiveId
              : remoteCompanies[0].id;

            const [remoteClients, remoteInvoices, remotePayments] = await Promise.all([
              getClientsFromSupabase(targetCompanyId),
              getInvoicesFromSupabase(targetCompanyId),
              getPaymentsFromSupabase(targetCompanyId),
            ]);

            set((state) => ({
              companies: remoteCompanies,
              activeCompanyId: targetCompanyId,
              clients: remoteClients && remoteClients.length > 0 ? remoteClients : state.clients,
              invoices: remoteInvoices && remoteInvoices.length > 0 ? remoteInvoices : state.invoices,
              payments: remotePayments && remotePayments.length > 0 ? remotePayments : state.payments,
            }));
          }
        } catch (error) {
          console.error("Hydration Supabase failed:", error);
        }
      },

      resetToMock: () => {
        set({
          companies: MOCK_COMPANIES,
          activeCompanyId: MOCK_COMPANIES[0].id,
          clients: MOCK_CLIENTS,
          invoices: MOCK_INVOICES,
          payments: MOCK_PAYMENTS,
          subscription: { plan: "free", active: true },
        });
      },
    }),
    {
      name: "septfacture-storage",
    }
  )
);
