import type { Metadata } from "next";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LA FICHE D'UN ARTICLE DE DETTE

   Chaque article long écrit à la main déclare une « fiche » : tout ce que le
   reste du site doit savoir de lui sans en lire le contenu. Le site s'en sert
   pour la route, le référencement, le plan du site et les carrousels d'articles.

   On ne remplit jamais ces informations à plusieurs endroits : on écrit la fiche
   (`<pays>/fiche.tsx`), on l'ajoute à `registre.ts`, et le reste suit.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Ce que le site lit sans charger l'article : pour les liens, le plan du site, les carrousels.
 *  Léger exprès : aucun import de composant. Écrit dans `<pays>/catalogue.ts`. */
export interface EntreeCatalogue {
  /** L'identifiant du pays dans l'adresse : `italie`, `etats-unis`. Sans accents, en minuscules.
   *  C'est aussi le slug du dossier généré automatiquement qu'il remplace (voir `src/data/dettes/dossiers.ts`). */
  slug: string;
  /** Le nom français du pays : « Italie ». */
  pays: string;
  /** Le drapeau emoji : « 🇮🇹 ». */
  drapeau: string;
  /** Le titre de l'article tel qu'il s'affiche dans les cartes et les carrousels. */
  titre: string;
  /** Une à deux phrases : ce que l'article apporte. Affiché dans les cartes. */
  accroche: string;
  /** Dates ISO, `AAAA-MM-JJ`. `modifie` change à chaque mise à jour des chiffres. */
  publie: string;
  modifie: string;
  /** L'adresse canonique. Par défaut `/dette-publique/<slug>` ; la France garde la sienne
   *  (`/france/economie/dette-publique`) pour ne pas perdre son référencement. */
  url: string;
  /** Mots-clés qui rapprochent l'article d'un indicateur dans les carrousels (« dette · endettement · italie »). */
  mots: string;
}

/** Ce qui sert à rendre la page : chargé seulement par la route de l'article. Écrit dans `<pays>/fiche.tsx`. */
export interface RenduArticle {
  /** Titre, description, Open Graph : voir `france/fiche.tsx` pour un exemple complet. */
  metadata: Metadata;
  /** Les données structurées (JSON-LD) : Article, FAQPage, BreadcrumbList, Dataset… Le contenu doit
   *  correspondre exactement à ce que la page montre. */
  donneesStructurees: () => object[];
  /** Un résumé d'une phrase pour les moteurs de réponse : valeur, unité, période, source. Masqué à l'écran. Facultatif. */
  resume?: () => ReactNode;
  /** Le rendu de la page entière. */
  Composant: () => ReactNode;
}

export type ArticleDette = EntreeCatalogue & RenduArticle;
