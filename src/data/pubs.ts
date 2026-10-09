/**
 * Les trois créatives maison, une par bloc de page. Les deux rails d'un même
 * bloc portent la même, comme une campagne achetée sur la page entière.
 *
 * Les fichiers sont ceux déposés dans `public/soutenance/partenariats` : ce
 * sont les mêmes visuels que ceux montrés en soutenance, pas des doublons.
 *
 * Ce module n'est pas marqué `"use client"` : la page article est un composant
 * serveur, et importer une constante depuis un module client lui renverrait
 * une référence vide plutôt que la valeur.
 */
export const PUBS: Record<1 | 2 | 3, string> = {
  1: "/soutenance/partenariats/visuel-01.png",
  2: "/soutenance/partenariats/visuel-02.png",
  3: "/soutenance/partenariats/visuel-03.png",
};
