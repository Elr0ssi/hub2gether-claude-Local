import type { Metadata } from "next";
import { AnalysesPage } from "@/components/analyses/AnalysesPage";
import { detteDerniere, ratioDernier } from "@/articles/dette/france/donnees/detteFrancaise";
import { DEFICIT_2025 } from "@/articles/dette/france/donnees/financesPubliques";
import { donneesPays, reperes } from "@/data/concept/conceptGeo";
import { FAQ_ACCUEIL } from "@/data/seo/faqAccueil";
import { JsonLd, schemaFaq } from "@/components/seo/Elements";
import { pibMonde } from "@/data/concept/conceptEconomie";
import { articlesDette } from "@/data/dettes/fiches";
import { compteurDemo } from "@/data/concept/conceptDemographie";

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE D'ACCUEIL

   L'essai « Analyses » est devenu l'accueil du site. /analyses redirige ici
   (voir next.config.ts), et la page est offerte aux moteurs.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export const metadata: Metadata = {
  title: { absolute: "Datlas · Maîtriser le monde en données : apprendre en s'amusant" },
  description:
    "Maîtrisez la géopolitique, l'économie, la démographie, les conflits et les ressources de plus de 200 pays : globes interactifs, données en temps réel, comparaisons et articles sourcés, pour apprendre en jouant et retenir dans le temps. Traduisez et révisez en anglais.",
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
    title: "Datlas · Maîtriser le monde en données : apprendre en s'amusant",
    description: "Géopolitique, économie, démographie, conflits, ressources : apprendre de façon ludique et interactive, et retenir dans le temps.",
  },
  robots: { index: true, follow: true },
};

export default function Accueil() {
  const { annee, pays } = donneesPays();
  const { liste } = reperes();
  return (
    <>
    {/* Le fond de carte du globe d'ouverture : demandé dès le HTML, il est là quand la scène en a besoin. */}
    <link rel="preload" href="/geo/ne_110m_admin_0_countries.geojson" as="fetch" crossOrigin="anonymous" />
    <JsonLd data={[schemaFaq(FAQ_ACCUEIL)]} />
    <AnalysesPage
      articlesDette={articlesDette(6).map((a) => ({ rubrique: a.rubrique, titre: a.titre, href: a.href! }))}
      reperes={liste}
      donnees={pays}
      annee={annee}
      pib={pibMonde()}
      population={(() => {
        const c = compteurDemo();
        return { total: c.population, parSeconde: c.naissancesParSeconde - c.decesParSeconde };
      })()}
      dette={{
        montant: detteDerniere.valeur,
        ratio: ratioDernier.valeur,
        deficit: Math.abs(DEFICIT_2025.valeur),
      }}
    />
    </>
  );
}
