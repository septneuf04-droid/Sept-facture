import { Company } from "../types";
import { useAppStore } from "../store";

export function getCompanies(): Company[] {
  return useAppStore.getState().companies;
}

export function getActiveCompany(): Company {
  const { companies, activeCompanyId } = useAppStore.getState();
  return companies.find((c) => c.id === activeCompanyId) || companies[0];
}

export function switchActiveCompany(id: string): void {
  useAppStore.getState().setActiveCompanyId(id);
}

export function updateCompanyData(id: string, updates: Partial<Company>): void {
  useAppStore.getState().updateCompany(id, updates);
}

export function createCompanyData(company: Omit<Company, "id">): boolean {
  return useAppStore.getState().addCompany(company);
}
