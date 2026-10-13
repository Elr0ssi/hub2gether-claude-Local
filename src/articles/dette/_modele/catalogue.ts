import type { EntreeCatalogue } from "../types";

/* MODÈLE · LA FICHE LÉGÈRE : ce que le plan du site, les carrousels et les liens ont besoin de savoir.
   Aucun import de composant ici (le fichier est lu partout, il doit rester léger). */

export const entreeModele: EntreeCatalogue = {
  slug: "pays-modele", // l'adresse sera /dette-publique/pays-modele ; sans accents, en minuscules, avec des tirets
  pays: "Pays modèle",
  drapeau: "🏳️",
  titre: "La dette publique du Pays modèle, en lecture longue",
  accroche: "Une à deux phrases : ce que l'article apporte, en des termes que l'on cherche.",
  publie: "2026-01-01",
  modifie: "2026-01-01",
  url: "/pays/pays-modele/dette-publique", // toujours `/pays/<slug>/dette-publique`
  mots: "dette · endettement · pays modèle",
};
