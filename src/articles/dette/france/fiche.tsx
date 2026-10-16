import type { Metadata } from "next";
import { SUJETS } from "@/data/concept/sujets";
import { SITE_URL } from "@/lib/site";
import type { ArticleDette } from "../types";
import { entreeFrance } from "./catalogue";
import type { Suggestion } from "../cadre";
import { ArticleFrance } from "./Article";
import { FAQ, detteDerniere, nonResidents, ratioDernier } from "./donnees/detteFrancaise";
import { variablesMesurees } from "../cadre/ventilation";
import {
  DEFICIT_LIGNES,
  DEPENSES_FONCTION_LIGNES,
  DEPENSES_NATURE_LIGNES,
  DETAIL_DEFICIT,
  DETAIL_FONCTION,
  DETAIL_NATURE,
  DETAIL_RECETTES,
  RECETTES_LIGNES,
} from "./donnees/ventilations";

/* ═══════════════════════════════════════════════════════════════════════════
   LA FICHE DE L'ARTICLE « DETTE PUBLIQUE DE LA FRANCE »

   Tout ce que le site doit savoir de cet article sans le lire : son adresse,
   son titre pour les moteurs, ses données structurées, ses suggestions.
   C'est le modèle à suivre pour la fiche d'un autre pays (voir `../_modele/fiche.tsx`).

   L'article vit sur la fiche du pays : `/pays/france/dette-publique`. (Les anciennes adresses
   `/france/economie/dette-publique`, `-v2` et `/articles/dette-publique-france-2025-enjeux`
   y redirigent : voir `next.config.ts`.)
   ═══════════════════════════════════════════════════════════════════════════ */

const URL = entreeFrance.url;
const PUBLIE = entreeFrance.publie;
const MODIFIE = entreeFrance.modifie;

const nb = (v: number, d = 1) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

/* Les lectures proposées en fin de page et dans la colonne de droite : des
   pages qui existent dans le site. */
const SUGGESTIONS: Suggestion[] = [
  { href: "/dette-publique/analyses/dette-publique-zone-euro", titre: "La dette publique dans la zone euro", rubrique: "Analyse" },
  { href: "/economie", titre: "La dette de 200 pays sur le globe économie", rubrique: "Globe" },
  { href: "/dette-publique", titre: "Le classement mondial de la dette publique", rubrique: "Classement" },
  { href: "/forum", titre: "Débattre de la dette sur le forum", rubrique: "Forum" },
];

const metadata: Metadata = {
  /* Titre en absolu : le gabarit du dépôt n'ajoute alors rien derrière. */
  title: { absolute: "Dette publique française : montant, évolution, coût et détenteurs | Visualize" },
  description:
    "La dette publique française expliquée simplement : montant, évolution, dette/PIB, déficit, détenteurs, intérêts, remboursement et comparaison européenne.",
  keywords: [
    "dette publique française",
    "dette France montant",
    "dette France PIB",
    "dette publique 2026",
    "qui détient la dette française",
    "différence dette et déficit",
    "dette de Maastricht",
    "charge de la dette",
    "OAT France",
    "recettes publiques France",
    "dépenses publiques France",
    "rémunérations des salariés des administrations publiques",
    "impôts France montant par impôt",
    "taux TVA France",
    "déficit public France",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: `${SITE_URL}${URL}`,
    title: "Dette publique française : comprendre les 3 536 milliards d'euros",
    description:
      "Montant, évolution, dette/PIB, déficit, détenteurs, intérêts, remboursement et comparaison européenne. Sources INSEE, Banque de France, AFT, Eurostat.",
    publishedTime: PUBLIE,
    modifiedTime: MODIFIE,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dette publique française : comprendre les 3 536 milliards d'euros",
    description: "Montant, évolution, dette/PIB, déficit, détenteurs, intérêts, remboursement et comparaison européenne.",
  },
};

/* Chaque figure de la page est décrite comme un jeu de données, avec son
   ancre, son producteur et sa période : c'est ce qui permet à un moteur de
   renvoyer vers le bon graphique plutôt que vers la page entière. */
const FIGURES: [string, string, string, string][] = [
  ["recettes-publiques", "Recettes des administrations publiques françaises, 2025", "INSEE", "2025"],
  ["depenses-publiques", "Dépenses des administrations publiques françaises, 2025", "INSEE", "2025"],
  ["qui-cree-le-deficit", "Déficit public français par administration, 2025", "INSEE", "2025"],
  ["evolution-dette-pib", "Dette publique française en pourcentage du PIB, 2000 à 2026", "INSEE, Banque mondiale, FMI", "2000/2026"],
  ["dette-par-emetteur", "Dette publique française par émetteur et par instrument, T1 2026", "INSEE", "2026-Q1"],
  ["detenteurs-dette", "Détenteurs de la dette négociable de l'État français, T1 2026", "Agence France Trésor", "2026-Q1"],
  ["interets-dette", "Intérêts de la dette publique française, 2025", "INSEE", "2025"],
  ["dette-europe", "Dette publique en pourcentage du PIB en Europe, fin 2025", "Eurostat", "2025-Q4"],
];

