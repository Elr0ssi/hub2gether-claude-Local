import type { Metadata } from "next";
import { Dette2Page, type Suggestion } from "@/components/dette2/Dette2Page";
import { SUJETS } from "@/data/concept/sujets";
import { detteDerniere, FAQ } from "@/data/articles/detteFrancaise";
import { jsonLdString } from "@/lib/schema";

/* ═══════════════════════════════════════════════════════════════════════════
   /france/economie/dette-publique-v2

   La version « dossier » de l'article sur la dette : mêmes données, autre
   construction. C'est un essai à côté de l'original, pas son remplaçant — la
   page est donc exclue des moteurs et pointe vers l'original en canonique,
   pour ne pas faire concurrence à une page qui porte déjà le référencement.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";
const chemin = "/france/economie/dette-publique-v2";
const original = "/france/economie/dette-publique";

const nb = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export const metadata: Metadata = {
  title: { absolute: "Dette publique de la France : les montants, d'où elle vient, qui la détient | Visualize" },
  description:
    "3 536,1 milliards d'euros : recettes, dépenses, déficit, qui doit et qui détient la dette française, intérêts et échéances, en montants directs.",
  alternates: { canonical: original },
  robots: { index: false, follow: true },
};

/* Les lectures proposées en fin de page et dans la colonne de droite : des
   pages qui existent dans le site, jamais un renvoi vers l'ancien. */
function suggestions(): Suggestion[] {
  return [
    {
      href: "/economie",
      titre: "La dette de 200 pays sur le globe économie",
      rubrique: "Globe",
    },
    {
      href: "/france/economie/dette-publique",
      titre: "La dette publique pas à pas, en lecture longue",
      rubrique: "Lecture longue",
    },
    {
      href: "/demographie",
      titre: "Population, natalité et mortalité du monde",
      rubrique: "Globe",
    },
    {
      href: "/forum",
      titre: "Débattre de la dette sur le forum",
      rubrique: "Forum",
    },
  ];
}

export default function Page() {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Dette publique de la France : ${nb(detteDerniere.valeur)} milliards d'euros`,
    description: metadata.description,
    inLanguage: "fr-FR",
    author: { "@type": "Organization", name: "Visualize" },
    publisher: { "@type": "Organization", name: "Visualize", url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}${chemin}` },
  };
  /* Chaque figure de la page est décrite comme un jeu de données, avec son
     ancre, son producteur et sa période : c'est ce qui permet à un moteur de
     renvoyer vers le bon graphique plutôt que vers la page entière. */
  const jeux = [
    ["recettes-publiques", "Recettes des administrations publiques françaises, 2025", "INSEE", "2025"],
    ["depenses-publiques", "Dépenses des administrations publiques françaises, 2025", "INSEE", "2025"],
    ["qui-cree-le-deficit", "Déficit public français par administration, 2025", "INSEE", "2025"],
    ["evolution-dette-pib", "Dette publique française en pourcentage du PIB, 2000 à 2026", "INSEE, Banque mondiale, FMI", "2000/2026"],
    ["dette-par-emetteur", "Dette publique française par émetteur et par instrument, T1 2026", "INSEE", "2026-Q1"],
    ["detenteurs-dette", "Détenteurs de la dette négociable de l'État français, T1 2026", "Agence France Trésor", "2026-Q1"],
    ["interets-dette", "Intérêts de la dette publique française, 2025", "INSEE", "2025"],
    ["dette-europe", "Dette publique en pourcentage du PIB en Europe, fin 2025", "Eurostat", "2025-Q4"],
  ].map(([id, name, createur, periode]) => ({
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${siteUrl}${chemin}#${id}`,
    name,
    url: `${siteUrl}${chemin}#${id}`,
    inLanguage: "fr-FR",
    creator: { "@type": "Organization", name: createur },
    temporalCoverage: periode,
    spatialCoverage: "France",
    isAccessibleForFree: true,
    isPartOf: { "@type": "Article", "@id": `${siteUrl}${chemin}` },
  }));

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.r },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }} />
      {jeux.map((j) => (
        <script key={j["@id"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(j) }} />
      ))}
      <Dette2Page suggestions={suggestions()} sujet={SUJETS["dette-publique-france"]} />
    </>
  );
}
