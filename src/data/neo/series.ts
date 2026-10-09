import { ECONOMY_YEARS } from "@/data/economy/economy";
import { countryFr } from "@/data/countryNamesFr";
import type { CountryEconomyData } from "@/types";

/**
 * L'accès aux séries pays par pays, pour le tableau de bord de comparaison.
 *
 * Lu côté serveur uniquement : la route `/api/series` n'envoie au navigateur
 * que les quelques séries demandées, jamais les 283 Ko du socle. Une année
 * que la source ne publie pas ressort en `null` et reste un trou dans la
 * courbe — elle n'est jamais comblée par un zéro ni par une interpolation.
 */

export const CHAMPS = {
  gdp: { label: "PIB", unite: "Md€", entier: true },
  gdp_per_capita: { label: "PIB par habitant", unite: "€", entier: true },
  trade_balance: { label: "Balance commerciale", unite: "Md€", entier: true },
  inflation: { label: "Inflation", unite: "%", entier: false },
} as const;

export type Champ = keyof typeof CHAMPS;

export const ANNEES = ECONOMY_YEARS.map((y) => y.year);

/** Tous les pays de la base, avec leur libellé français, triés à la française. */
export function listePays(): { cle: string; label: string }[] {
  const vus = new Set<string>();
  for (const y of ECONOMY_YEARS) for (const nom of Object.keys(y.countries)) vus.add(nom);
  return [...vus]
    .map((cle) => ({ cle, label: countryFr(cle) }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

/** La série d'un pays sur un indicateur, alignée sur ANNEES. */
export function serie(cle: string, champ: Champ): (number | null)[] {
  return ECONOMY_YEARS.map((y) => {
    const d = y.countries[cle] as CountryEconomyData | undefined;
    const v = d?.[champ];
    return typeof v === "number" ? v : null;
  });
}

/** Les pays qui pèsent le plus sur la dernière année : la sélection d'entrée. */
export function paysParDefaut(n = 4): string[] {
  const derniere = ECONOMY_YEARS[ECONOMY_YEARS.length - 1];
  return Object.entries(derniere.countries)
    .filter(([, d]) => d.gdp !== undefined)
    .sort((a, b) => (b[1].gdp as number) - (a[1].gdp as number))
    .slice(0, n)
    .map(([nom]) => nom);
}
