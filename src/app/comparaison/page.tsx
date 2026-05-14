import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { ComparisonView } from "@/components/comparison/ComparisonView";

export const metadata: Metadata = {
  title: "Comparaison de pays — The Essential Data",
  description:
    "Comparez les pays sur leur PIB, dette, superficie, population, production de ressources et budget militaire. Ratio automatique et visualisation côte à côte.",
  openGraph: {
    title: "Comparaison de pays | The Essential Data",
    description: "Confrontez deux pays sur 15+ indicateurs : économie, géographie, ressources, militaire.",
    type: "website",
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
