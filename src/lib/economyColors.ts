import type { CountryEconomyData, EconomyMetricId } from "@/types";
import { interpolateGreen, brightenRgb, GRADIENT_CSS } from "./epidemicsColors";

export { interpolateGreen, brightenRgb, GRADIENT_CSS };

export function getMetricValue(data: CountryEconomyData, metric: EconomyMetricId): number | undefined {
  return data[metric] as number | undefined;
}

export function getMaxMetricValue(
  countries: Record<string, CountryEconomyData>,
  metric: EconomyMetricId
): number {
  const values = Object.values(countries)
    .map((d) => getMetricValue(d, metric))
    .filter((v): v is number => v !== undefined);
  if (values.length === 0) return 1;
  return Math.max(...values, 1);
}

export function getValueIntensity(
  countryName: string,
  countries: Record<string, CountryEconomyData>,
  maxValue: number,
  metric: EconomyMetricId
): number | null {
  const data = countries[countryName];
  if (!data) return null;
  const v = getMetricValue(data, metric);
  if (v === undefined) return null;
  // signed metric (deficits are valid data, not "missing") — min-max linear scale
  if (metric === "trade_balance") {
    const values = Object.values(countries)
      .map((d) => getMetricValue(d, metric))
      .filter((x): x is number => x !== undefined);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 0);
    if (max === min) return 0.5;
    return (v - min) / (max - min);
  }
  if (v === 0) return null;
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
  if (t === null) return "#EBEBEB";
  const base = interpolateGreen(t);
  return base;
}
