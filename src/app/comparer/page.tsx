import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { ComparerDashboard } from "@/components/comparer/ComparerDashboard";
import { listePays, paysParDefaut } from "@/data/neo/series";

export const metadata: Metadata = {
  title: "Comparer · The Essential Data",
  description:
    "Superposez jusqu'à six pays sur le PIB, le PIB par habitant, la balance commerciale ou l'inflation, de 1960 à aujourd'hui.",
  alternates: { canonical: "/comparer" },
};

/**
 * Le tableau de bord de comparaison.
 *
 * La page serveur n'envoie que le catalogue des pays (nom et libellé) ; les
 * séries arrivent à la demande par `/api/series`, uniquement pour les pays
 * sélectionnés. L'ancienne page `/comparaison` n'est pas touchée.
 */
export default function ComparerPage() {
  return (
    <div style={{ background: "#06070A", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <ComparerDashboard catalogue={listePays()} defaut={paysParDefaut(4)} />
      </main>
    </div>
  );
}
