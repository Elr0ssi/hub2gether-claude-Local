/* ═══════════════════════════════════════════════════════════════════════════
   LES CONFLITS : LES TYPES

   Une fiche de l'inventaire, telle qu'elle est dans le fichier source. Rien n'est ajouté ici : ce qui n'est pas
   dans l'inventaire (victimes, dépenses militaires, coordonnées) n'existe pas pour la page.
   Pour brancher plus tard Supabase, UCDP ou ACLED : implémenter `SourceConflits` (voir source.ts).
   ═══════════════════════════════════════════════════════════════════════════ */

export type Categorie = "Conflit armé" | "Violences armées" | "Tension géopolitique";

export type Region = "Europe" | "Moyen-Orient et Afrique du Nord" | "Afrique subsaharienne" | "Asie et Pacifique" | "Amériques";

export interface FicheConflit {
  id: string;
  nom: string;
  region: Region;
  /** Les pays, régions et zones concernés, séparés par des points-virgules, tels que la source les donne. */
  zone: string;
  categorie: Categorie;
  situation: string;
  description: string;
  acteurs: string;
  /** Le nom du conflit auquel cette fiche se rattache, ou vide. */
  conflit_parent: string;
  source: string;
  source_url: string;
  verification: string;
  date_inventaire: string;
}

export interface Inventaire {
  titre: string;
  date_inventaire: string;
  origine: string;
  avertissements: string[];
  nombre_entrees: number;
  conflits: FicheConflit[];
}

/** Une fiche enrichie : ses pays rapprochés des géométries du site, et ses liens de parenté. */
export interface Conflit extends FicheConflit {
  /** Les pays reconnus dans `zone` (nom anglais Natural Earth, la clé des géométries du site). */
  pays: string[];
  /** Pour une fiche sans pays reconnu : les pays de sa fiche parente (« Mer Rouge » se rattache au Yémen). Ils servent à la retrouver, pas à la colorer. */
  paysRattaches: string[];
  /** Les éléments de `zone` qu'aucune géométrie du site ne permet de positionner (mers, régions, provinces). */
  zonesNonPositionnees: string[];
  /** La fiche parente, si `conflit_parent` correspond à une fiche de l'inventaire. */
  parent: string | null;
  /** Les fiches rattachées à celle-ci. */
  enfants: string[];
}
