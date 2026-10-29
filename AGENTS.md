# Directives du Projet Septfacture / Creatinf SaaS

Ce fichier définit les règles obligatoires et le design system du projet pour Antigravity.

## Règle Absolue : Respect du Design System du Dashboard

Tout nouveau composant, page, formulaire, modale ou vue créé dans ce projet **doit obligatoirement** suivre les spécifications et patterns établis sur le **Dashboard**.

Pour la spécification complète et les modèles de code, se référer au fichier :
👉 [.agents/rules/dashboard-design-system.md](file:///d:/PROJETS-INFORMATIQUE/PROJET-CLIENTS/Saas/.agents/rules/dashboard-design-system.md)

### Résumé des Principes Clés :

1. **Dark Mode Systématique** :
   - Fond page : `bg-white dark:bg-[#0F172A]`
   - Fond cartes / surfaces : `bg-white dark:bg-[#1E293B]/40`
   - Bordures : `border-[#E2E8F0] dark:border-[#1E293B]`
   - Textes : `text-[#0F172A] dark:text-white` (titres), `text-neutral-500 dark:text-neutral-400` (secondaire)

2. **Responsivité Mobile "Dual-Rendering" Obligatoire** :
   - Pas de tableaux horizontaux coupés sur smartphone.
   - Toujours implémenter `md:hidden` (cartes tactiles ergonomiques) et `hidden md:block` (tableau complet).
   - Espacement externe adapté : `p-4 sm:p-6 lg:p-8`.

3. **Cartes Statistiques & KPI** :
   - Grille responsive : `grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4` (2x2 sur mobile).
   - Coins arrondis : `rounded-2xl`, ombres douces `shadow-2xs`.
   - Badges colorés discrets avec icônes Lucide.

4. **Boutons & Éléments Interactifs** :
   - Boutons primaires : `bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95`.
   - Notched inputs : Utiliser `.notched-input-group`, `.notched-label`, `.notched-input`.
   - Modales : Toujours en bottom-sheet sur mobile (`rounded-t-3xl sm:rounded-2xl`) et centrées sur desktop.
