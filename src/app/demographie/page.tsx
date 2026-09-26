import type { Metadata } from "next";
import { DemographiePage } from "@/components/concept/DemographiePage";
import { compteurDemo, donneesPaysDemo, socleDemo } from "@/data/concept/conceptDemographie";
import { jsonLdString } from "@/lib/schema";

/* ═══════════════════════════════════════════════════════════════════════════
   /demographie — LA PAGE PRINCIPALE DU SUJET DÉMOGRAPHIQUE

   Même construction que /economie : le socle traverse en entier dans le
   HTML livré, les composants clients n'ajoutent que le mouvement. La base
   vient des Nations Unies (World Population Prospects 2024), pas d'une
   saisie du prototype.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";
const chemin = "/demographie";

export const metadata: Metadata = {
  title: {
    absolute: "Démographie mondiale : population, natalité et mortalité par pays | Visualize",
  },
  description:
    "219 pays et territoires, 1960-2026, population, natalité, mortalité et accroissement naturel comparés sur un globe interactif. Source : Nations Unies, World Population Prospects 2024.",
  keywords: [
    "démographie mondiale",
    "population par pays",
    "taux de natalité par pays",
    "taux de mortalité par pays",
    "classement population mondiale",
    "accroissement naturel",
    "données démographiques",
  ],
  alternates: { canonical: chemin },
  openGraph: {
    type: "website",
    url: `${siteUrl}${chemin}`,
    title: "Démographie mondiale : population, natalité et mortalité par pays",
    description:
      "219 pays et territoires, 1960-2026, comparés sur un globe interactif. Source : Nations Unies, World Population Prospects 2024.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Démographie mondiale : population, natalité et mortalité par pays",
    description: "219 pays et territoires, 1960-2026, comparés sur un globe interactif.",
  },
};

export default function Page() {
  const socle = socleDemo();
  const compteur = compteurDemo();
  const { annee: anneeDonnees, pays: donnees } = donneesPaysDemo();
  const premiere = socle.annees[0];
  const derniere = socle.annees[socle.annees.length - 1];

  const jeu = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Indicateurs démographiques par pays, ${premiere}-${derniere}`,
    description: `Population, taux de natalité, taux de mortalité, accroissement naturel et solde migratoire pour ${socle.pays.length} pays et territoires, de ${premiere} à ${derniere}. Une année qu'une source ne publie pas reste absente : elle n'est jamais remplacée par zéro.`,
    url: `${siteUrl}${chemin}`,
    inLanguage: "fr-FR",
    temporalCoverage: `${premiere}/${derniere}`,
    spatialCoverage: "World",
    variableMeasured: [
      "Population",
      "Taux de natalité",
      "Taux de mortalité",
      "Accroissement naturel",
      "Solde migratoire net",
    ],
    creator: { "@type": "Organization", name: "Visualize", url: siteUrl },
    isBasedOn: [
      {
        "@type": "Dataset",
        name: "Nations Unies · World Population Prospects 2024",
        url: "https://population.un.org/wpp/",
      },
    ],
  };

  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Démographie", item: `${siteUrl}${chemin}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jeu) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />

      <p className="sr-only">
        Cette page compare la population, le taux de natalité, le taux de mortalité, l&apos;accroissement naturel et
        le solde migratoire pour {socle.pays.length} pays et territoires, de {premiere} à {derniere}. Les données
        proviennent des Nations Unies, World Population Prospects 2024. Une année qu&apos;une source ne publie pas
        pour un pays reste absente : le pays sort du classement de cette année-là plutôt que d&apos;être compté pour
        zéro.
      </p>

      <DemographiePage socle={socle} compteur={compteur} donnees={donnees} anneeDonnees={anneeDonnees} />
    </>
  );
}
