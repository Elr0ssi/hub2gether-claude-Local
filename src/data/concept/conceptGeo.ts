import { ECONOMY_YEARS } from "@/data/economy/economy";
import { countryFr } from "@/data/countryNamesFr";
import { ARTICLES } from "@/data/articles";
import { getPopulationMillions } from "@/data/economy/populationData";

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
  /* Facultatifs : la page Monde n'en a pas besoin, la page Économie s'en
     sert. Absents, les indicateurs correspondants ne sont pas proposés. */
  dette?: number | null;
  chomage?: number | null;
  population?: number | null;
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
      dette: d.debt_ratio ?? null,
      chomage: d.unemployment ?? null,
      population: getPopulationMillions(nom, y.year) ?? null,
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

/* ── Le bandeau de repères ───────────────────────────────────────────────────
   Des agrégats calculés sur le socle, pas des cours de marché inventés. Rien
   ici n'est « en direct » : ce sont des millésimes annuels, et le bandeau le
   dit. Une valeur qu'on ne peut pas calculer n'apparaît pas. */

export interface Repere {
  nom: string;
  valeur: string;
  note: string;
}

export function reperes(): { annee: number; liste: Repere[] } {
  const y = ECONOMY_YEARS[ECONOMY_YEARS.length - 1];
  const pays = Object.entries(y.countries);

  let pib = 0;
  let nPib = 0;
  let excedent = 0;
  let nBal = 0;
  const inflations: number[] = [];
  let pop = 0;
  let nPop = 0;
  let pibHabHaut: { nom: string; v: number } | null = null;

  for (const [nom, d] of pays) {
    if (d.gdp !== undefined) {
      pib += d.gdp;
      nPib += 1;
    }
    if (d.trade_balance !== undefined) {
      nBal += 1;
      if (d.trade_balance > 0) excedent += 1;
    }
    if (d.inflation !== undefined) inflations.push(d.inflation);
    if (d.gdp_per_capita !== undefined && (!pibHabHaut || d.gdp_per_capita > pibHabHaut.v)) {
      pibHabHaut = { nom: countryFr(nom), v: d.gdp_per_capita };
    }
    const p = getPopulationMillions(nom, y.year);
    if (p !== undefined) {
      pop += p;
      nPop += 1;
    }
  }

  inflations.sort((a, b) => a - b);
  const med = inflations.length
    ? inflations.length % 2
      ? inflations[(inflations.length - 1) / 2]
      : (inflations[inflations.length / 2 - 1] + inflations[inflations.length / 2]) / 2
    : null;

  const fr = (n: number) => Math.round(n).toLocaleString("fr-FR");
  const liste: Repere[] = [];
  if (nPib) {
    liste.push({ nom: "PIB mondial", valeur: `${(pib / 1000).toFixed(1).replace(".", ",")} T€`, note: `${nPib} pays` });
  }
  if (nPop) {
    liste.push({ nom: "Population", valeur: `${(pop / 1000).toFixed(2).replace(".", ",")} Md`, note: `${nPop} pays` });
  }
  if (med !== null) {
    liste.push({ nom: "Inflation médiane", valeur: `${med.toFixed(1).replace(".", ",")} %`, note: `${inflations.length} pays` });
  }
  if (nBal) {
    liste.push({ nom: "Balances excédentaires", valeur: `${excedent} / ${nBal}`, note: "pays" });
  }
  if (nPib) {
    liste.push({ nom: "PIB moyen par pays", valeur: `${fr(pib / nPib)} Md€`, note: `${nPib} pays` });
  }
  if (pibHabHaut) {
    liste.push({ nom: "PIB / habitant le plus haut", valeur: `${fr(pibHabHaut.v)} €`, note: pibHabHaut.nom });
  }
  liste.push({ nom: "Pays au socle", valeur: String(pays.length), note: "fiches" });

  return { annee: y.year, liste };
}
