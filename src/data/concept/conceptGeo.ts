import { ECONOMY_YEARS } from "@/data/economy/economy";
import { countryFr } from "@/data/countryNamesFr";
import { ARTICLES } from "@/data/articles";

/**
 * Les données pays du globe du prototype.
 *
 * Contrairement au reste de la maquette, ce bloc n'est PAS de la démonstration :
 * il vient du socle, à son dernier millésime publié. Le globe affiche donc de
 * vraies valeurs, et une année qu'une source ne publie pas reste absente.
 *
 * Lu côté serveur : seules les quelques valeurs par pays partent au navigateur,
 * jamais les 283 Ko de la base.
 */

export interface FichePays {
  fr: string;
  pib: number | null;
  pibHab: number | null;
  inflation: number | null;
  balance: number | null;
}

export function donneesPays(): { annee: number; pays: Record<string, FichePays> } {
  const y = ECONOMY_YEARS[ECONOMY_YEARS.length - 1];
  const pays: Record<string, FichePays> = {};
  for (const [nom, d] of Object.entries(y.countries)) {
    pays[nom] = {
      fr: countryFr(nom),
      pib: d.gdp ?? null,
      pibHab: d.gdp_per_capita ?? null,
      inflation: d.inflation ?? null,
      balance: d.trade_balance ?? null,
    };
  }
  return { annee: y.year, pays };
}

/** Les pays mis en avant par région, pour les étiquettes flottantes. */
export const REGIONS = [
  { id: "monde", label: "International", pays: ["United States of America", "China", "Germany", "Brazil", "India"] },
  { id: "ameriques", label: "Amériques", pays: ["United States of America", "Canada", "Brazil", "Mexico", "Argentina"] },
  { id: "europe", label: "Europe", pays: ["France", "Germany", "United Kingdom", "Italy", "Spain"] },
  { id: "asie", label: "Asie-Pacifique", pays: ["China", "Japan", "India", "Australia", "South Korea"] },
  { id: "afrique", label: "Afrique", pays: ["Nigeria", "South Africa", "Egypt", "Kenya", "Morocco"] },
] as const;

/** Où poser la caméra quand on change de région : de vraies longitudes, au
    centre de l'écran. */
export const VUES: Record<string, { lat: number; lon: number }> = {
  monde: { lat: 14, lon: -30 },
  ameriques: { lat: 12, lon: -84 },
  europe: { lat: 46, lon: 10 },
  asie: { lat: 26, lon: 104 },
  afrique: { lat: 4, lon: 20 },
};

/* ── Les articles ────────────────────────────────────────────────────────────
   On lit la base d'articles du site, pas une liste inventée pour la maquette.
   Seuls les champs affichés partent au navigateur — le corps des articles
   pèse plusieurs centaines de kilo-octets et n'a rien à faire ici. */

export interface FicheArticle {
  slug: string;
  titre: string;
  chapo: string;
  rubrique: string;
  duree: string;
}

const RUBRIQUES: Record<string, string> = {
  economy: "Économie",
  empires: "Empires",
  epidemics: "Épidémies",
  military: "Militaire",
  politics: "Politique",
};

export function articlesEnUne(n = 4): FicheArticle[] {
  return [...ARTICLES]
    /* Les articles mis en avant d'abord, puis les plus récents. */
    .sort((a, b) => {
      const f = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      return f !== 0 ? f : (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
    })
    .slice(0, n)
    .map((a) => ({
      slug: a.slug,
      titre: a.title,
      chapo: a.excerpt,
      rubrique: RUBRIQUES[a.theme] ?? a.theme,
      duree: a.readingTime ? `${a.readingTime} min` : "—",
    }));
}
