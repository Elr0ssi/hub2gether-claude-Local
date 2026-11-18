import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { socleEco, type SocleEco } from "@/data/concept/conceptEconomie";
import { socleDemo, type SocleDemo } from "@/data/concept/conceptDemographie";
import SOCLE_JSON from "@/data/economy/genere/socle-economie.json";
import { slugDe } from "./francais";

/* ═══════════════════════════════════════════════════════════════════════════
   LA BASE DES PAGES PAR PAYS

   Une fiche par pays, construite une fois à partir de la base du site : la
   dernière valeur publiée de chaque indicateur avec son année, le rang
   mondial, la superficie. Rien n'est inventé : un indicateur que les sources
   ne publient pas pour un pays reste absent de sa fiche, et des textes qui le
   citent.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Mesure {
  v: number;
  annee: number;
}

export interface FichePays {
  nom: string;
  fr: string;
  slug: string;
  iso2?: string;
  pib?: Mesure;
  pibHab?: Mesure;
  population?: Mesure;
  inflation?: Mesure;
  chomage?: Mesure;
  dette?: Mesure;
  balance?: Mesure;
  natalite?: Mesure;
  mortalite?: Mesure;
  /** Rang mondial à l'année de référence : 1 = la valeur la plus élevée. */
  rangs: Partial<Record<"pib" | "pibHab" | "population" | "superficie" | "densite" | "dette" | "inflation" | "chomage" | "natalite" | "mortalite" | "balance", { r: number; n: number }>>;
  /** Kilomètres carrés, d'après le fond de carte du site : une valeur approchée. */
  superficie?: number;
  densite?: number;
  /** Le PIB et la population à la première année publiée, pour dire d'où l'on vient. */
  pib1960?: Mesure;
  pop1960?: Mesure;
}

const AN_REF = 2025;
let cache: { liste: FichePays[]; parSlug: Map<string, FichePays>; parNom: Map<string, FichePays>; eco: SocleEco; demo: SocleDemo } | null = null;

function derniere(s: SocleEco | SocleDemo, idx: number, champ: string): Mesure | undefined {
  const annees = [...s.annees].reverse();
  for (const a of annees) {
    const i = (s.cols[a] ?? {})[champ];
    if (i === undefined) continue;
    const l = (s.lignes[a] ?? []).find((x) => x[0] === idx);
    const v = l ? l[i] : null;
    if (typeof v === "number" && Number.isFinite(v)) return { v, annee: a };
  }
  return undefined;
}
function premiere(s: SocleEco | SocleDemo, idx: number, champ: string): Mesure | undefined {
  for (const a of s.annees) {
    const i = (s.cols[a] ?? {})[champ];
    if (i === undefined) continue;
    const l = (s.lignes[a] ?? []).find((x) => x[0] === idx);
    const v = l ? l[i] : null;
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return { v, annee: a };
  }
  return undefined;
}

/** Aire d'un polygone sur la sphère, en km² (formule des géodésiques simplifiée). */
function aireAnneau(anneau: number[][]): number {
  const R = 6371.0088;
  let s = 0;
  for (let i = 0; i < anneau.length - 1; i++) {
    const [l1, p1] = anneau[i];
    const [l2, p2] = anneau[i + 1];
    s += ((l2 - l1) * Math.PI) / 180 * (2 + Math.sin((p1 * Math.PI) / 180) + Math.sin((p2 * Math.PI) / 180));
  }
  return Math.abs((s * R * R) / 2);
}
function superficies(): Record<string, number> {
  const sortie: Record<string, number> = {};
  try {
    const g = JSON.parse(readFileSync(join(process.cwd(), "public/geo/ne_110m_admin_0_countries.geojson"), "utf8")) as {
      features: { properties: { name?: string }; geometry: { type: string; coordinates: unknown } }[];
    };
    for (const f of g.features) {
      const nom = f.properties?.name;
      if (!nom) continue;
      const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates as number[][][]] : f.geometry.type === "MultiPolygon" ? (f.geometry.coordinates as number[][][][]) : [];
      let total = 0;
      for (const p of polys) {
        total += aireAnneau(p[0]);
        for (let h = 1; h < p.length; h++) total -= aireAnneau(p[h]);
      }
      if (total > 0) sortie[nom] = Math.round(total);
    }
  } catch {
    /* Sans fond de carte, les fiches se passent de superficie. */
  }
  return sortie;
}

