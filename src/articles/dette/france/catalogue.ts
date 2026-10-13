import type { EntreeCatalogue } from "../types";

/* La fiche « légère » de l'article France : ce que le plan du site, les carrousels et les liens
   des autres pages ont besoin de savoir sans charger l'article. Aucun import de composant ici. */

export const entreeFrance: EntreeCatalogue = {
  slug: "france",
  pays: "France",
  drapeau: "🇫🇷",
  titre: "La dette publique de la France, en lecture longue",
  accroche:
    "Montant, déficit, qui doit et qui détient la dette, intérêts, refinancement : l'article de référence, avec les montants dans la monnaie de votre choix.",
  publie: "2026-09-21",
  modifie: "2026-10-13",
  /* La France garde l'adresse qu'elle avait : c'est elle qui porte le référencement. */
  url: "/france/economie/dette-publique",
  mots: "dette · endettement · france · maastricht · déficit",
};
