import type { Metadata } from "next";
import { EconomiePage } from "@/components/concept/EconomiePage";
import {
  articlesEco,
  debatsEco,
  faqEco,
  socleEco,
  sourcesEco,
} from "@/data/concept/conceptEconomie";
import { jsonLdString } from "@/lib/schema";

/* ═══════════════════════════════════════════════════════════════════════════
   /economie — LA PAGE PRINCIPALE DU SUJET ÉCONOMIQUE

   Elle vivait sous /concept-globe/economie, en `noindex`, comme un prototype.
   Ce n'en est pas un : c'est la page de tête du sujet, celle vers laquelle
   les articles renvoient. Elle prend donc une adresse qui dit ce qu'elle
   contient, et l'ancienne y redirige.

   Tout ce qu'elle affiche est dans le HTML livré : le socle traverse en
   entier, et les composants clients n'ajoutent que du mouvement.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";
const chemin = "/economie";

export const metadata: Metadata = {
  title: {
    absolute:
      "Économie mondiale : PIB, dette publique, chômage et inflation par pays | Visualize",
  },
  description:
    "207 pays, 66 années, dix indicateurs économiques comparés sur un globe interactif : PIB, PIB par habitant, balance commerciale, dette publique, inflation, chômage, population active, entreprises. Sources Banque mondiale et FMI.",
  keywords: [
    "économie mondiale",
    "PIB par pays",
    "classement PIB mondial",
    "dette publique par pays",
    "taux de chômage par pays",
    "inflation par pays",
    "comparaison économique pays",
    "données économiques mondiales",
    "PIB par habitant",
  ],
  alternates: { canonical: chemin },
  openGraph: {
    type: "website",
    url: `${siteUrl}${chemin}`,
    title: "Économie mondiale : PIB, dette, chômage et inflation par pays",
    description:
      "207 pays, 66 années, dix indicateurs comparés sur un globe interactif. Sources Banque mondiale et FMI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Économie mondiale : PIB, dette, chômage et inflation par pays",
    description: "207 pays, 66 années, dix indicateurs comparés sur un globe interactif.",
  },
};

export default function Page() {
  const socle = socleEco();
  /* La FAQ est passée au composant, qui la balise lui-même. */
  const faq = faqEco();
  const premiere = socle.annees[0];
  const derniere = socle.annees[socle.annees.length - 1];

  /* Ce que la page montre réellement, décrit dans le vocabulaire que les
     moteurs lisent. Un jeu de données déclaré doit correspondre à ce qui est
     affiché : ici, c'est le socle lui-même. */
  const jeu = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Indicateurs économiques par pays, ${premiere}-${derniere}`,
    description: `Dix indicateurs économiques pour ${socle.pays.length} pays et territoires, de ${premiere} à ${derniere} : produit intérieur brut, PIB par habitant, balance commerciale, dette publique rapportée au PIB, montant de la dette publique, inflation, taux de chômage, population active, âge de départ à la retraite et nombre d'entreprises. Une année qu'une source ne publie pas reste absente : elle n'est jamais remplacée par zéro.`,
    url: `${siteUrl}${chemin}`,
    inLanguage: "fr-FR",
    temporalCoverage: `${premiere}/${derniere}`,
    spatialCoverage: "World",
    variableMeasured: [
      "Produit intérieur brut",
      "PIB par habitant",
      "Balance commerciale",
      "Dette publique (% du PIB)",
      "Dette publique (montant)",
      "Inflation",
      "Taux de chômage",
      "Population active",
      "Âge de départ à la retraite",
      "Nombre d'entreprises",
    ],
    creator: { "@type": "Organization", name: "Visualize", url: siteUrl },
    isBasedOn: [
      { "@type": "Dataset", name: "Banque mondiale · World Development Indicators", url: "https://databank.worldbank.org/source/world-development-indicators" },
      { "@type": "Dataset", name: "Fonds monétaire international · World Economic Outlook", url: "https://www.imf.org/en/Publications/WEO" },
    ],
  };

  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Économie", item: `${siteUrl}${chemin}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jeu) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />

      {/* Le résumé que reprend un moteur de réponse : ce que couvre la page,
          sur quel périmètre, d'après qui. */}
      <p className="sr-only">
        Cette page compare dix indicateurs économiques pour {socle.pays.length} pays et
        territoires, de {premiere} à {derniere} : produit intérieur brut, PIB par habitant,
        balance commerciale, dette publique rapportée au PIB, montant de la dette publique,
        inflation, taux de chômage, population active, âge de départ à la retraite et nombre
        d&apos;entreprises. Les données proviennent de la Banque mondiale et du Fonds monétaire
        international. Une année qu&apos;une source ne publie pas pour un pays reste absente : le
        pays sort du classement de cette année-là plutôt que d&apos;être compté pour zéro.
      </p>

      <EconomiePage
        socle={socle}
        sources={sourcesEco()}
        debats={debatsEco()}
        articles={articlesEco(9)}
        faq={faq}
      />
    </>
  );
}
