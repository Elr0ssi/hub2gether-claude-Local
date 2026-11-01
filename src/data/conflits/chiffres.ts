import brut from "./chiffres-2026-10-31.json";

/* ═══════════════════════════════════════════════════════════════════════════
   LES CONFLITS : PÉRIODES ET CHIFFRES CLÉS

   Une couche à part, rattachée à une fiche par son identifiant : quand le conflit a commencé, quand il a fini (ou « en cours »),
   et quelques chiffres directs, chacun avec sa source et son degré de fiabilité. Une fiche qui n'a pas de dossier n'a pas de chiffres :
   on n'en invente pas. Les conflits historiques (guerres mondiales, etc.) utiliseront la même forme avec une date de fin.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Fiabilite = "vérifié" | "estimé" | "revendiqué" | "contesté";

export interface Periode {
  /** « 2022-02-24 », « 2023-11 » ou « 1914 » : la précision que la source donne. */
  debut: string;
  /** Même forme, ou null quand le conflit est en cours. */
  fin: string | null;
  /** Une phrase sur l'état actuel ou une réserve de datation. */
  statut?: string;
}

export type Theme = "humaines" | "economiques" | "geopolitiques" | "territoriales" | "militaires";

export interface ChiffreCle {
  valeur: string;
  libelle: string;
  /** La période de référence et la précision sur la mesure. */
  detail: string;
  fiabilite: Fiabilite;
  /** « morts », « deplaces », « economie », « navires », « faim », « frappes » : choisit l'icône. */
  nature?: string;
  theme?: Theme;
  /** Cumulé depuis le début, récent, annuel ou ponctuel : on ne mélange pas un stock et un flux. */
  portee?: "cumulé" | "récent" | "annuel" | "ponctuel";
  source: string;
  source_url: string;
}

export interface Cause {
  type: "structurelle" | "declencheur" | "aggravant";
  titre: string;
  texte: string;
  source?: string;
  source_url?: string;
}

export interface Acteur {
  nom: string;
  role: string;
  objectifs?: string;
  /** Le nom Natural Earth du pays, pour ouvrir sa fiche sur le globe. */
  pays?: string;
}

export interface Jalon {
  date: string;
  titre: string;
  texte: string;
  source?: string;
  source_url?: string;
  /** Les points (EV-…) à montrer sur la carte quand on choisit ce jalon. */
  points?: string[];
}

export interface Consequence {
  theme: Theme;
  texte: string;
  source?: string;
  source_url?: string;
}

export interface Intensite {
  niveau: "Faible" | "Modérée" | "Élevée" | "Très élevée";
  source: string;
  source_url: string;
}

/** Tout est facultatif sauf la période : une rubrique sans données n'est pas affichée, jamais remplie à la place. */
export interface DossierConflit {
  titre_court?: string;
  periode: Periode;
  resume?: string;
  intensite?: Intensite;
  chiffres: ChiffreCle[];
  causes?: Cause[];
  acteurs?: Acteur[];
  chronologie?: Jalon[];
  consequences?: Consequence[];
}

/** Un nom court pour le titre : celui du dossier, sinon le nom de la fiche coupé avant « : » quand il est long. */
export function titreCourt(nom: string, d?: DossierConflit): string {
  if (d?.titre_court) return d.titre_court;
  const i = nom.indexOf(" : ");
  return nom.length > 44 && i > 6 ? nom.slice(0, i) : nom;
}

export function dossiersDuFichier(): Map<string, DossierConflit> {
  return new Map(Object.entries((brut as unknown as { dossiers: Record<string, DossierConflit> }).dossiers));
}

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** « 2022-02-24 » → « 24 févr. 2022 » ; « 2023-11 » → « nov. 2023 » ; « 1914 » → « 1914 ». */
export function dateCourte(d: string): string {
  const [a, m, j] = d.split("-");
  if (!m) return a;
  const mois = MOIS[Number(m) - 1];
  return j ? `${Number(j)} ${mois} ${a}` : `${mois} ${a}`;
}

/** « Depuis le 24 févr. 2022 » ou « 1914 → 1918 ». */
export function periodeTexte(p: Periode): string {
  return p.fin ? `${dateCourte(p.debut)} → ${dateCourte(p.fin)}` : `Depuis ${p.debut.split("-").length === 3 ? "le " : ""}${dateCourte(p.debut)} · en cours`;
}
