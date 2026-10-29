export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          tagline: string | null;
          address: string;
          city: string;
          phone: string;
          email: string;
          logo_url: string | null;
          nif: string;
          rccm: string;
          id_nat: string;
          default_currency: "CDF" | "USD";
          exchange_rate: number;
          exchange_rate_updated_at: string;
          default_vat_rate: number;
          invoice_prefix: string;
          payment_terms_days: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          tagline?: string | null;
          address: string;
          city: string;
          phone: string;
          email: string;
          logo_url?: string | null;
          nif?: string;
          rccm?: string;
          id_nat?: string;
          default_currency?: "CDF" | "USD";
          exchange_rate?: number;
          exchange_rate_updated_at?: string;
          default_vat_rate?: number;
          invoice_prefix?: string;
          payment_terms_days?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          tagline?: string | null;
          address?: string;
          city?: string;
          phone?: string;
          email?: string;
          logo_url?: string | null;
          nif?: string;
          rccm?: string;
          id_nat?: string;
          default_currency?: "CDF" | "USD";
          exchange_rate?: number;
          exchange_rate_updated_at?: string;
          default_vat_rate?: number;
          invoice_prefix?: string;
          payment_terms_days?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          contact_person: string | null;
          email: string;
          phone: string;
          address: string;
          city: string;
          tax_number: string | null;
          payment_terms_days: number;
          payment_method_preference: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          contact_person?: string | null;
          email: string;
          phone: string;
          address: string;
          city: string;
          tax_number?: string | null;
          payment_terms_days?: number;
          payment_method_preference?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          contact_person?: string | null;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          tax_number?: string | null;
          payment_terms_days?: number;
          payment_method_preference?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          company_id: string;
          client_id: string;
          number: string;
          title: string;
          category: string | null;
          priority: "Basse" | "Normale" | "Haute" | null;
          currency: "CDF" | "USD";
          status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          issue_date: string;
          due_date: string;
          subtotal: number;
          vat_total: number;
          total: number;
          amount_paid: number;
          notes: string | null;
          created_at: string;
          sent_at: string | null;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          client_id: string;
          number?: string;
          title: string;
          category?: string | null;
          priority?: "Basse" | "Normale" | "Haute" | null;
          currency?: "CDF" | "USD";
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          issue_date: string;
          due_date: string;
          subtotal?: number;
          vat_total?: number;
          total?: number;
          amount_paid?: number;
          notes?: string | null;
          created_at?: string;
          sent_at?: string | null;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          client_id?: string;
          number?: string;
          title?: string;
          category?: string | null;
          priority?: "Basse" | "Normale" | "Haute" | null;
          currency?: "CDF" | "USD";
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          issue_date?: string;
          due_date?: string;
          subtotal?: number;
          vat_total?: number;
          total?: number;
          amount_paid?: number;
          notes?: string | null;
          created_at?: string;
          sent_at?: string | null;
          paid_at?: string | null;
        };
        Relationships: [];
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          position: number;
          description: string;
          quantity: number;
          unit_price: number;
          vat_rate: number;
          line_total: number;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          position?: number;
          description: string;
          quantity?: number;
          unit_price?: number;
          vat_rate?: number;
          line_total?: number;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          position?: number;
          description?: string;
          quantity?: number;
          unit_price?: number;
          vat_rate?: number;
          line_total?: number;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          company_id: string;
          amount: number;
          currency: "CDF" | "USD";
          exchange_rate: number;
          amount_in_invoice_currency: number;
          method: string;
          reference: string;
          paid_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          company_id: string;
          amount: number;
          currency?: "CDF" | "USD";
          exchange_rate?: number;
          amount_in_invoice_currency?: number;
          method: string;
          reference: string;
          paid_on: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          company_id?: string;
          amount?: number;
          currency?: "CDF" | "USD";
          exchange_rate?: number;
          amount_in_invoice_currency?: number;
          method?: string;
          reference?: string;
          paid_on?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
