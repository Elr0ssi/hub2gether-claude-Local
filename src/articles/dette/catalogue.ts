import { entreeFrance } from "./france/catalogue";
import type { EntreeCatalogue } from "./types";

/* ═══════════════════════════════════════════════════════════════════════════
   LE CATALOGUE DES ARTICLES DE DETTE

   La liste LÉGÈRE : ce que le plan du site, les carrousels d'articles, les
   classements et les liens des autres pages lisent. Rien d'importé qui pèse :
   aucun composant, aucune donnée de graphique.

   Un article de plus = une ligne de plus ici ET une ligne dans `registre.ts`
   (qui, lui, charge la page). Un contrôle au démarrage signale l'oubli.
   ═══════════════════════════════════════════════════════════════════════════ */

export const CATALOGUE_DETTE: EntreeCatalogue[] = [
  entreeFrance,
  // entreeItalie,       ← un article de plus = une ligne de plus
];

/** L'adresse de la page de dette d'un pays : son article écrit à la main s'il existe
 *  (`/pays/<pays>/dette-publique`), sinon le dossier généré automatiquement (`/dette-publique/<pays>`). */
export const adresseDette = (slug: string) =>
  CATALOGUE_DETTE.find((a) => a.slug === slug)?.url ?? `/dette-publique/${slug}`;

export const estRedige = (slug: string) => CATALOGUE_DETTE.some((a) => a.slug === slug);
