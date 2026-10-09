import type { Metadata } from "next";
import { EconomiePage } from "@/components/concept/EconomiePage";
import {
  articlesEco,
  debatsEco,
  faqEco,
  pibMonde,
  socleEco,
  sourcesEco,
} from "@/data/concept/conceptEconomie";
import { allegerSocle } from "@/data/concept/socleLeger";

/* ═══════════════════════════════════════════════════════════════════════════
   /v2-eco

   L'essai de la page Économie en néo-média : même logique, mêmes données,
   autre habillage. La page est exclue des moteurs et pointe vers /economie en
   canonique tant qu'elle n'est pas retenue.
   ═══════════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: { absolute: "Économie mondiale : PIB, dette, chômage et inflation par pays | Visualize" },
  description:
    "PIB, PIB par habitant, balance commerciale, dette publique, inflation et chômage de plus de 200 pays sur un globe interactif.",
  alternates: { canonical: "/economie" },
  robots: { index: false, follow: true },
};

export default function Page() {
  const socle = socleEco();
  const derniere = socle.annees[socle.annees.length - 1];
  return (
    <EconomiePage
      variante="v2"
      socle={allegerSocle(socle, [derniere])}
      socleUrl="/economie/socle.json"
      pibMonde={pibMonde()}
      sources={sourcesEco()}
      debats={debatsEco()}
      articles={articlesEco(9)}
      faq={faqEco()}
    />
  );
}
