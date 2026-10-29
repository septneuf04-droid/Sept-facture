-- ==============================================================================
-- SEPTFACTURE SAAS - DONNÉES DE DÉMONSTRATION INITIALES (SEED)
-- Exécuter ce script après schema.sql pour peupler la base avec des données de test
-- ==============================================================================

-- 1. ENTREPRISES
INSERT INTO public.companies (id, name, tagline, address, city, phone, email, nif, rccm, id_nat, default_currency, exchange_rate, default_vat_rate, invoice_prefix, payment_terms_days)
VALUES
('comp-1', 'Cometix SARL', 'Solutions Digitales & Conseil d''Entreprise', 'Boulevard du 30 Juin, Gombe', 'Kinshasa', '+243 81 234 5678', 'contact@cometix.cd', 'A0912834K', 'CD/KIN/RCCM/20-B-0194', '01-83-N49201L', 'CDF', 2850, 16, 'FAC', 30),
('comp-2', 'Katanga Logistique SARL', 'Fret minier, Transit & Chaîne d''Approvisionnement', 'Avenue Kilela Balanda, Centre-ville', 'Lubumbashi', '+243 99 876 5432', 'ops@katangalogistics.cd', 'B9876543C', 'CD/LSH/RCCM/22-B-0891', '05-64-M10928K', 'USD', 2850, 16, 'KAT', 15)
ON CONFLICT (id) DO NOTHING;

-- 2. CLIENTS
INSERT INTO public.clients (id, company_id, name, contact_person, email, phone, address, city, tax_number, payment_terms_days)
VALUES
('cli-1', 'comp-1', 'Vodacom Congo RDC', 'Michel Kalala', 'finance@vodacom.cd', '+243 81 555 0101', 'Boulevard du 30 Juin, Immeuble Futur Tower', 'Kinshasa', 'A0123456V', 30),
('cli-2', 'comp-1', 'Rawbank SA', 'Mireille Kasongo', 'compta@rawbank.cd', '+243 82 000 2020', 'Boulevard du 30 Juin, Siège Social', 'Kinshasa', 'A9988776R', 15),
('cli-3', 'comp-1', 'Bralima SA (Heineken)', 'Patrick Ilunga', 'procurement@bralima.cd', '+243 99 123 4567', 'Avenue du Flambeau, Barumbu', 'Kinshasa', 'B1234567B', 30),
('cli-4', 'comp-1', 'Congo Airways', 'Sarah Mwamba', 'facturation@congoairways.com', '+243 85 987 6543', 'Avenue du Port, Gombe', 'Kinshasa', 'C4567890C', 45)
ON CONFLICT (id) DO NOTHING;

-- 3. FACTURES
INSERT INTO public.invoices (id, company_id, client_id, number, title, category, priority, currency, status, issue_date, due_date, subtotal, vat_total, total, amount_paid)
VALUES
('inv-1', 'comp-1', 'cli-1', 'FAC-2026-0001', 'Système CRM & Intégration M-Pesa', 'Développement', 'Haute', 'CDF', 'paid', '2026-09-01', '2026-10-01', 5000000, 800000, 5800000, 5800000),
('inv-2', 'comp-1', 'cli-2', 'FAC-2026-0002', 'Audit de Cybersécurité & Conformité BCDC', 'Conseil', 'Normale', 'USD', 'paid', '2026-09-15', '2026-09-30', 2500, 400, 2900, 2900),
('inv-3', 'comp-1', 'cli-3', 'FAC-2026-0003', 'Maintenance Infrastructure Réseau Q3', 'Maintenance', 'Normale', 'CDF', 'sent', '2026-10-01', '2026-10-31', 3200000, 512000, 3712000, 0),
('inv-4', 'comp-1', 'cli-4', 'FAC-2026-0004', 'Licences SaaS & Formation Équipes', 'Formation', 'Basse', 'USD', 'overdue', '2026-09-10', '2026-09-25', 1800, 288, 2088, 0)
ON CONFLICT (id) DO NOTHING;

-- 4. LIGNES DE FACTURE
INSERT INTO public.invoice_items (id, invoice_id, position, description, quantity, unit_price, vat_rate, line_total)
VALUES
('item-1-1', 'inv-1', 1, 'Architecture et paramétrage module CRM', 1, 3000000, 16, 3000000),
('item-1-2', 'inv-1', 2, 'Connecteur passerelle Vodacom M-Pesa API', 1, 2000000, 16, 2000000),
('item-2-1', 'inv-2', 1, 'Tests d''intrusion et rapport de vulnérabilité', 1, 2500, 16, 2500),
('item-3-1', 'inv-3', 1, 'Supervision et infogérance serveurs', 2, 1600000, 16, 3200000),
('item-4-1', 'inv-4', 1, 'Abonnements Annuels SaaS (20 utilisateurs)', 20, 90, 16, 1800)
ON CONFLICT (id) DO NOTHING;

-- 5. PAIEMENTS
INSERT INTO public.payments (id, invoice_id, company_id, amount, currency, exchange_rate, amount_in_invoice_currency, method, reference, paid_on)
VALUES
('pay-1', 'inv-1', 'comp-1', 5800000, 'CDF', 2850, 5800000, 'mpesa', 'MPESA-983210-KIN', '2026-09-28'),
('pay-2', 'inv-2', 'comp-1', 2900, 'USD', 2850, 2900, 'transfer', 'RAW-TRF-20260920-88', '2026-09-20')
ON CONFLICT (id) DO NOTHING;

