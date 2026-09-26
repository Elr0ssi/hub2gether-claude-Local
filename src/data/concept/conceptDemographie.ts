import { DEMOGRAPHY_YEARS, SOURCES_SOCLE_DEMO } from "@/data/demographie/demographie";
import { countryFr } from "@/data/countryNamesFr";

/**
 * Le socle démographique, préparé pour le prototype.
 *
 * Même principe que le socle économique : aucune donnée n'est réécrite, la
 * base des Nations Unies traverse telle quelle, année par année. Le format
 * compact laisse la frise passer de 1960 à 2026 sans aller-retour serveur.
 */

export type Ligne = (number | null)[];

export interface SocleDemo {
  annees: number[];
  pays: { nom: string; fr: string }[];
  cols: Record<number, Record<string, number>>;
  lignes: Record<number, Ligne[]>;
}

/* Cinq grandeurs comparables d'un pays à l'autre — le nombre de naissances
   et de décès par seconde ne le sont pas, ce sont les compteurs en direct
   qui s'en servent, pas le classement. */
const CHAMPS: [string, number][] = [
  ["population", 0],
  ["birth_rate", 2],
  ["death_rate", 2],
  ["natural_change", 0],
  ["net_migration", 0],
];

export function socleDemo(): SocleDemo {
  const index = new Map<string, number>();
  const pays: SocleDemo["pays"] = [];
  const lignes: Record<number, Ligne[]> = {};
  const cols: Record<number, Record<string, number>> = {};

  for (const y of DEMOGRAPHY_YEARS) {
    const fiches = Object.entries(y.countries);

    const publies = CHAMPS.filter(([c]) =>
      fiches.some(([, d]) => {
        const v = (d as Record<string, number | undefined>)[c];
        return v !== undefined && Number.isFinite(v);
      }),
    );
    const place: Record<string, number> = {};
    publies.forEach(([c], i) => {
      place[c] = i + 1;
    });

    const l: Ligne[] = [];
    for (const [nom, d] of fiches) {
      let id = index.get(nom);
      if (id === undefined) {
        id = pays.length;
        index.set(nom, id);
        pays.push({ nom, fr: countryFr(nom) });
      }
      const vals = publies.map(([c, dec]) => {
        const v = (d as Record<string, number | undefined>)[c];
        if (v === undefined || !Number.isFinite(v)) return null;
        const p = Math.pow(10, dec);
        return Math.round(v * p) / p;
      });
      if (vals.every((v) => v === null)) continue;
      l.push([id, ...vals]);
    }
    lignes[y.year] = l;
    cols[y.year] = place;
  }

  return { annees: DEMOGRAPHY_YEARS.map((y) => y.year), pays, cols, lignes };
}

/* ── Le globe ────────────────────────────────────────────────────────────── */

export interface FichePaysDemo {
  fr: string;
  population: number | null;
  natalite: number | null;
  mortalite: number | null;
  /** Naissances moins décès, pour 1000 habitants — comparable quelle que
      soit la taille du pays, contrairement à l'accroissement en personnes. */
  croissance: number | null;
}

export function donneesPaysDemo(): { annee: number; pays: Record<string, FichePaysDemo> } {
  const y = DEMOGRAPHY_YEARS[DEMOGRAPHY_YEARS.length - 1];
  const pays: Record<string, FichePaysDemo> = {};
  for (const [nom, d] of Object.entries(y.countries)) {
    const natalite = d.birth_rate ?? null;
    const mortalite = d.death_rate ?? null;
    pays[nom] = {
      fr: countryFr(nom),
      population: d.population ?? null,
      natalite,
      mortalite,
      croissance: natalite !== null && mortalite !== null ? natalite - mortalite : null,
    };
  }
  return { annee: y.year, pays };
}

/* ── Le bandeau en temps réel ────────────────────────────────────────────── */

export interface CompteurDemo {
  annee: number;
  population: number;
  naissancesParSeconde: number;
  decesParSeconde: number;
  nPays: number;
}

/** La dernière année publiée, sommée sur tous les pays du socle : c'est la
    base et le débit du compteur de population en direct. */
export function compteurDemo(): CompteurDemo {
  const y = DEMOGRAPHY_YEARS[DEMOGRAPHY_YEARS.length - 1];
  let population = 0;
  let naissances = 0;
  let deces = 0;
  let n = 0;
  for (const d of Object.values(y.countries)) {
    if (typeof d.population === "number") {
      population += d.population;
      n += 1;
    }
    if (typeof d.births_per_second === "number") naissances += d.births_per_second;
    if (typeof d.deaths_per_second === "number") deces += d.deaths_per_second;
  }
  return { annee: y.year, population, naissancesParSeconde: naissances, decesParSeconde: deces, nPays: n };
}

export interface LigneSourceDemo {
  libelle: string;
  source: string;
}

export function sourcesDemo(): LigneSourceDemo[] {
  return Object.values(SOURCES_SOCLE_DEMO).map((f) => ({ libelle: f.libelle, source: f.source }));
}
