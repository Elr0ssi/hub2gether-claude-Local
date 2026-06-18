import type { PoliticalOrientation, PoliticalPeriod } from "@/data/politics/politics";

export const ORIENTATION_COLORS: Record<PoliticalOrientation, string> = {
  far_left:  "#8B1C1C",
  left:      "#C53030",
  center:    "#B7791F",
  right:     "#2B6CB0",
  far_right: "#1A365D",
};

export const ORIENTATION_LABELS: Record<PoliticalOrientation, string> = {
  far_left:  "Extrême gauche",
  left:      "Gauche",
  center:    "Centre",
  right:     "Droite",
  far_right: "Extrême droite",
};

export const ORIENTATION_ORDER: PoliticalOrientation[] = [
  "far_left", "left", "center", "right", "far_right",
];

export function getCountryFillColorPolitics(
  countryName: string,
  politicsData: Record<string, PoliticalPeriod>,
  isSelected: boolean
): string {
  if (isSelected) return "#39FF88";
  const period = politicsData[countryName];
  if (!period) return "#EBEBEB";
  return ORIENTATION_COLORS[period.orientation];
}
