import type { Inventaire } from "./types";
import inventaire from "./inventaire-2026-10-31.json";

/* ═══════════════════════════════════════════════════════════════════════════
   LA SOURCE DES DONNÉES

   Aujourd'hui, l'inventaire du 31 octobre 2026 est un fichier du dépôt. Demain, il pourra venir de Supabase (une table
   `conflits` aux mêmes colonnes que les champs du fichier) ou de flux géolocalisés (UCDP, ACLED) : il suffit
   d'écrire une autre `SourceConflits` et de la passer à la page. Le reste de l'application ne change pas.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SourceConflits {
  charger(): Promise<Inventaire> | Inventaire;
}

export const sourceFichier: SourceConflits = {
  charger: () => inventaire as unknown as Inventaire,
};
