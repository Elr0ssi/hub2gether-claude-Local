import brut from "./evenements-2026-10-31.json";

/* ═══════════════════════════════════════════════════════════════════════════
   LES CONFLITS : LES POINTS PRÉCIS

   Un point = un lieu nommé, une date, une phrase, une source. L'inventaire des 68 fiches n'a pas de coordonnées ; ce fichier
   est une couche séparée, rattachée à une fiche par son identifiant. Il ne couvre que les conflits pour lesquels des lieux ont
   été documentés : une fiche sans point n'est pas une fiche « sans événement ».
   Pour brancher plus tard une base (Supabase) ou UCDP / ACLED : renvoyer la même forme `Evenement`.
   ═══════════════════════════════════════════════════════════════════════════ */

export type TypeEvenement = "frappe" | "navire" | "front";

export interface Evenement {
  id: string;
  /** L'identifiant de la fiche de l'inventaire (VIZ-C-…). */
  conflit: string;
  type: TypeEvenement;
  titre: string;
  lieu: string;
  lat: number;
  lon: number;
  /** « site » : un lieu précis. « zone » : le centre d'une zone nommée (un détroit, une île, un champ pétrolier). */
  precision: "site" | "zone";
  /** Le pays (nom Natural Earth) où se trouve le point, ou null en mer. */
  pays: string | null;
  /** D'autres pays à qui le point se rattache (un navire touché au large d'un pays). */
  liens: string[];
  auteur: string | null;
  /** Le pays de l'acteur, quand c'est un État : sert au trait qui le relie au point. */
  auteurPays: string | null;
  date: string;
  detail: string;
  source: string;
  source_url: string;
}

export interface EnsembleEvenements {
  titre: string;
  date_compilation: string;
  avertissements: string[];
  evenements: Evenement[];
}

export const TYPES: Record<TypeEvenement, { libelle: string; pluriel: string; couleur: string }> = {
  frappe: { libelle: "Frappe", pluriel: "Frappes", couleur: "#6d4aff" },
  navire: { libelle: "Navire attaqué", pluriel: "Navires attaqués", couleur: "#0891b2" },
  front: { libelle: "Front et combats", pluriel: "Fronts et combats", couleur: "#d946ef" },
};

export function evenementsDuFichier(): EnsembleEvenements {
  return brut as unknown as EnsembleEvenements;
}

/** La capitale (ou le siège) d'où part le trait vers un point. Un symbole, pas un site de tir. */
export const ORIGINES: Record<string, { nom: string; lat: number; lon: number }> = {
  Iran: { nom: "Téhéran", lat: 35.69, lon: 51.39 },
  Israel: { nom: "Jérusalem", lat: 31.77, lon: 35.21 },
  Russia: { nom: "Moscou", lat: 55.75, lon: 37.62 },
  "United States of America": { nom: "Washington", lat: 38.9, lon: -77.04 },
  Yemen: { nom: "Sanaa", lat: 15.35, lon: 44.21 },
};

/** Les points qui concernent un pays : sur son sol, menés par lui, rattachés à lui, ou d'une fiche qui le nomme. */
export function evenementsDuPays(evts: Evenement[], pays: string, idsFiches: Set<string>) {
  const sur: Evenement[] = [];
  const menes: Evenement[] = [];
  const autres: Evenement[] = [];
  for (const e of evts) {
    if (e.pays === pays) sur.push(e);
    else if (e.auteurPays === pays) menes.push(e);
    else if (e.liens.includes(pays) || idsFiches.has(e.conflit)) autres.push(e);
  }
  return { sur, menes, autres };
}
