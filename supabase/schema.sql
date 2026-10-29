-- ==============================================================================
-- SEPTFACTURE SAAS - SCHÉMA DE BASE DE DONNÉES SUPABASE (PostgreSQL)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLE : ENTREPRISES (COMPANIES)
CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT,
    address TEXT NOT NULL DEFAULT 'Kinshasa, RDC',
    city TEXT NOT NULL DEFAULT 'Kinshasa',
    phone TEXT NOT NULL DEFAULT '+243 00 000 0000',
    email TEXT NOT NULL,
    logo_url TEXT,
    nif TEXT NOT NULL DEFAULT '',
    rccm TEXT NOT NULL DEFAULT '',
    id_nat TEXT NOT NULL DEFAULT '',
    default_currency TEXT NOT NULL CHECK (default_currency IN ('CDF', 'USD')) DEFAULT 'CDF',
    exchange_rate NUMERIC(12, 2) NOT NULL DEFAULT 2850,
    exchange_rate_updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    default_vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 16,
    invoice_prefix TEXT NOT NULL DEFAULT 'FAC',
    payment_terms_days INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLE : CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    tax_number TEXT,
    payment_terms_days INTEGER NOT NULL DEFAULT 30,
    payment_method_preference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLE : FACTURES (INVOICES)
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    number TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    category TEXT,
    priority TEXT CHECK (priority IN ('Basse', 'Normale', 'Haute')) DEFAULT 'Normale',
    currency TEXT NOT NULL CHECK (currency IN ('CDF', 'USD')) DEFAULT 'CDF',
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
    vat_total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(14, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ
);

-- 5. TABLE : LIGNES DE FACTURE (INVOICE ITEMS)
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_id TEXT NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 16,
    line_total NUMERIC(14, 2) NOT NULL DEFAULT 0
);

-- 6. TABLE : PAIEMENTS (PAYMENTS)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_id TEXT NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    amount NUMERIC(14, 2) NOT NULL,
    currency TEXT NOT NULL CHECK (currency IN ('CDF', 'USD')) DEFAULT 'CDF',
    exchange_rate NUMERIC(12, 2) NOT NULL DEFAULT 2850,
    amount_in_invoice_currency NUMERIC(14, 2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('cash', 'mpesa', 'airtel_money', 'orange_money', 'afrimoney', 'transfer', 'cheque', 'card')),
    reference TEXT NOT NULL,
    paid_on DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. INDEX POUR LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON public.clients(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON public.invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_company_id ON public.payments(company_id);

-- 8. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS - STRICT MULTI-TENANT GRANULAIRE)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS durcies avec isolation stricte par compte utilisateur (auth.uid()) et séparation par opération
DROP POLICY IF EXISTS "Companies policy" ON public.companies;
DROP POLICY IF EXISTS "Companies select policy" ON public.companies;
DROP POLICY IF EXISTS "Companies insert policy" ON public.companies;
DROP POLICY IF EXISTS "Companies update policy" ON public.companies;
DROP POLICY IF EXISTS "Companies delete policy" ON public.companies;

CREATE POLICY "Companies select policy" ON public.companies
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Companies insert policy" ON public.companies
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Companies update policy" ON public.companies
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Companies delete policy" ON public.companies
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Politiques RLS Clients
DROP POLICY IF EXISTS "Clients policy" ON public.clients;
DROP POLICY IF EXISTS "Clients select policy" ON public.clients;
DROP POLICY IF EXISTS "Clients insert policy" ON public.clients;
DROP POLICY IF EXISTS "Clients update policy" ON public.clients;
DROP POLICY IF EXISTS "Clients delete policy" ON public.clients;

CREATE POLICY "Clients select policy" ON public.clients
    FOR SELECT TO authenticated
    USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Clients insert policy" ON public.clients
    FOR INSERT TO authenticated
    WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Clients update policy" ON public.clients
    FOR UPDATE TO authenticated
    USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()))
    WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Clients delete policy" ON public.clients
    FOR DELETE TO authenticated
    USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- Politiques RLS Factures
DROP POLICY IF EXISTS "Invoices policy" ON public.invoices;
CREATE POLICY "Invoices policy" ON public.invoices
    FOR ALL TO authenticated
    USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()))
    WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- Politiques RLS Lignes de Facture
DROP POLICY IF EXISTS "Invoice items policy" ON public.invoice_items;
CREATE POLICY "Invoice items policy" ON public.invoice_items
    FOR ALL TO authenticated
    USING (invoice_id IN (SELECT id FROM public.invoices WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())))
    WITH CHECK (invoice_id IN (SELECT id FROM public.invoices WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())));

-- Politiques RLS Paiements
DROP POLICY IF EXISTS "Payments policy" ON public.payments;
CREATE POLICY "Payments policy" ON public.payments
    FOR ALL TO authenticated
    USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()))
    WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- 9. DÉCLENCHEUR SÉCURISÉ : CRÉATION AUTOMATIQUE DE L'ENTREPRISE (SET search_path anti-hijacking)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    new_company_name TEXT;
BEGIN
    new_company_name := COALESCE(new.raw_user_meta_data->>'company_name', 'Mon Entreprise');
    
    INSERT INTO public.companies (
        id,
        user_id,
        name,
        tagline,
        address,
        city,
        phone,
        email,
        default_currency,
        exchange_rate,
        default_vat_rate,
        invoice_prefix,
        payment_terms_days
    ) VALUES (
        gen_random_uuid()::text,
        new.id,
        new_company_name,
        'Facturation & Gestion d''Entreprise',
        'Route Kazembe, Péniel',
        'Kolwezi',
        COALESCE(new.phone, '+243 976 208 355'),
        new.email,
        'CDF',
        2850,
        16,
        'FAC',
        30
    );
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
