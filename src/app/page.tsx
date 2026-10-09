import type { Metadata } from "next";
import { AnalysesPage } from "@/components/analyses/AnalysesPage";
import { detteDerniere, ratioDernier } from "@/data/articles/detteFrancaise";
import { DEFICIT_2025 } from "@/data/articles/financesPubliques";
import { donneesPays, reperes } from "@/data/concept/conceptGeo";
import { pibMonde } from "@/data/concept/conceptEconomie";

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE D'ACCUEIL

   L'essai « Analyses » est devenu l'accueil du site. /analyses redirige ici
   (voir next.config.ts), et la page est offerte aux moteurs.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export const metadata: Metadata = {
  title: { absolute: "Visualize · L'économie et la démographie du monde, en données" },
  description:
    "PIB, dette, chômage, population, natalité et mortalité de plus de 200 pays, de 1960 à aujourd'hui, sur un globe interactif et en temps réel. Sources : Banque mondiale, FMI, Nations Unies.",
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
    title: "Visualize · L'économie et la démographie du monde, en données",
    description: "Plus de 200 pays, de 1960 à aujourd'hui, sur un globe interactif et en temps réel.",
  },
  robots: { index: true, follow: true },
};

export default function Accueil() {
  const { annee, pays } = donneesPays();
  const { liste } = reperes();
  return (
    <AnalysesPage
      reperes={liste}
      donnees={pays}
      annee={annee}
      pib={pibMonde()}
      dette={{
        montant: detteDerniere.valeur,
        ratio: ratioDernier.valeur,
        deficit: Math.abs(DEFICIT_2025.valeur),
      }}
    />
  );
}
