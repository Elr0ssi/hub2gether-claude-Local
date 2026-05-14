// Shared color logic for the epidemics choropleth — used by both SVG and Leaflet maps.

// 4-stop gradient: dark kaki (few deaths) → neon green (most deaths)
const COLOR_STOPS: [number, number, number][] = [
  [ 40,  55,  30],  // dark kaki/olive
  [ 28, 120,  60],  // forest green
  [ 80, 195, 115],  // medium green
  [ 57, 255, 136],  // neon #39FF88
];

export function interpolateGreen(t: number): string {
  const n = COLOR_STOPS.length - 1;
  const seg = Math.min(t * n, n - 0.001);
  const i = Math.floor(seg);
  const lt = seg - i;
  const [r1, g1, b1] = COLOR_STOPS[i];
  const [r2, g2, b2] = COLOR_STOPS[i + 1];
  return `rgb(${Math.round(r1 + (r2 - r1) * lt)},${Math.round(g1 + (g2 - g1) * lt)},${Math.round(b1 + (b2 - b1) * lt)})`;
}

export function brightenRgb(color: string, amount: number): string {
  const m = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!m) return color;
  const c = (v: number) => Math.min(255, Math.max(0, v));
  return `rgb(${c(+m[1] + amount)},${c(+m[2] + amount)},${c(+m[3] + amount)})`;
}

export function getMaxDeaths(countries: Record<string, { deaths: number }>): number {
  return Math.max(...Object.values(countries).map((d) => d.deaths), 1);
}

export function getDeathIntensity(
  countryName: string,
  countries: Record<string, { deaths: number }>,
  maxDeaths: number
): number {
  const data = countries[countryName];
  if (!data || data.deaths === 0) return 0;
  return Math.log10(data.deaths + 1) / Math.log10(maxDeaths + 1);
}

export function getCountryFillColor(
  countryName: string,
  countries: Record<string, { deaths: number }>,
  maxDeaths: number,
  isHovered = false,
  isSelected = false
): string {
  if (isSelected) return "#39FF88";
  const t = getDeathIntensity(countryName, countries, maxDeaths);
  if (t === 0) return isHovered ? "#DCDCDC" : "#EBEBEB";
  const base = interpolateGreen(t);
  return isHovered ? brightenRgb(base, 25) : base;
}

export const GRADIENT_CSS =
  "linear-gradient(to right, rgb(40,55,30), rgb(28,120,60), rgb(80,195,115), rgb(57,255,136))";
