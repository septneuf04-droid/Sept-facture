import { Payment } from "../types";
import { useAppStore, CreatePaymentInput } from "../store";

export function getPayments(): Payment[] {
  const { payments, activeCompanyId } = useAppStore.getState();
  return payments.filter((p) => p.companyId === activeCompanyId);
}

export function getPaymentsByInvoiceId(invoiceId: string): Payment[] {
  const { payments } = useAppStore.getState();
  return payments.filter((p) => p.invoiceId === invoiceId);
}

export function recordPaymentData(data: CreatePaymentInput) {
  return useAppStore.getState().addPayment(data);
}
