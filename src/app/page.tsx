import type { Metadata } from "next";
import { ConceptPage } from "@/components/concept/ConceptPage";
import { articlesEnUne, comptes, donneesPays, reperes, REGIONS, VUES } from "@/data/concept/conceptGeo";

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE D'ACCUEIL

   L'univers Visualize est désormais le site : on y arrive directement. Il
   vivait sous /concept-globe, marqué « ne pas indexer » parce que c'était
   un prototype posé à côté de l'ancien site. L'ancien accueil est retiré ;
   /concept-globe redirige ici (voir next.config.ts), et la page est cette
   fois offerte aux moteurs.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export const metadata: Metadata = {
  title: {
    absolute: "Visualize · L'économie et la démographie du monde, en données",
  },
  description:
    "PIB, dette, chômage, population, natalité et mortalité de plus de 200 pays, de 1960 à aujourd'hui, sur un globe interactif et en temps réel. Sources : Banque mondiale, FMI, Nations Unies.",
  keywords: [
    "données mondiales",
    "PIB par pays",
    "PIB mondial en temps réel",
    "population mondiale",
    "classement des pays",
    "globe interactif",
    "démographie mondiale",
    "dette publique par pays",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Visualize · L'économie et la démographie du monde, en données",
    description:
      "Plus de 200 pays, de 1960 à aujourd'hui, sur un globe interactif et en temps réel.",
  },
  robots: { index: true, follow: true },
};

export default function Accueil() {
  /* Le globe affiche de vraies valeurs : la page serveur lit le socle et
     n'envoie que la fiche de chaque pays. */
  const { annee, pays } = donneesPays();
  const { liste: bandeau } = reperes();
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
