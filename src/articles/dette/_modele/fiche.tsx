import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import type { ArticleDette } from "../types";
import type { Suggestion } from "../cadre";
import { ArticleModele } from "./Article";
import { entreeModele } from "./catalogue";
import { DETTE, FAQ, RATIO } from "./donnees";

/* ═══════════════════════════════════════════════════════════════════════════
   MODÈLE · LA FICHE DE RENDU : référencement et données structurées

   Chargée seulement par la route de l'article. Elle dit aux moteurs de quoi parle la page.
   Règle d'or : les données structurées décrivent exactement ce que la page montre.
   Voir `../france/fiche.tsx` pour une fiche complète (jeux de données par figure, citations…).
   ═══════════════════════════════════════════════════════════════════════════ */

const nb = (v: number, d = 0) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

const SUGGESTIONS: Suggestion[] = [
  { href: "/dette-publique", titre: "Le classement mondial de la dette publique", rubrique: "Classement" },
  { href: "/economie", titre: "La dette de 200 pays sur le globe économie", rubrique: "Globe" },
  { href: "/forum", titre: "Débattre de la dette sur le forum", rubrique: "Forum" },
];

const metadata: Metadata = {
  title: { absolute: "Dette publique du Pays modèle : montant, évolution, qui la détient | Visualize" },
  description: "La dette publique du Pays modèle : montant, poids dans le PIB, évolution depuis 2000 et répartition par émetteur.",
  alternates: { canonical: entreeModele.url },
  openGraph: {
    type: "article",
    url: `${SITE_URL}${entreeModele.url}`,
    title: "Dette publique du Pays modèle",
    description: "Montant, poids dans le PIB, évolution et répartition.",
    publishedTime: entreeModele.publie,
    modifiedTime: entreeModele.modifie,
  },
};

export const articleModele: ArticleDette = {
  ...entreeModele,
  metadata,
  donneesStructurees: () => [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Dette publique du Pays modèle : ${nb(DETTE.valeur)} milliards d'euros`,
      description: metadata.description,
      inLanguage: "fr-FR",
      datePublished: entreeModele.publie,
      dateModified: entreeModele.modifie,
      author: { "@type": "Organization", name: "Visualize" },
      publisher: { "@type": "Organization", name: "Visualize", url: SITE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${entreeModele.url}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.r } })),
    },
  ],
  resume: () => `En ${RATIO.periode}, la dette publique du Pays modèle s'élève à ${nb(DETTE.valeur)} milliards d'euros, soit ${nb(RATIO.valeur)} % du PIB (${DETTE.source}).`,
  Composant: () => <ArticleModele suggestions={SUGGESTIONS} />,
};