function construit() {
  if (cache) return cache;
  const eco = socleEco();
  const demo = socleDemo();
  const iso = SOCLE_JSON.pays as Record<string, { iso2?: string }>;
  const aires = superficies();
  const idxDemo = new Map(demo.pays.map((p, i) => [p.nom, i]));

  const liste: FichePays[] = eco.pays.map((p, idx) => {
    const d = idxDemo.get(p.nom);
    const sup = aires[p.nom];
    const population = d === undefined ? undefined : derniere(demo, d, "population");
    const fiche: FichePays = {
      nom: p.nom,
      fr: p.fr,
      slug: slugDe(p.fr),
      iso2: iso[p.nom]?.iso2,
      pib: derniere(eco, idx, "gdp"),
      pibHab: derniere(eco, idx, "gdp_per_capita"),
      population,
      inflation: derniere(eco, idx, "inflation"),
      chomage: derniere(eco, idx, "unemployment"),
      dette: derniere(eco, idx, "debt_ratio"),
      balance: derniere(eco, idx, "trade_balance"),
      natalite: d === undefined ? undefined : derniere(demo, d, "birth_rate"),
      mortalite: d === undefined ? undefined : derniere(demo, d, "death_rate"),
      rangs: {},
      superficie: sup,
      densite: sup && population ? population.v / sup : undefined,
      pib1960: premiere(eco, idx, "gdp"),
      pop1960: d === undefined ? undefined : premiere(demo, d, "population"),
    };
    return fiche;
  });

  /* Les rangs : à une année commune, pour que « 7e » veuille dire quelque chose. */
  const anRef = (s: SocleEco | SocleDemo) => (s.annees.includes(AN_REF) ? AN_REF : s.annees[s.annees.length - 1]);
  const rangDe = (s: SocleEco | SocleDemo, idxDe: (nom: string) => number | undefined, champ: string, cle: "pib" | "pibHab" | "population") => {
    const an = anRef(s);
    const i = (s.cols[an] ?? {})[champ];
    if (i === undefined) return;
    const vals: { nom: string; v: number }[] = [];
    for (const f of liste) {
      const ix = idxDe(f.nom);
      if (ix === undefined) continue;
      const l = (s.lignes[an] ?? []).find((x) => x[0] === ix);
      const v = l ? l[i] : null;
      if (typeof v === "number") vals.push({ nom: f.nom, v });
    }
    vals.sort((a, b) => b.v - a.v);
    vals.forEach((x, k) => {
      const f = liste.find((y) => y.nom === x.nom);
      if (f) f.rangs[cle] = { r: k + 1, n: vals.length };
    });
  };
  const idxEco = new Map(eco.pays.map((p, i) => [p.nom, i]));
  rangDe(eco, (n) => idxEco.get(n), "gdp", "pib");
  rangDe(eco, (n) => idxEco.get(n), "gdp_per_capita", "pibHab");
  rangDe(demo, (n) => idxDemo.get(n), "population", "population");

  /* Les autres rangs : à la dernière valeur publiée de chaque pays. 1 = la valeur la plus élevée. */
  const dernieres: [FichePays["rangs"] extends Partial<Record<infer K, unknown>> ? K : never, (f: FichePays) => number | undefined][] = [
    ["superficie", (f) => f.superficie],
    ["densite", (f) => f.densite],
    ["dette", (f) => f.dette?.v],
    ["inflation", (f) => f.inflation?.v],
    ["chomage", (f) => f.chomage?.v],
    ["natalite", (f) => f.natalite?.v],
    ["mortalite", (f) => f.mortalite?.v],
    ["balance", (f) => f.balance?.v],
  ];
  for (const [cle, val] of dernieres) {
    const vals = liste.map((f) => ({ f, v: val(f) })).filter((x): x is { f: FichePays; v: number } => typeof x.v === "number" && Number.isFinite(x.v));
    vals.sort((a, b) => b.v - a.v);
    vals.forEach((x, k) => {
      x.f.rangs[cle] = { r: k + 1, n: vals.length };
    });
  }

  /* Un slug par pays : en cas de doublon, le nom d'origine départage. */
  const vus = new Set<string>();
  for (const f of liste) {
    if (vus.has(f.slug)) f.slug = `${f.slug}-${slugDe(f.nom)}`;
    vus.add(f.slug);
  }
  cache = { liste, parSlug: new Map(liste.map((f) => [f.slug, f])), parNom: new Map(liste.map((f) => [f.nom, f])), eco, demo };
  return cache;
}

