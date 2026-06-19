import type { PoliticalOrientation, PoliticalPeriod } from "@/data/politics/politics";

export const ORIENTATION_COLORS: Record<PoliticalOrientation, string> = {
  far_left:  "#E57373",
  left:      "#F48FB1",
  center:    "#FFD54F",
  right:     "#90CAF9",
  far_right: "#1565C0",
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
): string {
  const period = politicsData[countryName];
  if (!period) return "#EBEBEB";
  return ORIENTATION_COLORS[period.orientation];
}