/* Chaque ligne des figures « recettes », « dépenses » et « déficit » est une mesure du jeu de données :
   « rémunérations des salariés », « TVA », « protection sociale »… se retrouvent par leur nom. */
const MESURES: Record<string, object[]> = {
  "recettes-publiques": variablesMesurees(RECETTES_LIGNES, DETAIL_RECETTES, "2025"),
  "depenses-publiques": [
    ...variablesMesurees(DEPENSES_NATURE_LIGNES, DETAIL_NATURE, "2025"),
    ...variablesMesurees(DEPENSES_FONCTION_LIGNES, DETAIL_FONCTION, "2024"),
  ],
  "qui-cree-le-deficit": variablesMesurees(DEFICIT_LIGNES, DETAIL_DEFICIT, "2025"),
};

function donneesStructurees(): object[] {
  const page = `${SITE_URL}${URL}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Dette publique française : comprendre les ${nb(detteDerniere.valeur)} milliards d'euros de dette`,
      description: metadata.description,
      inLanguage: "fr-FR",
      datePublished: PUBLIE,
      dateModified: MODIFIE,
      author: { "@type": "Organization", name: "Visualize" },
      publisher: { "@type": "Organization", name: "Visualize", url: SITE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": page },
      about: { "@type": "Thing", name: "Dette publique de la France" },
      /* Les sources citées, pour que la provenance voyage avec la page. */
      citation: [
        { "@type": "CreativeWork", name: "INSEE · Dette trimestrielle de Maastricht", url: detteDerniere.url },
        { "@type": "CreativeWork", name: "Banque de France · Émission et détention de titres français", url: nonResidents.url },
        { "@type": "CreativeWork", name: "Agence France Trésor · dette négociable", url: "https://www.aft.gouv.fr/fr/dette-chiffres-cles" },
        {
          "@type": "CreativeWork",
          name: "Eurostat · dette publique trimestrielle",
          url: "https://ec.europa.eu/eurostat/databrowser/view/gov_10q_ggdebt/default/table",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Pays", item: `${SITE_URL}/pays` },
        { "@type": "ListItem", position: 3, name: "France", item: `${SITE_URL}/pays/france` },
        { "@type": "ListItem", position: 4, name: "Dette publique", item: page },
      ],
    },
    /* La FAQ balisée est exactement celle qui figure en bas de page, mot pour mot :
       c'est la condition pour que ce balisage soit légitime. */
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.r } })),
    },
    ...FIGURES.map(([id, name, createur, periode]) => ({
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${page}#${id}`,
      name,
      url: `${page}#${id}`,
      inLanguage: "fr-FR",
      creator: { "@type": "Organization", name: createur },
      temporalCoverage: periode,
      spatialCoverage: "France",
      isAccessibleForFree: true,
      isPartOf: { "@type": "Article", "@id": page },
      ...(MESURES[id] ? { variableMeasured: MESURES[id] } : {}),
    })),
  ];
}

export const articleFrance: ArticleDette = {
  ...entreeFrance,
  metadata,
  donneesStructurees,
  /* Le résumé que reprend un moteur de réponse : valeur, unité, période, périmètre, source,
     en une phrase et sans graphique à interpréter. */
  resume: () =>
    `À la fin du premier trimestre 2026, la dette publique française au sens de Maastricht s'élève à ${nb(detteDerniere.valeur)} milliards d'euros, soit ${nb(ratioDernier.valeur)} % du PIB, selon l'INSEE. Au 31 mars 2026, les non-résidents détenaient ${nb(nonResidents.valeur)} % des titres de dette de long terme émis par les administrations publiques françaises, selon la Banque de France. Sur le périmètre de la dette négociable de l'État, en valeur de marché, cette part atteint 57,5 % au premier trimestre 2026 selon l'Agence France Trésor. En 2025, les administrations publiques françaises ont dépensé environ 1 714 milliards d'euros pour environ 1 562 milliards de recettes, soit un déficit public de 152,5 milliards d'euros ; le budget général de l'État a enregistré de son côté 441,2 milliards d'euros de dépenses nettes.`,
  Composant: () => <ArticleFrance suggestions={SUGGESTIONS} sujet={SUJETS["dette-publique-france"]} />,
};
