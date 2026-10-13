import { CATALOGUE_DETTE } from "./catalogue";
import { articleFrance } from "./france/fiche";
import type { ArticleDette, RenduArticle } from "./types";

/* ═══════════════════════════════════════════════════════════════════════════
   LE REGISTRE DES ARTICLES DE DETTE : LA PAGE ET SON RÉFÉRENCEMENT

   Associe chaque entrée du catalogue (`catalogue.ts`) à la fiche qui rend sa
   page. Chargé uniquement par les routes d'articles : c'est lui qui tire le
   code des articles.

   POUR AJOUTER UN ARTICLE
     1. copier `_modele/` vers `<pays>/` (voir src/articles/LISEZ-MOI.md) ;
     2. remplir `<pays>/catalogue.ts` et `<pays>/fiche.tsx` ;
     3. ajouter l'entrée dans `catalogue.ts` et la fiche ci-dessous.
   ═══════════════════════════════════════════════════════════════════════════ */

const FICHES: Record<string, RenduArticle> = {
  france: articleFrance,
  // italie: articleItalie,     ← la fiche de l'article, sous le même slug que son entrée de catalogue
};

export const ARTICLES_DETTE: ArticleDette[] = CATALOGUE_DETTE.map((entree) => {
  const fiche = FICHES[entree.slug];
  if (!fiche) {
    throw new Error(`Article de dette « ${entree.slug} » : il est dans catalogue.ts mais sa fiche manque dans registre.ts.`);
  }
  return { ...entree, ...fiche };
});

export const articleRedige = (slug: string) => ARTICLES_DETTE.find((a) => a.slug === slug);
