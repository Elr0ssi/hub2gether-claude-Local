import "server-only";
import type { FicheArticle } from "@/data/concept/conceptGeo";
import { CATALOGUE_DETTE, estRedige } from "@/articles/dette/catalogue";
import { ANALYSES } from "./analyses";
import { tousLesDossiers } from "./dossiers";

/* ═══════════════════════════════════════════════════════════════════════════
   LES ARTICLES DE DETTE, VUS COMME DES FICHES

   Les analyses comparatives et les dossiers par pays sont de vrais articles :
   ils entrent dans les files d'articles du site, à côté des lectures de la
   rédaction, avec leur adresse.
   ═══════════════════════════════════════════════════════════════════════════ */

const RUBRIQUE = "Dette publique";

/** Les analyses, puis les dossiers des pays aux plus grosses dettes. */
export function articlesDette(nDossiers = 10): FicheArticle[] {
  /* Les articles écrits à la main d'abord : ce sont les plus riches. */
  const rediges: FicheArticle[] = CATALOGUE_DETTE.map((a) => ({
    slug: `dette-article-${a.slug}`,
    titre: a.titre,
    chapo: a.accroche,
    rubrique: RUBRIQUE,
    duree: "12 min",
    mots: a.mots,
    href: a.url,
  }));
  const analyses: FicheArticle[] = ANALYSES.map((a) => ({
    slug: `dette-analyse-${a.slug}`,
    titre: `${a.h1[0]} ${a.h1[1]}`.replace(/\s+/g, " ").trim(),
    chapo: a.accroche,
    rubrique: RUBRIQUE,
    duree: "5 min",
    mots: `dette · endettement · ${a.titre}`.toLowerCase(),
    href: `/dette-publique/analyses/${a.slug}`,
  }));
  const dossiers: FicheArticle[] = tousLesDossiers()
    .filter((d) => !estRedige(d.slug))
    .sort((a, b) => b.d2024 - a.d2024)
    .slice(0, nDossiers)
    .map((d) => ({
      slug: `dette-pays-${d.slug}`,
      titre: `Dette publique : ${d.fr}`,
      chapo: `Montant, poids dans le PIB, évolution depuis 2000, créanciers et inflation : le dossier complet.`,
      rubrique: RUBRIQUE,
      duree: "4 min",
      mots: `dette · endettement · ${d.fr}`.toLowerCase(),
      href: `/dette-publique/${d.slug}`,
    }));
  return [...rediges, ...analyses, ...dossiers];
}
