import type { Metadata } from "next";
import { ConceptPage } from "@/components/concept/ConceptPage";
import { articlesEnUne, comptes, donneesPays, reperes, REGIONS, VUES } from "@/data/concept/conceptGeo";

export const metadata: Metadata = {
  title: "Concept · The Essential Data",
  description:
    "Prototype de direction artistique : l'univers The Essential Data, ses rubriques en orbite et son fil éditorial.",
  /* Un prototype ne doit pas se retrouver dans l'index à côté des pages
     réelles : même marque, deux promesses différentes. */
  robots: { index: false, follow: false },
};

/**
 * La route de démonstration.
 *
 * Volontairement autonome : ni `Layout`, ni `Navbar`, ni `Footer` du site.
 * Elle porte son propre en-tête minimal et sa propre feuille de style, de
 * sorte qu'aucune page existante ne peut être affectée, et qu'on puisse la
 * supprimer d'un seul coup si la direction n'est pas retenue.
 */
export default function ConceptGlobePage() {
  /* Le globe du prototype affiche de vraies valeurs : la page serveur lit le
     socle et n'envoie que la fiche de chaque pays. */
  const { annee, pays } = donneesPays();
  const { liste: bandeau } = reperes();
  /* Les articles viennent de la base du site : on n'en réécrit pas une pour
     la maquette. Seuls les champs affichés traversent. */
  return (
    <ConceptPage
      articles={articlesEnUne(4)}
      reperes={bandeau}
      comptes={comptes()}
      donnees={pays}
      annee={annee}
      regions={REGIONS}
      vues={VUES}
    />
  );
}
