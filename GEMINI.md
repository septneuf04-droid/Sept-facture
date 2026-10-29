# 🧾 Septfacture — Documentation Complète du Projet

> **Nom du projet :** Septfacture (package: `septfacture`)
> **Type :** Application SaaS de facturation multi-entreprises & multidevises
> **Marché cible :** Entrepreneurs, PME et freelances de la République Démocratique du Congo (RDC)
> **Version :** 0.1.0 (MVP Frontend — pas de backend/API pour l'instant)

---

## 1. 🎯 Ce que l'Application Fait

Septfacture est une **plateforme SaaS de facturation intelligente** conçue spécifiquement pour les entrepreneurs congolais. Elle résout un problème critique : gérer la facturation dans un contexte **bidevise** (Franc Congolais CDF et Dollar US) avec des exigences fiscales locales (TVA RDC, NIF, RCCM, Id. Nationale).

### Résumé Fonctionnel

L'utilisateur peut :
- Gérer **plusieurs entreprises** depuis un seul compte (Company Switcher)
- Créer, envoyer, éditer et suivre des **factures** avec calcul automatique de TVA à 18%
- Gérer un **carnet de clients** complet avec toutes leurs informations
- Suivre les **paiements** entrants avec support des méthodes de paiement locales (M-Pesa, Airtel Money, Orange Money, Afrimoney, virements, chèques, espèces, carte)
- Visualiser un **dashboard financier** avec KPIs en temps réel, basculable entre CDF et USD
- Configurer les **paramètres** de l'entreprise (identité fiscale, taux de change, préfixe de facture, etc.)
- Choisir entre un **plan Gratuit** et un **plan Pro** (système d'abonnement avec limites)

### Particularités RDC

- **Bidevise natif** : Toutes les fonctionnalités gèrent CDF et USD simultanément
- **Taux de change** configurable par entreprise (ex: 1 USD = 2 850 CDF)
- **TVA RDC** à 18% appliquée automatiquement sur chaque ligne de facture
- **Identifiants fiscaux congolais** : NIF, RCCM, Identification Nationale
- **Méthodes de paiement locales** : M-Pesa, Airtel Money, Orange Money, Afrimoney
- **Formatage monétaire local** : `2 500 000 FC` pour CDF, `1 250,00 $` pour USD

---

## 2. 📋 Fonctionnalités Implémentées (Détail Exhaustif)

### 2.1 Dashboard Financier (`/dashboard`)

- **4 cartes KPI** affichant en temps réel :
  - Montant total facturé
  - Montant total encaissé
  - Montant en attente (impayé)
  - Montant en retard (overdue) avec compteur
- **Switcher CDF/USD** : bascule instantanée de tous les KPIs entre les deux devises avec conversion automatique via le taux de change de l'entreprise
- **Taux de recouvrement** : pourcentage encaissé vs facturé
- **Liste des dernières factures** avec statut coloré
- **Liste des derniers paiements** reçus
- Breadcrumb avec nom de l'entreprise active

### 2.2 Gestion des Factures (`/invoices`)

#### Liste des Factures (`/invoices`)
- **Filtrage par statut** via onglets : Toutes, Brouillon, Envoyées, Payées, En retard
- **Recherche** par nom client, numéro de facture ou objet
- **Compteur par statut** dans chaque onglet
- **Double rendu responsive** :
  - Mobile (`md:hidden`) : cartes tactiles empilées
  - Desktop (`hidden md:block`) : tableau complet avec colonnes
- Actions rapides : Voir, Envoyer, Supprimer

#### Création de Facture (`/invoices/new`)
- **Formulaire en deux colonnes** (desktop) ou tabs (mobile : Formulaire / Aperçu)
- Sélection du client dans la liste
- Sélection de devise (CDF/USD)
- Date d'émission et date d'échéance
- **Lignes de facture dynamiques** : ajouter/supprimer des lignes, chaque ligne a :
  - Description
  - Quantité (peut être décimale)
  - Prix unitaire
  - Taux TVA (18% par défaut, modifiable à 0%)
- **Calcul automatique en temps réel** : sous-total HT, TVA 18%, Total TTC
- **Aperçu en direct** : rendu visuel de la facture pendant la saisie
- Sauvegarde en brouillon ou envoi direct
- Catégorie et notes optionnelles

#### Détail de Facture (`/invoices/[id]`)
- Vue complète avec en-tête entreprise, informations client
- Tableau des lignes avec quantité × prix × TVA
- Résumé financier : Sous-total, TVA, Total TTC, Montant payé, Solde restant
- **Actions contextuelles** : Modifier le statut, Envoyer, Éditer, Supprimer
- **Modale de changement de statut** : brouillon → envoyée → payée / annulée

#### Édition de Facture (`/invoices/[id]/edit`)
- Même formulaire que la création, pré-rempli avec les données existantes
- Mise à jour avec recalcul automatique des totaux

### 2.3 Gestion des Clients (`/clients`)

- **Liste de clients** avec recherche par nom, email, téléphone, ville
- **Double rendu responsive** (cartes mobile / tableau desktop)
- **Modale d'ajout** de client : nom, email, téléphone, adresse, ville
- **Modale d'édition** de client
- **Suppression** de client
- Affichage du nombre de factures par client
- Badge "Aucune facture" pour les nouveaux clients

### 2.4 Suivi des Paiements (`/payments`)

- **Liste des transactions** avec filtre par méthode de paiement et par devise
- **Recherche** par référence, nom client, numéro de facture
- Icônes contextuelles par méthode de paiement (smartphone pour mobile money, building pour virement, etc.)
- **Double rendu responsive** (cartes mobile / tableau desktop)
- Montant formaté selon la devise

### 2.5 Paramètres Entreprise (`/settings`)

- **Formulaire complet** avec toutes les informations de l'entreprise :
  - Nom, tagline, ville, adresse
  - Téléphone, email
  - NIF, RCCM, Identification Nationale
  - Devise par défaut, taux de change CDF/USD
  - Taux TVA par défaut (18%)
  - Préfixe de facturation (ex: `FAC`)
  - Délai de paiement par défaut (ex: 30 jours)
- **Bouton de réinitialisation** aux données de démo
- Notification toast de confirmation à chaque sauvegarde

### 2.6 Abonnement & Billing (`/settings/billing`)

- **Comparaison des plans** : Gratuit vs Pro
- Plan Gratuit : 3 entreprises max, 10 factures/mois, 20 clients max, watermark, pas de rapports
- Plan Pro (9$/mois) : entreprises illimitées, factures illimitées, clients illimités, rapports, export CSV, rappels automatiques
- **Jauge d'utilisation** : visualisation du quota consommé (factures, clients, entreprises)
- **Modale d'upgrade** vers le plan Pro (simulation sans passerelle de paiement réelle)

### 2.7 Navigation & Layout

- **Sidebar desktop** avec :
  - Company Switcher (dropdown de sélection d'entreprise)
  - Navigation principale (Dashboard, Transactions, Wallet, Invoices, Clients, Rapports)
  - Toggle Dark Mode (Clair / Sombre)
  - Lien Paramètres et Aide
- **Header mobile** avec :
  - Bouton hamburger animé (→ croix)
  - Drawer mobile en overlay avec même navigation
  - Company Switcher intégré au drawer
- **Barre latérale d'icônes** (`IconSidebar`) pour une navigation compacte

### 2.8 Système Multi-Entreprises

- **Company Switcher** : dropdown dans la sidebar pour basculer entre les entreprises
- Toutes les données (clients, factures, paiements) sont filtrées par `companyId`
- **Création d'entreprise** directement depuis le switcher (avec respect des limites du plan)
- Changement d'entreprise active instantané (re-filtre tous les affichages)

### 2.9 Thème Clair/Sombre

- Toggle en un clic dans la sidebar
- Persistance dans `localStorage` (clé `septfacture-theme`)
- Détection automatique du thème système (`prefers-color-scheme`)
- Toutes les pages et composants supportent le dark mode natif via classes `dark:...`

### 2.10 Notifications Toast

- Notifications toast enrichies (succès, erreur) via la bibliothèque Sonner
- Positionnées en haut à droite, avec bouton de fermeture
- Utilisées pour : confirmation de sauvegarde, envoi de facture, suppression, création de client, upgrade, etc.

---

## 3. 📁 Structure des Fichiers

```
Saas/
├── AGENTS.md                          # Règles pour les agents IA (design system obligatoire)
├── GEMINI.md                          # ← CE FICHIER (documentation complète du projet)
├── README.md                          # Readme basique
│
├── package.json                       # Dépendances & scripts npm
├── tsconfig.json                      # Configuration TypeScript
├── tailwind.config.ts                 # Configuration Tailwind CSS (tokens, couleurs, ombres)
├── postcss.config.mjs                 # Configuration PostCSS
├── next.config.mjs                    # Configuration Next.js (minimal)
├── next-env.d.ts                      # Types Next.js générés
├── .eslintrc.json                     # Configuration ESLint
│
├── .agents/                           # Configuration des agents IA
│   └── rules/
│       └── design.md                  # Design System complet (palette, typographie, composants, responsive)
│
├── public/                            # Assets statiques
│
├── tests/
│   └── money.test.ts                  # Tests unitaires pour les fonctions monétaires
│
└── src/
    ├── app/                           # App Router Next.js 14
    │   ├── globals.css                # Styles globaux (CSS variables, notched inputs, boutons pro, scrollbar)
    │   ├── layout.tsx                 # Layout racine (fonts Geist, Toaster Sonner, metadata SEO)
    │   ├── page.tsx                   # Page racine → redirect vers /dashboard
    │   ├── fonts/                     # Fonts locales (Geist Sans & Geist Mono)
    │   │   ├── GeistVF.woff
    │   │   └── GeistMonoVF.woff
    │   │
    │   └── (app)/                     # Route Group — layout principal avec sidebar
    │       ├── layout.tsx             # Layout app (sidebar + main content, fenêtre arrondie)
    │       │
    │       ├── dashboard/
    │       │   └── page.tsx           # Dashboard financier avec KPIs et dernières activités
    │       │
    │       ├── invoices/
    │       │   ├── page.tsx           # Liste des factures (filtres, recherche, double rendu)
    │       │   ├── new/
    │       │   │   └── page.tsx       # Formulaire de création de facture (709 lignes)
    │       │   └── [id]/
    │       │       ├── page.tsx       # Détail d'une facture (vue complète + actions)
    │       │       └── edit/
    │       │           └── page.tsx   # Formulaire d'édition de facture
    │       │
    │       ├── clients/
    │       │   └── page.tsx           # Liste des clients (CRUD complet avec modales)
    │       │
    │       ├── payments/
    │       │   └── page.tsx           # Liste des paiements (filtres méthode & devise)
    │       │
    │       └── settings/
    │           ├── page.tsx           # Paramètres de l'entreprise (formulaire complet)
    │           └── billing/
    │               └── page.tsx       # Abonnement & plans (Free vs Pro)
    │
    ├── components/
    │   ├── payments/                  # (Répertoire vide — prévu pour les composants de paiement)
    │   │
    │   └── ui/                        # Composants UI réutilisables
    │       ├── AppSidebar.tsx         # Sidebar principale (desktop + drawer mobile + company switcher)
    │       ├── Button.tsx             # Composant bouton (variantes primary, secondary, ghost, danger)
    │       ├── Card.tsx               # Composant carte (KPI, panel, avec variants)
    │       ├── CompanySwitcher.tsx     # Dropdown de sélection d'entreprise + création
    │       ├── CurrencyBadge.tsx      # Badge de devise (CDF/USD)
    │       ├── DataRow.tsx            # Ligne de données clé-valeur (pour les détails)
    │       ├── EmptyState.tsx         # État vide illustré (quand aucune donnée)
    │       ├── HamburgerButton.tsx    # Bouton hamburger animé pour le menu mobile
    │       ├── IconSidebar.tsx        # Barre d'icônes latérale compacte
    │       ├── Input.tsx              # Composant input (style notched)
    │       ├── InvoiceChip.tsx        # Chip de référence facture
    │       ├── Money.tsx              # Composant d'affichage monétaire (formatage auto CDF/USD)
    │       ├── PillTabs.tsx           # Onglets en pilules (segmented tabs)
    │       ├── StatusBadge.tsx        # Badge de statut facture (paid, sent, draft, overdue, cancelled)
    │       ├── TopNav.tsx             # Barre de navigation supérieure (mobile)
    │       └── UpgradeBanner.tsx      # Bannière de promotion du plan Pro
    │
    └── lib/                           # Logique métier, utilitaires & données
        ├── mock-data.ts               # Données de démo (2 entreprises, ~8 clients, ~12 factures, ~5 paiements)
        ├── money.ts                   # Fonctions monétaires (formatMoney, calculateLineTotals, calculateInvoiceTotals, convertCurrency)
        ├── plans.ts                   # Définition des plans (Free & Pro avec limites)
        ├── store.ts                   # Store global Zustand (state management + actions CRUD)
        ├── theme.ts                   # Gestion du thème clair/sombre (init, toggle, isDark)
        ├── types.ts                   # Types TypeScript (Company, Client, Invoice, InvoiceItem, Payment, PlanLimits)
        ├── utils.ts                   # Utilitaires (cn, formatDate, getTodayIsoDate, getDefaultDueDateIso)
        ├── validators.ts             # Schémas Zod (clientSchema, invoiceSchema, paymentSchema, companySchema)
        │
        └── data/                      # Couche d'accès aux données (fonctions helper autour du store)
            ├── clients.ts             # getClients, getClientById, createClientData, updateClientData, deleteClientData
            ├── companies.ts           # getCompanies, getActiveCompany, switchActiveCompany, updateCompanyData, createCompanyData
            ├── dashboard.ts           # getDashboardStats (calcul des KPIs avec conversion multidevise)
            ├── invoices.ts            # getInvoices, getInvoiceById, createInvoiceData, updateInvoiceData, sendInvoiceData, etc.
            └── payments.ts            # getPayments, getPaymentsByInvoiceId, recordPaymentData
```

---

## 4. 🛠️ Technologies Utilisées

### Framework & Runtime

| Technologie | Version | Rôle |
|:---|:---|:---|
| **Next.js** | 14.2.35 | Framework React avec App Router, SSR, routing file-based |
| **React** | ^18 | Bibliothèque UI (composants fonctionnels, hooks) |
| **TypeScript** | ^5 | Typage statique sur tout le projet |

### Styling

| Technologie | Version | Rôle |
|:---|:---|:---|
| **Tailwind CSS** | ^3.4.1 | Framework CSS utility-first — tout le styling est en Tailwind |
| **PostCSS** | ^8 | Pipeline CSS (requis par Tailwind) |
| **CSS Variables** | — | Tokens globaux dans `globals.css` (`--background`, `--card-bg`, etc.) |

### State Management

| Technologie | Version | Rôle |
|:---|:---|:---|
| **Zustand** | ^4.5.5 | Store global unique avec middleware `persist` (localStorage) |

### Formulaires & Validation

| Technologie | Version | Rôle |
|:---|:---|:---|
| **React Hook Form** | ^7.53.0 | Gestion des formulaires (disponible mais peu utilisé pour l'instant — les pages utilisent principalement `useState`) |
| **@hookform/resolvers** | ^3.9.0 | Résolveurs Zod pour React Hook Form |
| **Zod** | ^3.23.8 | Schémas de validation (clientSchema, invoiceSchema, paymentSchema, companySchema) |

### UI & UX

| Technologie | Version | Rôle |
|:---|:---|:---|
| **Lucide React** | ^0.469.0 | Icônes SVG (utilisé massivement dans toute l'application) |
| **Sonner** | ^1.5.0 | Notifications toast élégantes |
| **clsx** | ^2.1.1 | Concaténation conditionnelle de classes CSS |
| **tailwind-merge** | ^2.6.0 | Fusion intelligente des classes Tailwind (via `cn()`) |

### Fonts

| Font | Format | Rôle |
|:---|:---|:---|
| **Geist Sans** | .woff (variable) | Typographie principale (variable `--font-sans`) |
| **Geist Mono** | .woff (variable) | Typographie monospace pour numéros de facture (variable `--font-mono`) |

### Outils de Développement

| Outil | Rôle |
|:---|:---|
| **ESLint** | Linting (config `eslint-config-next`) |
| **Node.js** | Runtime |
| **npm** | Gestionnaire de paquets |

---

## 5. 🎨 Décisions de Design & Instructions pour un Futur Modèle I.A.

### 5.1 Architecture Générale

#### Pas de Backend (MVP Frontend-Only)
L'application est **entièrement côté client**. Il n'y a pas de base de données, pas d'API REST, pas d'authentification. Toutes les données sont stockées dans un **store Zustand persisté en localStorage** (`septfacture-storage`). Les données de démo initiales viennent de `mock-data.ts`.

> **Instruction IA :** Si tu dois ajouter un backend, le store Zustand (`store.ts`) devra être progressivement remplacé par des appels API. La couche `lib/data/` est conçue pour faciliter cette migration — chaque fichier expose des fonctions "getter/setter" qui appellent le store, et pourront être redirigées vers des endpoints API sans changer les composants.

#### App Router Next.js 14 (Route Groups)
Le routing utilise le **App Router** de Next.js 14. Le layout principal vit dans `(app)/layout.tsx` (route group sans affecter l'URL). Toutes les pages sont des `"use client"` components (pas de Server Components pour l'instant car tout est côté client).

> **Instruction IA :** Si tu ajoutes des Server Components ou du data fetching côté serveur, il faudra migrer progressivement les pages hors du pattern `"use client"` et utiliser les Server Actions ou API Routes de Next.js.

#### Couche Data (`lib/data/`)
Les pages ne parlent **jamais directement au store Zustand**. Elles passent par une couche intermédiaire dans `lib/data/` qui :
1. Filtre les données par `activeCompanyId` (multi-tenant)
2. Enrichit les données (ex: attache l'objet `Client` à une `Invoice`)
3. Calcule les statuts dynamiques (ex: une facture "sent" dont la date d'échéance est passée devient "overdue")

> **Instruction IA :** Toujours passer par `lib/data/` pour lire ou écrire des données. Ne jamais appeler `useAppStore.getState()` directement depuis une page ou un composant (sauf pour les hooks React comme `useAppStore()`).

### 5.2 Système Monétaire

#### Montants en Unités Entières (pas en centimes)
Contrairement à beaucoup de systèmes de facturation, les montants ici sont stockés en **unités entières** (CDF ou USD), pas en centimes. Le formatage est :
- **CDF** : arrondi à l'entier, affiché avec séparateur de milliers et suffixe `FC` (ex: `2 500 000 FC`)
- **USD** : avec 2 décimales et suffixe `$` (ex: `1 250,00 $`)

#### Composant `<Money />`
Tout affichage de montant dans l'UI doit utiliser le composant `<Money amount={...} currency={...} />` ou la fonction `formatMoney()`. Ne jamais formater un montant manuellement.

#### Conversion de Devises
La fonction `convertCurrency(amount, from, to, exchangeRate)` gère les conversions. Le taux est stocké par entreprise (`company.exchangeRate`). Le dashboard fait la conversion à la volée quand l'utilisateur switch entre CDF et USD.

> **Instruction IA :** Si tu ajoutes un nouveau affichage de montant, utilise **toujours** `<Money />` ou `formatMoney()`. Ne fais jamais `.toFixed(2)` ou `toLocaleString()` manuellement.

### 5.3 Design System (CRITIQUE — À RESPECTER ABSOLUMENT)

Le design system est documenté en détail dans `.agents/rules/design.md`. Voici un résumé des règles non-négociables :

#### Palette de Couleurs & Dark Mode
Tout composant doit supporter le dark mode nativement. Les tokens principaux sont :

| Rôle | Light | Dark |
|:---|:---|:---|
| Fond de page | `bg-white` | `dark:bg-[#0F172A]` |
| Fond de carte | `bg-white` | `dark:bg-[#1E293B]/40` |
| Bordures | `border-[#E2E8F0]` | `dark:border-[#1E293B]` |
| Texte principal | `text-[#0F172A]` | `dark:text-white` |
| Texte secondaire | `text-neutral-500` | `dark:text-neutral-400` |
| Couleur primaire | `bg-[#2563EB]` | — |

#### Typographie
- Titres H1 : `text-xl sm:text-2xl font-bold tracking-tight`
- Titres H2 : `text-sm font-bold`
- Texte courant : `text-xs`
- Légendes : `text-[10px]` ou `text-[11px]`
- Numéros de facture : `font-mono font-semibold`

#### Responsivité Mobile Obligatoire (Dual-Rendering)
C'est la règle la plus importante du design system :
- **Les tableaux horizontaux sont INTERDITS sur mobile**
- Toute liste de données doit implémenter :
  1. `md:hidden` → Liste de cartes tactiles empilées
  2. `hidden md:block` → Tableau classique
- Les boutons doivent faire au minimum 40px de haut pour être cliquables au doigt
- Padding externe : `p-4 sm:p-6 lg:p-8`

#### Composants UI Standards
- **Bouton primaire** : `bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95`
- **Inputs** : Utiliser le style "notched input" avec les classes CSS `.notched-input-group`, `.notched-label`, `.notched-input` (définis dans `globals.css`)
- **Modales** : Bottom sheet sur mobile (`rounded-t-3xl`) → dialogue centré sur desktop (`sm:rounded-2xl`)
- **Cartes KPI** : Grille `grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4`, coins arrondis `rounded-2xl`, ombres douces

#### Layout "App Window"
Le layout principal (`(app)/layout.tsx`) crée un effet de **fenêtre d'application moderne** :
- Fond extérieur : `bg-[#EEF0F4] dark:bg-[#090D16]`
- Conteneur intérieur : `max-w-[1600px]`, coins arrondis `rounded-[28px]` sur desktop, `shadow-paper`
- Sidebar à gauche + contenu principal à droite

> **Instruction IA :** Pour tout nouveau composant, page ou modale, vérifie systématiquement :
> 1. ✅ Dark mode complet (`dark:...` sur tous les fonds, textes, bordures)
> 2. ✅ Responsive mobile (pas de tableaux horizontaux, cartes tactiles sur mobile)
> 3. ✅ Padding adapté (`p-4 sm:p-6 lg:p-8`)
> 4. ✅ Utilisation de `<Money />` pour tous les montants
> 5. ✅ Boutons et inputs ≥ 40px de hauteur
> 6. ✅ Coins arrondis `rounded-2xl` sur les cartes

### 5.4 Store & State Management

#### Store Unique Zustand
Un seul store (`useAppStore`) dans `lib/store.ts` contient :
- `companies: Company[]` — Liste des entreprises
- `activeCompanyId: string` — ID de l'entreprise actuellement sélectionnée
- `clients: Client[]` — Tous les clients (toutes entreprises confondues)
- `invoices: Invoice[]` — Toutes les factures
- `payments: Payment[]` — Tous les paiements
- `subscription: { plan: "free" | "pro", active: boolean }` — Abonnement

#### Persistance
Le store est persisté via le middleware `persist` de Zustand avec la clé `septfacture-storage` dans `localStorage`. Toutes les modifications sont sauvegardées automatiquement.

#### Multi-Tenant par Filtrage
La multi-entreprise est gérée par filtrage côté client : les fonctions dans `lib/data/` filtrent toutes les données par `activeCompanyId`. Quand l'utilisateur change d'entreprise, tous les affichages se mettent à jour instantanément.

> **Instruction IA :** Quand tu crées une nouvelle entité, assure-toi qu'elle a un champ `companyId` et que les fonctions de lecture filtrent bien par `activeCompanyId`.

### 5.5 Numérotation des Factures

Les factures suivent le pattern `{PREFIX}-{YEAR}-{SEQUENCE}` (ex: `FAC-2026-0001`). Le numéro est :
- **Vide** pour les brouillons (`draft`)
- **Assigné automatiquement** quand la facture est envoyée ou marquée payée
- **Séquentiel par entreprise** : la fonction `generateNextInvoiceNumber()` dans `store.ts` cherche le plus grand numéro existant et incrémente

> **Instruction IA :** Ne jamais permettre la modification manuelle du numéro de facture. Il est toujours auto-généré.

### 5.6 Gestion des Statuts de Facture

Les statuts possibles sont : `draft`, `sent`, `paid`, `overdue`, `cancelled`.

**Règle importante** : Le statut `overdue` est **dynamique** et **calculé** à chaque lecture. Une facture au statut `sent` dont la `dueDate` est passée est automatiquement affichée comme `overdue` via `computeInvoiceDisplayStatus()` dans `lib/data/invoices.ts`.

Transitions valides :
- `draft` → `sent` (envoi, génère un numéro)
- `sent` → `paid` (paiement complet)
- `sent` → `overdue` (dynamique, date dépassée)
- `draft` / `sent` / `overdue` → `cancelled`

### 5.7 Calcul de TVA

La TVA est calculée **par ligne** de facture :
1. `lineTotal HT = quantity × unitPrice` (arrondi à l'entier)
2. `lineVat = lineTotal HT × vatRate / 100` (arrondi à l'entier)
3. `lineTotal TTC = lineTotal HT + lineVat`
4. Les totaux facture sont la somme de toutes les lignes

Le taux par défaut est **18%** (TVA RDC), mais peut être mis à 0% par ligne (pour les exemptions).

> **Instruction IA :** Les fonctions `calculateLineTotals()` et `calculateInvoiceTotals()` dans `lib/money.ts` sont les sources de vérité pour le calcul. Ne jamais recoder la logique de calcul ailleurs.

### 5.8 Validation avec Zod

Les schémas Zod dans `lib/validators.ts` définissent la validation pour :
- `clientSchema` : nom ≥ 2 car., email valide, téléphone ≥ 6 car., adresse, ville
- `invoiceSchema` : client requis, titre ≥ 3 car., dates requises, au moins 1 ligne
- `paymentSchema` : montant > 0, méthode de paiement, référence ≥ 2 car.
- `companySchema` : toutes les infos entreprise + identifiants fiscaux

> **Instruction IA :** Les schémas Zod sont définis mais pas encore systématiquement utilisés dans les formulaires. Certains formulaires utilisent encore une validation manuelle avec `useState`. Préférer React Hook Form + `@hookform/resolvers/zod` pour les nouveaux formulaires.

### 5.9 Hydration Safety

Toutes les pages utilisent le pattern :
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return <div>Chargement...</div>;
```

Ce pattern est **obligatoire** car le store Zustand est hydraté depuis localStorage côté client, ce qui peut causer des mismatches de rendu SSR.

> **Instruction IA :** Toute nouvelle page qui lit le store Zustand doit implémenter ce pattern `mounted`. Ne jamais rendre de données du store avant que `mounted === true`.

### 5.10 Conventions de Code

- **Langue du code** : Variables, fonctions et commentaires en anglais. Labels UI et messages toast en français.
- **Nommage** :
  - Composants : PascalCase (ex: `StatusBadge`, `CompanySwitcher`)
  - Fonctions data : camelCase avec suffixe `Data` (ex: `createInvoiceData`, `deleteClientData`)
  - Types : PascalCase (ex: `Invoice`, `PaymentMethod`, `InvoiceStatus`)
  - IDs générés : pattern `{prefix}-{Date.now()}` (ex: `inv-1698412345678`)
- **Imports** : Alias `@/` pour `src/` (configuré dans tsconfig)
- **CSS** : Tout en Tailwind, classes utilitaires directes. Styles CSS custom uniquement dans `globals.css` pour les patterns complexes (notched inputs, boutons pro)

---

## 6. ⚠️ Limitations Connues & Points d'Attention

1. **Pas de backend** — Tout est en localStorage, les données sont perdues si le navigateur est vidé
2. **Pas d'authentification** — Aucun système de login/register
3. **Pas de génération PDF** — Les factures ne peuvent pas encore être exportées en PDF
4. **Pas d'envoi d'email** — Le bouton "Envoyer" change le statut mais n'envoie rien
5. **Pas de passerelle de paiement** — L'upgrade Pro est simulée
6. **React Hook Form sous-utilisé** — Installé mais la plupart des formulaires utilisent `useState` manuellement
7. **Répertoire `components/payments/` vide** — Prévu pour des composants de paiement dédiés
8. **Tests limités** — Seul `money.test.ts` existe, pas de tests d'intégration ou E2E
9. **Pas de gestion de devises au-delà de CDF/USD** — Le type `Currency` est hardcodé sur ces deux valeurs

---

## 7. 🗺️ Feuille de Route Potentielle

Pour un futur modèle I.A. travaillant sur ce projet, voici les évolutions logiques :

1. **Backend API** (Next.js API Routes ou service séparé) avec base de données (PostgreSQL, Supabase, etc.)
2. **Authentification** (NextAuth.js, Clerk, ou Supabase Auth)
3. **Génération PDF** de factures (avec la bibliothèque `@react-pdf/renderer` ou puppeteer)
4. **Envoi d'emails** transactionnels (Resend, SendGrid)
5. **Tableau de bord analytique** avec graphiques (Recharts, Chart.js)
6. **Export CSV** des données
7. **Rappels automatiques** pour les factures en retard
8. **Système de rôles** (admin, comptable, lecteur)
9. **Intégration M-Pesa API** pour le suivi automatique des paiements
10. **Application mobile** (React Native ou PWA)
