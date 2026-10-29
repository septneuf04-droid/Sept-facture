import { Client } from "../types";
import { useAppStore } from "../store";

export function getClients(): Client[] {
  const { clients, activeCompanyId } = useAppStore.getState();
  return clients.filter((c) => c.companyId === activeCompanyId);
}

export function getClientById(id: string): Client | undefined {
  const { clients } = useAppStore.getState();
  return clients.find((c) => c.id === id);
}

export function createClientData(
  data: Omit<Client, "id" | "createdAt" | "companyId">
): Client {
  return useAppStore.getState().addClient(data);
}

export function updateClientData(id: string, updates: Partial<Client>): void {
  useAppStore.getState().updateClient(id, updates);
}

export function deleteClientData(id: string): boolean {
  return useAppStore.getState().deleteClient(id);
}
