import { mdArticle, mdMots, nombreArticle } from "@/lib/montant";

/* ═══════════════════════════════════════════════════════════════════════════
   LES MONTANTS D'UN ARTICLE

   Tout montant affiché dans un article passe par l'une de ces fonctions. Elles
   lisent la monnaie choisie dans le menu du site (euro, dollar, yuan) et
   convertissent au taux moyen de l'année du montant. Un montant écrit « en
   dur » (« 3 536 Md€ » tapé dans le texte) ne se convertit pas : c'est le
   défaut à éviter.

   Les données sont saisies en MILLIARDS D'EUROS. Pour une autre monnaie
   d'origine, voir `src/lib/montant.ts`.

     montant(3536.1)        → « 3 536,1 Md€ »      (ou « 4 112,6 Md$ » si le lecteur a choisi le dollar)
     montant(152.5, 0)      → « 153 Md€ »          (0 décimale)
     montant(3536.1, 1, 2026) → au taux moyen de 2026 (2025 par défaut)
     montantAbs(-152.5)     → « 152,5 Md€ »        (sans le signe : à poser soi-même)
     enLettres(3536, 0)     → « 3 536 milliards d'euros » (pour le texte courant)
     nombre(152.5)          → « 152,5 »            (le nombre converti seul, pour une colonne dont l'en-tête porte l'unité)
   ═══════════════════════════════════════════════════════════════════════════ */

export const montant = (md: number, decimales = 1, annee = 2025) => mdArticle(md, decimales, annee);
export const montantAbs = (md: number, decimales = 1, annee = 2025) => mdArticle(Math.abs(md), decimales, annee);
export const enLettres = mdMots;
export const nombre = nombreArticle;

/** Un nombre à la française, sans unité : « 66,7 ». */
export const nf = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
