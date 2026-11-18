import type { Continent, IndicateurId, JeuRessource, Observation, Zone, ZoneFiltre } from "./types";

/* ═══════════════════════════════════════════════════════════════════════════
   RESSOURCES : LES CALCULS

   Des fonctions pures sur un jeu importé. Aucune valeur n'est produite sans ligne source : une année absente reste absente,
   un total « monde » est recalculé et nommé comme tel, un rendement n'est jamais dérivé de la production et de la surface.
   ═══════════════════════════════════════════════════════════════════════════ */

export const FLAGS: Record<string, { libelle: string; court: string }> = {
  A: { libelle: "Valeur officielle", court: "Officielle" },
  E: { libelle: "Valeur estimée", court: "Estimée" },
  I: { libelle: "Valeur imputée par un organisme destinataire", court: "Imputée" },
  X: { libelle: "Valeur d'une organisation externe", court: "Source externe" },
  M: { libelle: "Valeur manquante : la donnée ne peut pas exister", court: "Manquante" },
};
export const flagLibelle = (f: string) => FLAGS[f]?.court ?? f;

export const CONTINENTS: Continent[] = ["Europe", "Afrique", "Amériques", "Asie", "Océanie"];

/** Les cadrages du globe par zone (centre et étendue en degrés) : une présentation, pas une donnée. */
export const VUES_ZONE: Record<ZoneFiltre, { lat: number; lon: number; largeur: number; hauteur: number } | null> = {
  Monde: null,
  Europe: { lat: 52, lon: 15, largeur: 56, hauteur: 34 },
  Afrique: { lat: 3, lon: 20, largeur: 78, hauteur: 76 },
  Amériques: { lat: 8, lon: -80, largeur: 62, hauteur: 108 },
  Asie: { lat: 33, lon: 92, largeur: 100, hauteur: 64 },
  Océanie: { lat: -25, lon: 146, largeur: 64, hauteur: 44 },
};

export interface Index {
  parM49: Map<string, Zone>;
  parNe: Map<string, Zone>;
}

export function indexer(J: JeuRessource): Index {
  const parM49 = new Map(J.zones.map((z) => [z.m49, z]));
  const parNe = new Map<string, Zone>();
  for (const z of J.zones) if (z.ne && z.type === "pays") parNe.set(z.ne, z);
  return { parM49, parNe };
}

const idx = (J: JeuRessource, an: number) => an - J.annees[0];

/** L'observation d'un pays pour un indicateur et une année EXACTE ; null si la ligne manque ou si la valeur est manquante. */
export function obs(J: JeuRessource, m49: string, ind: IndicateurId, an: number): Observation | null {
  const s = J.series[m49]?.[ind];
  const i = idx(J, an);
  if (!s || i < 0 || i >= s.v.length) return null;
  const v = s.v[i];
  if (v === null || v === undefined) return null;
  return { valeur: v, annee: an, flag: s.f[i], nonOfficielle: s.n[i] === "1" };
}

/** Une ligne existe dans le CSV mais sa valeur est manquante (flag M) : à montrer comme manquante, jamais comme zéro. */
export function manquante(J: JeuRessource, m49: string, ind: IndicateurId, an: number): boolean {
  const s = J.series[m49]?.[ind];
  const i = idx(J, an);
  return !!s && i >= 0 && i < s.f.length && s.f[i] !== " " && s.v[i] === null;
}

/** La dernière observation disponible jusqu'à une année (comprise). Son année réelle est dans le résultat. */
export function derniere(J: JeuRessource, m49: string, ind: IndicateurId, jusqua: number = J.annees[1]): Observation | null {
  for (let a = Math.min(jusqua, J.annees[1]); a >= J.annees[0]; a--) {
    const o = obs(J, m49, ind, a);
    if (o) return o;
  }
  return null;
}

/** Tous les points d'une série, avec leur flag : null quand la valeur manque. */
export function points(J: JeuRessource, m49: string, ind: IndicateurId) {
  const s = J.series[m49]?.[ind];
  const out: { annee: number; valeur: number | null; flag: string; nonOfficielle: boolean }[] = [];
  if (!s) return out;
  for (let i = 0; i < s.v.length; i++) if (s.f[i] !== " ") out.push({ annee: J.annees[0] + i, valeur: s.v[i], flag: s.f[i], nonOfficielle: s.n[i] === "1" });
  return out;
}

