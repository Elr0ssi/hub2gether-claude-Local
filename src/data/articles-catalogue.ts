import "server-only";
import { CATALOGUE_DETTE, adresseDette, estRedige } from "@/articles/dette/catalogue";
import { ANALYSES } from "@/data/dettes/analyses";
import { tousLesDossiers } from "@/data/dettes/dossiers";
import { ARTICLES } from "@/data/articles";
import { paysParNom, tousLesPays } from "@/data/seo/pays";

/* ═══════════════════════════════════════════════════════════════════════════
   LE CATALOGUE DE TOUS LES ARTICLES DU SITE

   Une seule liste, lue par la page « Tous les articles » (/articles) et par
   la section « Articles sur <pays> » des fiches pays. Elle réunit :
     - les articles longs écrits à la main      (src/articles/)
     - les analyses comparatives de dette       (src/data/dettes/analyses.ts)
     - les dossiers de dette par pays           (src/data/dettes/dossiers.ts)
     - les lectures plus anciennes              (src/data/<thème>/articles.ts)

   Rien ne s'ajoute ici à la main : un article nouveau entre dans le catalogue
   en s'inscrivant là où il vit (voir src/articles/LISEZ-MOI.md).
   ═══════════════════════════════════════════════════════════════════════════ */

export type TypeArticle = "Article long" | "Analyse" | "Dossier pays" | "Lecture";

export interface FicheCatalogue {
  id: string;
  titre: string;
  chapo: string;
  href: string;
  /** La rubrique : « Dette publique », « Économie », « Épidémies »… */
  rubrique: string;
  type: TypeArticle;
  /** Les pays dont l'article parle : slug de leur fiche et nom français. */
  pays: { slug: string; fr: string }[];
  /** Tags en minuscules, pour la recherche. */
  mots: string;
  /** Les articles de référence passent en tête. */
  vedette: boolean;
}

const RUBRIQUES: Record<string, string> = {
  economy: "Économie",
  epidemics: "Épidémies",
  empires: "Empires",
  military: "Militaire",
  politics: "Politique",
  conflicts: "Conflits",
};

const euros = { m: (v: number) => `${Math.round(v)} Md€`, u: (v: number) => `${Math.round(v)} €` };
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

let cache: FicheCatalogue[] | null = null;

export function tousLesArticles(): FicheCatalogue[] {
  if (cache) return cache;
  const dossiers = tousLesDossiers();
  const paysDe = (slugDossier: string) => {
    const d = dossiers.find((x) => x.slug === slugDossier);
    const p = d ? paysParNom(d.nom) : undefined;
    return p ? { slug: p.slug, fr: p.fr } : undefined;
  };

  const longs: FicheCatalogue[] = CATALOGUE_DETTE.map((a) => {
    const p = paysDe(a.slug);
    return {
      id: `long-${a.slug}`,
      titre: a.titre,
      chapo: a.accroche,
      href: a.url,
      rubrique: "Dette publique",
      type: "Article long",
      pays: p ? [p] : [{ slug: a.slug, fr: a.pays }],
      mots: norm(`${a.mots} ${a.pays}`),
      vedette: true,
    };
  });

  const analyses: FicheCatalogue[] = ANALYSES.map((a) => {
    const contenu = a.contenu(dossiers, euros);
    const slugs = new Set(contenu.tableaux.flatMap((t) => t.lignes.map((l) => l.slug)));
    const pays = [...slugs].map(paysDe).filter((p): p is { slug: string; fr: string } => Boolean(p));
    return {
      id: `analyse-${a.slug}`,
      titre: `${a.h1[0]} ${a.h1[1]}`.replace(/\s+/g, " ").trim(),
      chapo: a.accroche,
      href: `/dette-publique/analyses/${a.slug}`,
      rubrique: "Dette publique",
      type: "Analyse",
      pays,
      mots: norm(`dette endettement ${a.titre}`),
      vedette: false,
    };
  });

  const dossiersFiches: FicheCatalogue[] = dossiers
    .filter((d) => !estRedige(d.slug))
    .map((d) => {
      const p = paysParNom(d.nom);
      return {
        id: `dossier-${d.slug}`,
        titre: `Dette publique : ${d.fr}`,
        chapo: "Montant, poids dans le PIB, évolution depuis 2000, créanciers et inflation.",
        href: adresseDette(d.slug),
        rubrique: "Dette publique",
        type: "Dossier pays",
        pays: p ? [{ slug: p.slug, fr: p.fr }] : [],
        mots: norm(`dette endettement ${d.fr}`),
        vedette: false,
      };
    });

  const noms = tousLesPays().map((p) => ({ slug: p.slug, fr: p.fr, n: norm(p.fr) }));
  const lectures: FicheCatalogue[] = ARTICLES.filter((a) => a.slug !== "dette-publique-france-2025-enjeux").map((a) => {
    const texte = norm(`${a.title} ${a.tags.join(" ")}`);
    const pays = noms
      .filter((p) => p.n.length > 3 && new RegExp(`(^|[^a-z])${p.n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`).test(texte))
      .map((p) => ({ slug: p.slug, fr: p.fr }));
    return {
      id: `lecture-${a.slug}`,
      titre: a.title,
      chapo: a.excerpt,
      href: `/articles/${a.slug}`,
      rubrique: RUBRIQUES[a.theme] ?? a.theme,
      type: "Lecture",
      pays,
      mots: norm(`${a.title} ${a.tags.join(" ")}`),
      vedette: false,
    };
  });

  cache = [...longs, ...analyses, ...lectures, ...dossiersFiches];
  return cache;
}

/** Les articles qui parlent d'un pays : son article long ou son dossier d'abord, puis le reste. */
export function articlesDuPays(slug: string): FicheCatalogue[] {
  const tous = tousLesArticles().filter((a) => a.pays.some((p) => p.slug === slug));
  const poids = (a: FicheCatalogue) => (a.type === "Article long" ? 0 : a.type === "Dossier pays" ? 1 : a.type === "Analyse" ? 2 : 3);
  return tous.sort((a, b) => poids(a) - poids(b));
}
