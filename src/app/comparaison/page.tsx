import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { ComparisonView } from "@/components/comparison/ComparisonView";

export const metadata: Metadata = {
  title: "Comparaison de pays 2025 — PIB, Dette, Population, Militaire",
  description:
    "Comparez deux pays sur 15+ indicateurs : PIB 2025, dette publique, superficie, population, ressources naturelles et budget militaire. Ratio automatique et visualisation côte à côte. Données FMI et Banque mondiale.",
  keywords: [
    "comparaison pays",
    "comparer pays PIB",
    "comparaison économique pays 2025",
    "PIB France Allemagne comparaison",
    "PIB Chine États-Unis comparaison",
    "dette publique comparaison",
    "country comparison GDP",
    "compare countries economy",
    "indicateurs économiques par pays",
    "tableau de bord pays",
  ],
  alternates: { canonical: "/comparaison" },
  openGraph: {
    title: "Comparaison de pays 2025 — PIB, Dette, Population | The Essential Data",
    description:
      "Confrontez deux pays sur 15+ indicateurs : PIB 2025 (FMI), dette publique, chômage, superficie, population, ressources et militaire. Ratio automatique.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparaison de pays 2025 — The Essential Data",
    description: "Comparez deux pays sur PIB, dette, population, militaire et ressources.",
  },
};

export default function ComparaisonPage() {
  return (
    <Layout>
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div className="mb-2">
          <span className="accent-badge text-xs">Outil comparatif</span>
        </div>
        <h1 className="text-heading-1 mb-3" style={{ color: "var(--ink)" }}>
          Comparaison de pays
        </h1>
        <p className="text-body" style={{ maxWidth: "540px" }}>
          Sélectionnez deux pays et comparez-les sur des dizaines d'indicateurs — PIB, dette, superficie, population, ressources naturelles et budget militaire. Le ratio est calculé automatiquement.
        </p>
      </div>

      {/* Interactive comparison */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <ComparisonView />
      </div>
    </Layout>
  );
}
