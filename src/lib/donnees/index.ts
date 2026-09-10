/* ═══════════════════════════════════════════════════════════════════════════
   ACCÈS AUX DONNÉES — ce que le site lit, et comment

   Deux couches, une seule vérité.

     data/countries/<ISO3>.json      le stock : tout l'historique, tous les
                                     indicateurs, versionné dans le dépôt.
     public/data-generated/          l'affichage : de petits fichiers dérivés
                                     du stock, un par indicateur et par année.

   Le navigateur ne lit jamais le stock. Ouvrir la carte du PIB 2025 charge un
   fichier de quelques kilo-octets, pas deux cent dix-sept historiques.

   La jointure se fait sur ISO3, jamais sur un nom. Le nom français ne sert
   qu'à l'écran, et il vient du référentiel.
   ═══════════════════════════════════════════════════════════════════════════ */

import referentiel from "@/../data/referentiel-pays.json";
import catalogue from "@/../data/catalogue-indicateurs.json";
import pontGeo from "@/../data/pont-geographies.json";

export interface FichePays {
  iso2: string;
  nom: string;
}

export interface Indicateur {
  nom: string;
  unite: string;
  source: string;
  anneesDisponibles: number[];
  paysCouverts: number;
  misAJour: string;
}

export interface CarteAnnee {
  annee: number;
  indicateur: string;
  unite: string;
  source: string;
  /** ISO3 → valeur. Une année sans mesure est absente, jamais à zéro. */
  pays: Record<string, number>;
}

export const REFERENTIEL_PAYS = referentiel as Record<string, FichePays>;
export const CATALOGUE = catalogue as Record<string, Indicateur>;

/** Ce qu'on écrit quand la donnée n'existe pas. Zéro serait un mensonge. */
export const INDISPONIBLE = "Donnée indisponible";
export const INSUFFISANT = "Données insuffisantes";

/** Le nom français d'un pays, ou son code si le référentiel ne le connaît pas. */
export function nomPays(iso3: string): string {
  return REFERENTIEL_PAYS[iso3]?.nom ?? iso3;
}

/**
 * Le code d'une forme du fond de carte.
 *
 * Natural Earth ne porte pas de code : le pont est écrit une fois, vérifié, et
 * rangé dans `data/pont-geographies.json`. Les entités qu'il ne couvre pas —
 * Antarctique, Taïwan, Sahara occidental — n'ont pas de donnée non plus.
 */
export function iso3DepuisForme(nomForme: string): string | undefined {
  return (pontGeo as { pont: Record<string, string> }).pont[nomForme];
}

/**
 * Une année d'un indicateur, pour la carte.
 *
 * Rend `null` quand le fichier n'existe pas : une année sans données n'est pas
 * une erreur de chargement, et l'appelant doit pouvoir écrire « Donnée
 * indisponible » plutôt que d'échouer.
 */
export async function chargerCarte(
  indicateur: string,
  annee: number,
  signal?: AbortSignal
): Promise<CarteAnnee | null> {
  const r = await fetch(`/data-generated/cartes/${indicateur}/${annee}.json`, { signal });
  if (!r.ok) return null;
  return (await r.json()) as CarteAnnee;
}

export interface RangPays {
  rang: number;
  iso3: string;
  nom: string;
  valeur: number;
}

/**
 * Le classement d'une année, tiré du fichier de la carte.
 *
 * Aucune donnée n'est dupliquée pour cela : le PIB de la France en 2025 est le
 * même nombre sur la carte, dans le classement et dans la fiche du pays, parce
 * qu'il n'est écrit qu'une fois.
 */
export function classer(carte: CarteAnnee, ordre: "desc" | "asc" = "desc"): RangPays[] {
  return Object.entries(carte.pays)
    .sort(([, a], [, b]) => (ordre === "desc" ? b - a : a - b))
    .map(([iso3, valeur], i) => ({ rang: i + 1, iso3, nom: nomPays(iso3), valeur }));
}

/**
 * Une valeur, écrite comme on la lit.
 *
 * Les montants de la Banque mondiale sont en unités : 3 274 000 000 000 se lit
 * mal, « 3 274 Mds $ » se lit. L'échelle est choisie sur la grandeur, pas
 * imposée, pour qu'un petit pays ne devienne pas « 0,00 T$ ».
 */
export function formaterValeur(v: number | null | undefined, unite: string): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return INDISPONIBLE;

  if (unite === "USD") {
    const abs = Math.abs(v);
    if (abs >= 1e12) return `${(v / 1e12).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} T$`;
    if (abs >= 1e9) return `${(v / 1e9).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mds $`;
    if (abs >= 1e6) return `${(v / 1e6).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M$`;
    return `${Math.round(v).toLocaleString("fr-FR")} $`;
  }
  if (unite === "%") return `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
  return `${v.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} ${unite}`;
}