/** Le total recalculé du jeu pour une année (production, surface) : somme des entités présentes. Pas de total pour un rendement. */
export function totalMonde(J: JeuRessource, ind: IndicateurId, an: number): { valeur: number; entites: number } | null {
  const m = J.monde[ind];
  const i = idx(J, an);
  if (!m || i < 0 || m.v[i] === null) return null;
  return { valeur: m.v[i] as number, entites: m.n[i] };
}

export interface LigneClassement {
  rang: number;
  m49: string;
  nom: string;
  type: Zone["type"];
  continent: Continent | null;
  valeur: number;
  flag: string;
  nonOfficielle: boolean;
  /** Le même indicateur l'année de comparaison, s'il existe. */
  avant: Observation | null;
  /** Évolution en % par rapport à l'année de comparaison. */
  evolution: number | null;
  /** Part du total recalculé (production, surface), ou null. */
  part: number | null;
}

/**
 * Le classement d'une année : les entités ayant une valeur cette année-là, sans l'agrégat « China » (qui recouvre 156 et 158).
 * Les entités historiques y figurent quand l'année est la leur (URSS en 1985), jamais mélangées à leurs successeurs (aucun recouvrement).
 */
export function classement(J: JeuRessource, ind: IndicateurId, an: number, zone: ZoneFiltre = "Monde", comparaison = 10): LigneClassement[] {
  const total = totalMonde(J, ind, an)?.valeur ?? null;
  const lignes: Omit<LigneClassement, "rang">[] = [];
  for (const z of J.zones) {
    if (z.type === "agregat" || z.type === "inconnu") continue;
    if (zone !== "Monde" && z.continent !== zone) continue;
    const o = obs(J, z.m49, ind, an);
    if (!o) continue;
    const avant = obs(J, z.m49, ind, an - comparaison);
    lignes.push({
      m49: z.m49, nom: z.nom, type: z.type, continent: z.continent, valeur: o.valeur, flag: o.flag, nonOfficielle: o.nonOfficielle,
      avant,
      evolution: avant && avant.valeur > 0 ? ((o.valeur - avant.valeur) / avant.valeur) * 100 : null,
      part: total && J.monde[ind] ? (o.valeur / total) * 100 : null,
    });
  }
  lignes.sort((a, b) => b.valeur - a.valeur || a.nom.localeCompare(b.nom));
  return lignes.map((l, i) => ({ ...l, rang: i + 1 }));
}

/** Le rang d'une entité dans un classement déjà calculé. Les ex æquo gardent l'ordre alphabétique : le rang est celui de la ligne. */
export const rangDe = (cl: LigneClassement[], m49: string) => cl.find((l) => l.m49 === m49) ?? null;

/** Les seuils des classes de couleur : quantiles des valeurs positives, arrondis à deux chiffres significatifs. */
export function seuils(valeurs: number[], nClasses = 6): number[] {
  const v = valeurs.filter((x) => x > 0).sort((a, b) => a - b);
  if (v.length < 3) return [];
  const qs = nClasses === 6 ? [0.25, 0.5, 0.75, 0.9, 0.97] : Array.from({ length: nClasses - 1 }, (_, i) => (i + 1) / nClasses);
  const arrondi = (x: number) => {
    const p = Math.pow(10, Math.floor(Math.log10(x)) - 1);
    return Math.round(x / p) * p;
  };
  const out: number[] = [];
  for (const q of qs) {
    const x = arrondi(v[Math.min(v.length - 1, Math.floor(q * v.length))]);
    if (!out.length || x > out[out.length - 1]) out.push(x);
  }
  return out;
}

export const classeDe = (x: number, s: number[]) => s.reduce((c, t) => (x >= t ? c + 1 : c), 0);

/** Un nombre lisible avec ses unités : 1 234 567 → « 1,23 M ». L'unité est ajoutée par l'appelant. */
export function court(x: number): string {
  const a = Math.abs(x);
  const f = (n: number, d = 2) => n.toLocaleString("fr-FR", { maximumFractionDigits: d });
  if (a >= 1e9) return `${f(x / 1e9)} Md`;
  if (a >= 1e6) return `${f(x / 1e6)} M`;
  if (a >= 1e4) return `${f(x / 1e3, 1)} k`;
  return f(x, a < 10 ? 2 : 0);
}
export const complet = (x: number) => x.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

export const UNITES_LIBELLE: Record<string, string> = { t: "tonnes", ha: "hectares", "kg/ha": "kg/ha" };
export const NOMS_INDICATEUR: Record<string, string> = { production: "Production", surface: "Surface récoltée", rendement: "Rendement" };
