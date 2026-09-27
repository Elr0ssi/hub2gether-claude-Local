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

export function getValueIntensityDemo(
  countryName: string,
  countries: Record<string, CountryDemographyData>,
  maxValue: number,
  metric: DemographyMetricId,
  pour100k = false,
): number | null {
  const data = countries[countryName];
  if (!data) return null;
  const raw = getMetricValueDemo(data, metric);
  if (raw === undefined) return null;

  if (SIGNES.has(metric) && !pour100k) {
    const values = Object.values(countries)
      .map((d) => getMetricValueDemo(d, metric))
      .filter((x): x is number => x !== undefined);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 0);
    if (max === min) return 0.5;
    return (raw - min) / (max - min);
  }

  const v = normalise(raw, data.population, pour100k);
  if (v === null || v === 0) return null;
  if (!pour100k && LOG.has(metric)) {
    return Math.log10(v + 1) / Math.log10(maxValue + 1);
  }
  return Math.max(0, Math.min(v / maxValue, 1));
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
