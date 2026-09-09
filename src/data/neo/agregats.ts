import { ECONOMY_YEARS } from "@/data/economy/economy";
import { countryFr } from "@/data/countryNamesFr";

/**
 * Les agrégats de la page d'accueil « neo ».
 *
 * Tout est dérivé du socle — aucune valeur n'est saisie ici. Le socle ne
 * couvre pas tous les pays sur toutes les années : une somme mondiale sur
 * 1960 porte sur moins de pays qu'une somme sur 2020. On expose donc le
 * nombre de pays couverts avec chaque point, et les libellés disent
 * « pays couverts » plutôt que « monde ». Une année sans donnée reste
 * absente : elle n'est pas remplacée par zéro.
 *
 * Ce module n'est pas marqué `"use client"` : il est lu depuis un composant
 * serveur, qui ne transmet au navigateur que les quelques dizaines de
 * nombres calculés ici, pas les 283 Ko du socle.
 */

export interface PointMonde {
  annee: number;
  /** Somme des PIB des pays couverts, en milliards. */
  pib: number;
  /** Nombre de pays qui portent une valeur cette année-là. */
  pays: number;
}

export interface RangPays {
  nom: string;
  pib: number;
  iso2?: string;
}

/** La somme des PIB, année par année, sur toute la profondeur du socle. */
export function serieMondiale(): PointMonde[] {
  const points: PointMonde[] = [];
  for (const y of ECONOMY_YEARS) {
    let total = 0;
    let pays = 0;
    for (const d of Object.values(y.countries)) {
      if (d.gdp === undefined) continue;
      total += d.gdp;
      pays += 1;
    }
    if (pays === 0) continue;
    points.push({ annee: y.year, pib: Math.round(total), pays });
  }
  return points;
}

/** Le classement d'une année, tronqué. */
export function classement(annee: number, n = 10): RangPays[] {
  const y = ECONOMY_YEARS.find((e) => e.year === annee);
  if (!y) return [];
  return Object.entries(y.countries)
    .filter(([, d]) => d.gdp !== undefined)
    .map(([nom, d]) => ({ nom: countryFr(nom), pib: d.gdp as number }))
    .sort((a, b) => b.pib - a.pib)
    .slice(0, n);
}

/** Les quatre compteurs du bandeau, pour l'année la plus récente couverte. */
export function compteurs(annee: number) {
  const y = ECONOMY_YEARS.find((e) => e.year === annee);
  if (!y) return null;

  let pib = 0;
  let paysPib = 0;
  let balancePositive = 0;
  let paysBalance = 0;
  let inflations: number[] = [];

  for (const d of Object.values(y.countries)) {
    if (d.gdp !== undefined) {
      pib += d.gdp;
      paysPib += 1;
    }
    if (d.trade_balance !== undefined) {
      paysBalance += 1;
      if (d.trade_balance > 0) balancePositive += 1;
    }
    if (d.inflation !== undefined) inflations.push(d.inflation);
  }

  inflations = inflations.sort((a, b) => a - b);
  const median =
    inflations.length === 0
      ? null
      : inflations.length % 2
        ? inflations[(inflations.length - 1) / 2]
        : (inflations[inflations.length / 2 - 1] + inflations[inflations.length / 2]) / 2;

  return {
    annee,
    pib: Math.round(pib),
    paysPib,
    balancePositive,
    paysBalance,
    inflationMediane: median,
    paysInflation: inflations.length,
  };
}
