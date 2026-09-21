import type { Metadata } from "next";
import { DettePage } from "@/components/dette/DettePage";
import {
  detteDerniere,
  FAQ,
  nonResidents,
  ratioDernier,
} from "@/data/articles/detteFrancaise";
import { jsonLdString } from "@/lib/schema";
import "@/components/dette/dette.css";

/* ═══════════════════════════════════════════════════════════════════════════
   /france/economie/dette-publique

   La page est rendue côté serveur : tout le texte de l'article, ses chiffres
   et ses tableaux sont dans le HTML livré. Les composants clients n'ajoutent
   que du mouvement — aucune information n'attend une animation pour exister.

   Les données structurées décrivent ce qui est réellement affiché, et rien
   d'autre : un balisage qui promet plus que la page ne montre est traité
   comme une tromperie par les moteurs, et c'en est une.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";
const chemin = "/france/economie/dette-publique";

const nb = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

const PUBLIE = "2026-09-21";
const MODIFIE = "2026-09-21";

export const metadata: Metadata = {
  /* Le titre est posé en absolu : le gabarit du dépôt ajoute « | The Essential
     Data » à toutes les pages, et celle-ci doit se présenter sous le nom du
     mode Lecture. On le fait ici, sans toucher au gabarit commun. */
  title: {
    absolute: "Dette publique française : montant, évolution, coût et détenteurs | Visualize",
  },
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
  ],
  alternates: { canonical: chemin },
  openGraph: {
    type: "article",
    url: `${siteUrl}${chemin}`,
    title: "Dette publique française : comprendre les 3 536 milliards d'euros",
    description:
      "Montant, évolution, dette/PIB, déficit, détenteurs, intérêts, remboursement et comparaison européenne. Sources INSEE, Banque de France, AFT, Eurostat.",
    publishedTime: PUBLIE,
    modifiedTime: MODIFIE,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dette publique française : comprendre les 3 536 milliards d'euros",
    description:
      "Montant, évolution, dette/PIB, déficit, détenteurs, intérêts, remboursement et comparaison européenne.",
  },
};

export default function Page() {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Dette publique française : comprendre les ${nb(detteDerniere.valeur)} milliards d'euros de dette`,
    description: metadata.description,
    inLanguage: "fr-FR",
    datePublished: PUBLIE,
    dateModified: MODIFIE,
    author: { "@type": "Organization", name: "Visualize" },
    publisher: {
      "@type": "Organization",
      name: "Visualize",
      url: siteUrl,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}${chemin}` },
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
  };

  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "France", item: `${siteUrl}/france` },
      { "@type": "ListItem", position: 3, name: "Économie", item: `${siteUrl}/france/economie` },
      { "@type": "ListItem", position: 4, name: "Dette publique", item: `${siteUrl}${chemin}` },
    ],
  };

  /* La FAQ balisée est exactement celle qui figure en bas de page, mot pour
     mot : c'est la condition pour que ce balisage soit légitime. */
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }} />

      {/* Le résumé que reprend un moteur de réponse : valeur, unité, période,
          périmètre, source, en une phrase et sans graphique à interpréter. */}
      <p className="sr-only">
        À la fin du premier trimestre 2026, la dette publique française au sens de Maastricht
        s&apos;élève à {nb(detteDerniere.valeur)} milliards d&apos;euros, soit{" "}
        {nb(ratioDernier.valeur)}{" "}
        % du PIB, selon l&apos;INSEE. Au 31 mars 2026, les non-résidents
        détenaient {nb(nonResidents.valeur)} % des titres de dette de long terme émis par les
        administrations publiques françaises, selon la Banque de France.
      </p>

      <DettePage />
    </>
  );
}
