/* ═══════════════════════════════════════════════════════════════════════════
   RESSOURCES : LES TYPES

   Le format normalisé que produit scripts/ressources/importer-faostat.mjs. Une ressource = un fichier public/ressources/<id>.json.
   Les séries sont stockées en colonnes : un tableau de valeurs, une chaîne de flags (un caractère par année, « » espace = aucune ligne
   dans le CSV) et une chaîne de notes. L'indice d'une année est `année − annees[0]`.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Continent = "Europe" | "Afrique" | "Amériques" | "Asie" | "Océanie";
export type TypeZone = "pays" | "historique" | "agregat" | "inconnu";
/** Les indicateurs reconnus ; un code FAOSTAT inconnu devient « el-<code> ». */
export type IndicateurId = "production" | "surface" | "rendement" | (string & {});

export interface Zone {
  m49: string;
  /** Le nom FAOSTAT, tel que dans le CSV. */
  nom: string;
  debut: number;
  fin: number;
  type: TypeZone;
  continent: Continent | null;
  /** Le nom Natural Earth de la géométrie actuelle, ou null (entité historique, agrégat, territoire sans géométrie). */
  ne: string | null;
  note?: string;
  successeurs?: string[];
  contient?: string[];
}

export interface Serie {
  v: (number | null)[];
  f: string;
  n: string;
}

export interface Indicateur {
  code_element: number;
  nom_fao: string;
  unite: string;
}

export interface SourceJeu {
  nom: string;
  url: string;
  metadonnees: string;
  fichier: string;
  sha256: string;
  /** La date de l'export du CSV. Ce n'est PAS l'année des observations. */
  date_export: string | null;
  importe_le: string;
}

export interface JeuRessource {
  schema: 1;
  ressource: { id: string; domaine: string; domaine_nom: string; code_item: string; nom_fao: string };
  source: SourceJeu;
  annees: [number, number];
  indicateurs: Record<string, Indicateur>;
  zones: Zone[];
  series: Record<string, Record<string, Serie>>;
  /** Totaux recalculés (somme des entités présentes), jamais officiels. `n` = nombre d'entités additionnées. */
  monde: Record<string, { v: (number | null)[]; n: number[] }>;
}

export interface EntreeIndex {
  id: string;
  nom_fao: string;
  domaine: string;
  annees: [number, number];
  indicateurs: string[];
  zones: number;
  importe_le: string;
  date_export: string | null;
}

export interface Observation {
  valeur: number;
  annee: number;
  flag: string;
  /** La note FAOSTAT « Unofficial figure » accompagne la ligne. */
  nonOfficielle: boolean;
}

export type ZoneFiltre = Continent | "Monde";
