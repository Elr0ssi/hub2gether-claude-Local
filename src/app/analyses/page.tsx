import type { Metadata } from "next";
import { AnalysesPage } from "@/components/analyses/AnalysesPage";
import { detteDerniere, ratioDernier } from "@/data/articles/detteFrancaise";
import { DEFICIT_2025 } from "@/data/articles/financesPubliques";
import { donneesPays, reperes } from "@/data/concept/conceptGeo";

/* ═══════════════════════════════════════════════════════════════════════════
   /analyses

   Un essai : ce que pourrait devenir la page d'accueil, en néo-média. La page
   est exclue des moteurs et ne figure pas au plan du site tant qu'elle n'est
   pas retenue — l'accueil actuel garde le référencement.
   ═══════════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: { absolute: "Visualize · Analyses : le monde en chiffres" },
  description:
    "PIB, dette, chômage et population de plus de 200 pays : classements, cartes et dossiers qui vont droit au montant.",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  const { annee, pays } = donneesPays();
  const { liste } = reperes();
  return (
    <AnalysesPage
      reperes={liste}
      donnees={pays}
      annee={annee}
      dette={{
        montant: detteDerniere.valeur,
        ratio: ratioDernier.valeur,
        deficit: Math.abs(DEFICIT_2025.valeur),
      }}
    />
  );
}
