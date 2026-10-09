import type { Metadata } from "next";
import { Dette2Page, type Suggestion } from "@/components/dette2/Dette2Page";
import { detteDerniere, FAQ } from "@/data/articles/detteFrancaise";
import { ARTICLES } from "@/data/articles";
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

/* Les lectures proposées en fin de page et dans la colonne de droite : de
   vrais articles de la base, jamais une liste écrite pour la maquette. */
const CHOIX = [
  "dette-publique-comparaison-internationale",
  "pib-par-pays-2025-classement-complet",
  "chine-usa-guerre-economique-decennie",
  "pib-mondial-geopolitique-puissance",
];
const RUBRIQUES: Record<string, string> = {
  economy: "Économie",
  empires: "Empires",
  epidemics: "Épidémies",
  military: "Militaire",
  politics: "Politique",
};

function suggestions(): Suggestion[] {
  return CHOIX.flatMap((slug) => {
    const a = ARTICLES.find((x) => x.slug === slug);
    return a
      ? [
          {
            href: `/articles/${a.slug}`,
            titre: a.title,
            rubrique: RUBRIQUES[a.theme] ?? a.theme,
            duree: a.readingTime ? `${a.readingTime} min` : undefined,
          },
        ]
      : [];
  });
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
      <Dette2Page suggestions={suggestions()} />
    </>
  );
}
