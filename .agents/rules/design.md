---
trigger: always_on
---

# Règle Antigravity : Design System & Charte UI Dashboard

Cette règle s'applique à tous les nouveaux composants, vues, pages et modales créés ou modifiés dans le projet **Septfacture / Creatinf SaaS**.
Tout nouveau composant **DOIT impérativement** respecter les conventions visuelles, typographiques, chromatiques et responsives établies sur le **Dashboard**.

---

## 1. Palette Chromatique & Tokens Dark Mode

Tout composant doit être conçu nativement en double mode (Clair & Sombre). L'utilisation de couleurs brutes isolées non référencées est interdite.

| Rôle Visuel | Mode Clair (Light) | Mode Sombre (Dark) | Usage |
| :--- | :--- | :--- | :--- |
| **Fond de page** | `bg-white` | `dark:bg-[#0F172A]` | Conteneur principal de vue |
| **Fond de carte / surface** | `bg-white` ou `bg-[#F8FAFC]` | `dark:bg-[#1E293B]/40` | Cartes KPI, fiches, sous-sections |
| **Bordures structurelles** | `border-[#E2E8F0]` | `dark:border-[#1E293B]` | Cartes, séparateurs, tableaux |
| **Bordures interactives** | `border-[#E2E8F0]` | `dark:border-[#334155]` | Boutons secondaires, inputs, toggles |
| **Bordures légères** | `border-[#F1F5F9]` | `dark:border-[#1E293B]` | Séparations d'en-tête, dividers |
| **Couleur Marque (Primaire)** | `bg-[#2563EB] hover:bg-[#1D4ED8]` | `text-[#60A5FA]` ou `bg-[#2563EB]` | Boutons d'action, accents, focus |
| **Texte Principal** | `text-[#0F172A]` | `dark:text-white` | Titres H1/H2, montants, labels gras |
| **Texte Muted / Secondaire**| `text-neutral-500` | `dark:text-neutral-400` | Sous-titres, libellés explicatifs |
| **Texte Métadonnées / Réf** | `text-neutral-400` | `dark:text-neutral-500` | Dates, fil d'Ariane, micro-notes |

---

## 2. Typographie & Tailles de Police

- **Titre H1 de page :** `text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight`
- **Titre H2 de section :** `text-sm font-bold text-[#0F172A] dark:text-white`
- **Titre H3 / Sous-section :** `text-xs font-bold text-neutral-900 dark:text-white`
- **Texte courant :** `text-xs text-neutral-700 dark:text-neutral-300`
- **Petite mention / Légende :** `text-[10px]` ou `text-[11px] text-neutral-500 dark:text-neutral-400`
- **Numéros de facture / Références :** `font-mono font-semibold` ou `font-mono font-bold`

---

## 3. Structure des Cartes & Conteneurs (KPI & Panels)

### A. Cartes Métriques (KPI Cards)
Toute carte statistique ou métrique doit utiliser le schéma exact suivant :
```tsx
<div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-3.5 sm:p-5 bg-white dark:bg-[#1E293B]/40 shadow-2xs">
  <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 sm:mb-2 font-medium">
    <span className="truncate">Libellé Métrique</span>
    <span className="p-1 sm:p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA]">
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </span>
  </div>
  <div className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white mb-1">
    <Money amount={valeur} currency={devise} size="xl" />
  </div>
  <div className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 truncate">
    <TrendingUp className="w-3 h-3 shrink-0" />
    <span>Information complémentaire</span>
  </div>
</div>
```
- **Règle Grille KPI :** Toujours déclarer `grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4` pour garantir un rendu parfait 2x2 sur mobile et 4 colonnes sur écran large.

### B. Panneaux de Données (Sections principales)
- `border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#0F172A] shadow-2xs space-y-4`

---

## 4. Règle Stricte de Responsivité Mobile (Dual-Rendering)

Tout affichage de données tabulaires (ex: transactions, factures, clients, logs) **NE DOIT PAS** se contenter d'un simple tableau avec scroll horizontal sur mobile.
Il **DOIT OBLIGATOIREMENT** implémenter le double rendu :

1. **Sur Mobile (`md:hidden`) :** Liste de cartes tactiles individuelles :
   ```tsx
   <div className="md:hidden space-y-2.5 sm:space-y-3">
     {items.map((item) => (
       <div className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-3.5 sm:p-4 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-2.5">
         {/* En-tête : Référence + Statut */}
         {/* Corps : Destinataire + Date */}
         {/* Pied : Montant fort + Boutons tactiles (min 40px) */}
       </div>
     ))}
   </div>
   ```
2. **Sur Écran Large (`hidden md:block`) :** Tableau classique épuré avec `thead` en `bg-[#F8FAFC] dark:bg-[#1E293B]/60` et lignes survolables `hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40`.

---

## 5. Composants Communs & Règles d'UI

### A. Boutons
- **Bouton Primaire (Action principale) :**
  ```tsx
  className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
  ```
- **Bouton Secondaire / Neutre :**
  ```tsx
  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs transition-colors"
  ```
- **Bouton Icône (Actions discrètes) :**
  ```tsx
  className="w-8 h-8 rounded-xl border border-[#E2E8F0] dark:border-[#334155] hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors"
  ```

### B. Onglets Segmentés (Segmented Tabs / Currency Switcher)
```tsx
<div className="flex p-1 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 border border-transparent dark:border-[#334155] overflow-x-auto no-scrollbar">
  <button className={cn(
    "px-3 py-1.5 rounded-lg transition-all",
    isActive
      ? "bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white shadow-xs font-bold"
      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
  )}>
    {label}
  </button>
</div>
```

### C. Champs de Formulaire (Style Signature "Notched Input")
Utiliser les classes CSS globales `.notched-input-group`, `.notched-label` et `.notched-input` :
```tsx
<div className="notched-input-group">
  <label className="notched-label">Intitulé du Champ *</label>
  <input type="text" className="notched-input" />
</div>
```

### D. Modales et Dialogues
Toute boîte de dialogue modale doit être configurée en **Bottom Sheet sur mobile** et en **dialogue centré sur tablette/desktop** :
```tsx
<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
  <div className="bg-white dark:bg-[#1E293B] rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-700 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
    ...
  </div>
</div>
```

---

## 6. Checklist de Validation pour Tout Nouveau Composant
- [ ] Le composant gère-t-il à 100% le mode sombre (`dark:...` sur tous les fonds, textes et bordures) ?
- [ ] Sur écran mobile (< 768px), le padding externe est-il de `p-4` et non `p-8` ?
- [ ] Les données tabulaires basculent-elles en cartes tactiles lisibles sur mobile ?
- [ ] Les inputs et boutons font-ils au moins `40px` de haut pour être cliquables sans erreur au doigt ?
- [ ] La monnaie utilise-t-elle les composants `<Money />` ou le helper `formatMoney()` pour respecter les devises USD et CDF ?