export const tousLesPays = () => construit().liste;
export const paysParSlug = (slug: string) => construit().parSlug.get(slug);
export const paysParNom = (nom: string) => construit().parNom.get(nom);

/** Les pays qui reviennent le plus dans les recherches : les plus grosses économies et les plus peuplés. */
export function paysVedettes(n = 40): FichePays[] {
  const l = tousLesPays();
  const par = (cle: "pib" | "population") =>
    [...l].filter((f) => f.rangs[cle]).sort((a, b) => (a.rangs[cle]?.r ?? 999) - (b.rangs[cle]?.r ?? 999));
  const choisis: FichePays[] = [];
  const vus = new Set<string>();
  const a = par("pib");
  const b = par("population");
  for (let i = 0; choisis.length < n && i < 200; i++) {
    for (const f of [a[i], b[i]]) if (f && !vus.has(f.nom) && choisis.length < n) (vus.add(f.nom), choisis.push(f));
  }
  return choisis;
}

/** L'adresse d'une paire : toujours dans l'ordre alphabétique des adresses, pour qu'une comparaison n'ait qu'une page. */
export function slugPaire(a: FichePays, b: FichePays): string {
  const [x, y] = a.slug <= b.slug ? [a, b] : [b, a];
  return `${x.slug}-vs-${y.slug}`;
}
export function paireParSlug(slug: string): { a: FichePays; b: FichePays; canonique: string } | null {
  const m = slug.split("-vs-");
  if (m.length !== 2) return null;
  const a = paysParSlug(m[0]);
  const b = paysParSlug(m[1]);
  if (!a || !b || a.slug === b.slug) return null;
  return { a, b, canonique: slugPaire(a, b) };
}

/** Les paires pré-construites : toutes celles des pays vedettes. Les autres se construisent à la première visite. */
export function pairesVedettes(n = 40): [FichePays, FichePays][] {
  const v = paysVedettes(n);
  const sortie: [FichePays, FichePays][] = [];
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) sortie.push([v[i], v[j]]);
  return sortie;
}

/** Des pays de taille comparable : proches en rang de PIB. */
export function voisinsEco(f: FichePays, n = 6): FichePays[] {
  const r = f.rangs.pib?.r;
  if (!r) return [];
  return tousLesPays()
    .filter((x) => x.nom !== f.nom && x.rangs.pib)
    .sort((a, b) => Math.abs((a.rangs.pib?.r ?? 999) - r) - Math.abs((b.rangs.pib?.r ?? 999) - r))
    .slice(0, n);
}

/** Une série annuelle (PIB en Md$ ou population en personnes), pour les petits graphiques. */
export function serieDe(f: FichePays, type: "pib" | "population"): { annee: number; v: number }[] {
  const { eco, demo } = construit();
  const s = type === "pib" ? eco : demo;
  const idx = s.pays.findIndex((p) => p.nom === f.nom);
  const champ = type === "pib" ? "gdp" : "population";
  if (idx < 0) return [];
  const sortie: { annee: number; v: number }[] = [];
  for (const a of s.annees) {
    const i = (s.cols[a] ?? {})[champ];
    if (i === undefined) continue;
    const l = (s.lignes[a] ?? []).find((x) => x[0] === idx);
    const v = l ? l[i] : null;
    if (typeof v === "number" && Number.isFinite(v)) sortie.push({ annee: a, v });
  }
  return sortie;
}
