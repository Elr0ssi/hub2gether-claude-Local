import type { CountryEconomyData, EconomyMetricId } from "@/types";
import { interpolateGreen, brightenRgb, GRADIENT_CSS } from "./epidemicsColors";

export { interpolateGreen, brightenRgb, GRADIENT_CSS };

export function getMetricValue(data: CountryEconomyData, metric: EconomyMetricId): number {
  return data[metric] as number;
}

export function getMaxMetricValue(
  countries: Record<string, CountryEconomyData>,
  metric: EconomyMetricId
): number {
  const values = Object.values(countries).map((d) => getMetricValue(d, metric));
  return Math.max(...values, 1);
}

export function getValueIntensity(
  countryName: string,
  countries: Record<string, CountryEconomyData>,
  maxValue: number,
  metric: EconomyMetricId
): number {
  const data = countries[countryName];
  if (!data) return 0;
  const v = getMetricValue(data, metric);
  if (v === 0) return 0;
  // log scale for GDP and companies (huge range), linear for ratios/percentages
  if (metric === "gdp" || metric === "companies") {
    return Math.log10(v + 1) / Math.log10(maxValue + 1);
  }
  return Math.min(v / maxValue, 1);
}

export function getCountryFillColorEconomy(
  countryName: string,
  countries: Record<string, CountryEconomyData>,
  maxValue: number,
  metric: EconomyMetricId,
  isHovered = false,
  isSelected = false
): string {
  const t = getValueIntensity(countryName, countries, maxValue, metric);
  if (t === 0) return "#EBEBEB";
  const base = interpolateGreen(t);
  return base;
}
