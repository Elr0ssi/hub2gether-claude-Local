import SOCLE from "./genere/socle-demographie.json";

/**
 * Le socle démographique, brut.
 *
 * Contrairement au socle économique, il ne porte aucune saisie manuelle : la
 * base des Nations Unies (World Population Prospects 2024) couvre déjà les
 * 219 pays et territoires du fond de carte, de 1960 à 2026. Une année qu'elle
 * ne publie pas pour un pays reste absente — elle ne devient jamais zéro.
 */

export interface CountryDemographyData {
  /** Population au milieu de l'année. */
  population?: number;
  /** Taux de natalité, pour 1000 habitants. */
  birth_rate?: number;
  /** Taux de mortalité, pour 1000 habitants. */
  death_rate?: number;
  /** Accroissement naturel annuel (naissances moins décès), en personnes. */
  natural_change?: number;
  births_per_second?: number;
  deaths_per_second?: number;
  /** Solde migratoire net annuel, en personnes. */
  net_migration?: number;
}

export interface DemographyYear {
  year: number;
  countries: Record<string, CountryDemographyData>;
}

type SocleFiche = { iso3: string; iso2: string; series: (number | null)[][] };
const SOCLE_PAYS = SOCLE.pays as Record<string, SocleFiche>;

const CHAMPS_SOCLE = (SOCLE.colonnes as (keyof CountryDemographyData)[]).map(
  (champ, i) => [i, champ] as const,
);

export const DEMOGRAPHY_YEARS: DemographyYear[] = SOCLE.annees.map((annee, rang) => {
  const countries: DemographyYear["countries"] = {};
  for (const [nom, fiche] of Object.entries(SOCLE_PAYS)) {
    const cellule: CountryDemographyData = {};
    let porte = false;
    for (const [serie, champ] of CHAMPS_SOCLE) {
      const v = fiche.series[serie]?.[rang];
      if (v === null || v === undefined) continue;
      (cellule[champ] as number) = v;
      porte = true;
    }
    if (porte) countries[nom] = cellule;
  }
  return { year: annee, countries };
});

export function iso2DePaysDemo(name: string): string | undefined {
  return SOCLE_PAYS[name]?.iso2;
}

export const SOURCES_SOCLE_DEMO = SOCLE.sources as Record<
  string,
  { indicateur: string; libelle: string; source: string }
>;

export const DEMOGRAPHY_YEAR_VALUES = DEMOGRAPHY_YEARS.map((y) => y.year);
