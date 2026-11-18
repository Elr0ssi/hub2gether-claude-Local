/* Les types partagés par les briques du cadre. */

/** Une lecture proposée en fin d'article et dans la colonne de droite. */
export interface Suggestion {
  href: string;
  titre: string;
  /** Le petit surtitre : « Globe », « Forum », « Lecture longue »… */
  rubrique: string;
}

/** Un chapitre, tel qu'il apparaît dans le sommaire. L'ordre de la liste est l'ordre de la page. */
export interface ChapitreDef {
  /** L'ancre : `#essentiel`. Minuscules, sans accents, tirets. Unique dans l'article. */
  id: string;
  /** Le libellé court du sommaire (2 à 3 mots). */
  court: string;
}

/** La source d'une figure : ce qui s'affiche sous le graphique, et où aller la vérifier. */
export interface Source {
  source: string;
  url: string;
}
