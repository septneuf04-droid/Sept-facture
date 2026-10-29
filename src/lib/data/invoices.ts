import { Invoice, InvoiceStatus } from "../types";
import { useAppStore, CreateInvoiceInput } from "../store";

export function computeInvoiceDisplayStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === "draft" || invoice.status === "cancelled") {
    return invoice.status;
  }
  if (invoice.status === "paid") {
    return "paid";
  }

  // Si statut 'sent', vérifier si la date d'échéance est dépassée avec solde restant
  const today = new Date().toISOString().split("T")[0];
  const hasRemainingBalance = invoice.total - invoice.amountPaid > 0;

  if (invoice.dueDate < today && hasRemainingBalance) {
    return "overdue";
  }

  return "sent";
}

export function getInvoices(): Invoice[] {
  const { invoices, activeCompanyId, clients } = useAppStore.getState();
  return invoices
    .filter((inv) => inv.companyId === activeCompanyId)
    .map((inv) => ({
      ...inv,
      client: clients.find((c) => c.id === inv.clientId) || inv.client,
      status: computeInvoiceDisplayStatus(inv),
    }));
}

export function getInvoiceById(id: string): Invoice | undefined {
  const { invoices, clients } = useAppStore.getState();
  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) return undefined;

  return {
    ...invoice,
    client: clients.find((c) => c.id === invoice.clientId) || invoice.client,
    status: computeInvoiceDisplayStatus(invoice),
  };
}

export function createInvoiceData(data: CreateInvoiceInput) {
  return useAppStore.getState().createInvoice(data);
}

export function updateInvoiceData(id: string, data: Partial<CreateInvoiceInput>) {
  return useAppStore.getState().updateInvoice(id, data);
}

export function updateInvoiceStatusData(id: string, status: InvoiceStatus) {
  return useAppStore.getState().updateInvoiceStatus(id, status);
}

export function sendInvoiceData(id: string) {
  return useAppStore.getState().sendInvoice(id);
}

export function cancelInvoiceData(id: string) {
  return useAppStore.getState().cancelInvoice(id);
}

export function deleteInvoiceData(id: string) {
  return useAppStore.getState().deleteInvoice(id);
}
