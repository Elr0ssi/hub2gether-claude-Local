import { CAUSES_MORTALITE, type CountryDemographyData, type DemographyMetricId } from "@/data/demographie/demographie";
import { interpolateGreen } from "./epidemicsColors";

/* ═══════════════════════════════════════════════════════════════════════════
   Même principe que economyColors.ts, pour les grandeurs démographiques.

   La population et les effectifs annuels (naissances, décès, chaque cause)
   suivent une échelle logarithmique, comme le PIB : l'écart entre l'Inde et
   Nauru couvre huit ordres de grandeur, un pas linéaire écraserait tout sauf
   les deux ou trois plus grands pays. Les deux taux (natalité, mortalité)
   restent linéaires — ils vivent tous dans la même fourchette, 0 à 50 pour
   1000. L'accroissement naturel et le solde migratoire sont signés : un pays
   qui perd de la population n'est pas une donnée absente, c'est une valeur
   légitime de l'autre côté de zéro.

   Ramené pour 100 000 habitants, un effectif redevient un taux : il quitte
   l'échelle logarithmique pour la même échelle linéaire que la natalité et
   la mortalité — comparer l'Inde et Nauru n'a alors plus rien d'écrasant.
   ═══════════════════════════════════════════════════════════════════════════ */

const SIGNES = new Set<DemographyMetricId>(["natural_change", "net_migration"]);
const LOG = new Set<DemographyMetricId>([
  "population",
  "births_annual",
  "deaths_annual",
  ...CAUSES_MORTALITE.map((c) => `${c}_annual` as DemographyMetricId),
]);

export function getMetricValueDemo(data: CountryDemographyData, metric: DemographyMetricId): number | undefined {
  return data[metric];
}

/** La valeur ramenée pour 100 000 habitants, ou la valeur brute si le pays
    n'a pas de population publiée pour l'année — jamais une division par
    zéro déguisée en résultat. */
function normalise(v: number, population: number | undefined, pour100k: boolean): number | null {
  if (!pour100k) return v;
  if (!population) return null;
  return (v / population) * 100000;
}

export function getMaxMetricValueDemo(
  countries: Record<string, CountryDemographyData>,
  metric: DemographyMetricId,
  pour100k = false,
): number {
  const values = Object.values(countries)
    .map((d) => {
      const v = getMetricValueDemo(d, metric);
      if (v === undefined) return undefined;
      const n = normalise(v, d.population, pour100k);
      return n === null ? undefined : n;
    })
    .filter((v): v is number => v !== undefined);
  if (values.length === 0) return 1;
  return Math.max(...values, 1);
}

/* Les bornes de l'échelle viennent des centiles, pas du minimum et du maximum :
   quelques pays hors norme (l'Inde, la Chine, un micro-État) ne doivent pas
   écraser tout le reste sur les mêmes deux ou trois teintes. */
interface Bornes {
  lo: number;
  hi: number;
  /** Les valeurs positives, triées : elles servent au rang pour les grandeurs en échelle « log ». */
  rang?: number[];
}
const BORNES = new WeakMap<object, Map<string, Bornes>>();

function centile(tri: number[], f: number): number {
  return tri[Math.min(tri.length - 1, Math.max(0, Math.round(f * (tri.length - 1))))];
}

function bornes(
  countries: Record<string, CountryDemographyData>,
  metric: DemographyMetricId,
  pour100k: boolean,
): Bornes {
  let m = BORNES.get(countries);
  if (!m) {
    m = new Map();
    BORNES.set(countries, m);
  }
  const clef = `${metric}|${pour100k ? 1 : 0}`;
  const connu = m.get(clef);
  if (connu) return connu;

  const tri = Object.values(countries)
    .map((d) => {
      const v = getMetricValueDemo(d, metric);
      return v === undefined ? null : normalise(v, d.population, pour100k);
    })
    .filter((v): v is number => v !== null && Number.isFinite(v))
    .sort((a, b) => a - b);

  let r: Bornes;
  if (tri.length === 0) r = { lo: 0, hi: 1 };
  else if (SIGNES.has(metric) && !pour100k) {
    const m95 = Math.max(Math.abs(centile(tri, 0.05)), Math.abs(centile(tri, 0.95)), 1e-9);
    r = { lo: -m95, hi: m95 };
  } else if (!pour100k && LOG.has(metric)) {
    const pos = tri.filter((v) => v > 0);
    const lo = Math.max(pos.length ? centile(pos, 0.03) : 1, 1);
    r = { lo, hi: Math.max(pos.length ? pos[pos.length - 1] : lo * 10, lo * 10), rang: pos };
  } else {
    const lo = centile(tri, 0.05);
    const hi = centile(tri, 0.95);
    r = { lo, hi: hi > lo ? hi : lo + 1 };
  }
  m.set(clef, r);
  return r;
}

export function getValueIntensityDemo(
  countryName: string,
  countries: Record<string, CountryDemographyData>,
  _maxValue: number,
  metric: DemographyMetricId,
  pour100k = false,
): number | null {
  const data = countries[countryName];
  if (!data) return null;
  const raw = getMetricValueDemo(data, metric);
  if (raw === undefined) return null;

  const { lo, hi, rang } = bornes(countries, metric, pour100k);

  if (SIGNES.has(metric) && !pour100k) {
    return Math.max(0, Math.min(1, 0.5 + (raw / hi) * 0.5));
  }

  const v = normalise(raw, data.population, pour100k);
  if (v === null || v === 0) return null;
  if (!pour100k && LOG.has(metric)) {
    if (v <= 0) return null;
    /* Le rang du pays parmi tous les autres, mêlé à sa position logarithmique :
       les teintes se répartissent sur toute la rampe au lieu de s'entasser
       du côté des très grandes valeurs. */
    const logT = Math.max(0, Math.min(1, (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))));
    if (!rang || rang.length < 2) return logT;
    let a = 0;
    let b = rang.length;
    while (a < b) {
      const m = (a + b) >> 1;
      if (rang[m] < v) a = m + 1;
      else b = m;
    }
    return 0.25 * logT + 0.75 * (a / (rang.length - 1));
  }
  return Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
}

export function getCountryFillColorDemo(
  countryName: string,
  countries: Record<string, CountryDemographyData>,
  maxValue: number,
  metric: DemographyMetricId,
  pour100k = false,
): string {
  const t = getValueIntensityDemo(countryName, countries, maxValue, metric, pour100k);
  if (t === null) return "#EBEBEB";
  return interpolateGreen(t);
}
