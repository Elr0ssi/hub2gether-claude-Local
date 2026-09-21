import type { Metadata } from "next";
import { EconomiePage } from "@/components/concept/EconomiePage";
import { articlesEco, debatsEco, faqEco, socleEco, sourcesEco } from "@/data/concept/conceptEconomie";

export const metadata: Metadata = {
  title: "Concept · Économie · The Essential Data",
  description:
    "Prototype de direction artistique : la page économie, son globe, son classement par date et sa FAQ.",
  robots: { index: false, follow: false },
};

/**
 * La page économie du prototype.
 *
 * La lecture du socle se fait ici, côté serveur : le navigateur ne reçoit que
 * les dates retenues et les indicateurs affichés, pas la base.
 */
export default function ConceptEconomiePage() {
  return (
    <EconomiePage
      socle={socleEco()}
      sources={sourcesEco()}
      debats={debatsEco()}
      articles={articlesEco(9)}
      faq={faqEco()}
    />
  );
}
