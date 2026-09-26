import type { CountryDemographyData, DemographyMetricId } from "@/data/demographie/demographie";
import { interpolateGreen } from "./epidemicsColors";

/* ═══════════════════════════════════════════════════════════════════════════
   Même principe que economyColors.ts, pour les cinq grandeurs démographiques.

   La population suit une échelle logarithmique, comme le PIB : l'écart entre
   l'Inde et Nauru couvre huit ordres de grandeur, un pas linéaire écraserait
   tout sauf les deux ou trois plus grands pays. Les deux taux (natalité,
   mortalité) restent linéaires — ils vivent tous dans la même fourchette,
   0 à 50 pour 1000. L'accroissement naturel et le solde migratoire sont
   signés : un pays qui perd de la population n'est pas une donnée absente,
   c'est une valeur légitime de l'autre côté de zéro.
   ═══════════════════════════════════════════════════════════════════════════ */

const SIGNES = new Set<DemographyMetricId>(["natural_change", "net_migration"]);

export function getMetricValueDemo(data: CountryDemographyData, metric: DemographyMetricId): number | undefined {
  return data[metric];
}

export function getMaxMetricValueDemo(
  countries: Record<string, CountryDemographyData>,
  metric: DemographyMetricId,
): number {
  const values = Object.values(countries)
    .map((d) => getMetricValueDemo(d, metric))
    .filter((v): v is number => v !== undefined);
  if (values.length === 0) return 1;
  return Math.max(...values, 1);
}

export function getValueIntensityDemo(
  countryName: string,
  countries: Record<string, CountryDemographyData>,
  maxValue: number,
  metric: DemographyMetricId,
): number | null {
  const data = countries[countryName];
  if (!data) return null;
  const v = getMetricValueDemo(data, metric);
  if (v === undefined) return null;

  if (SIGNES.has(metric)) {
    const values = Object.values(countries)
      .map((d) => getMetricValueDemo(d, metric))
      .filter((x): x is number => x !== undefined);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 0);
    if (max === min) return 0.5;
    return (v - min) / (max - min);
  }

  if (v === 0) return null;
  if (metric === "population") {
    return Math.log10(v + 1) / Math.log10(maxValue + 1);
  }
  // Natalité, mortalité : linéaires, toutes deux dans la même fourchette.
  return Math.max(0, Math.min(v / maxValue, 1));
}

export function getCountryFillColorDemo(
  countryName: string,
  countries: Record<string, CountryDemographyData>,
  maxValue: number,
  metric: DemographyMetricId,
): string {
  const t = getValueIntensityDemo(countryName, countries, maxValue, metric);
  if (t === null) return "#EBEBEB";
  return interpolateGreen(t);
}
