import type { Metadata } from "next";
import { EnTete, Pied } from "@/components/concept/pieces";
import { ExplorerPage } from "@/components/explorer/ExplorerPage";
import "@/components/concept/concept.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export const metadata: Metadata = {
  title: { absolute: "Explorer le monde pays par pays : globe en relief, villes, montagnes, rivières | Visualize" },
  description:
    "Un globe en relief pour explorer chaque pays : grandes villes, montagnes, fleuves, et bientôt centrales nucléaires et sièges sociaux. Choisissez un pays, cochez des couches, le globe s'y place.",
  alternates: { canonical: "/explorer" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/explorer`,
    title: "Explorer le monde pays par pays",
    description: "Un globe en relief : villes, montagnes, fleuves et plus encore, pays par pays.",
  },
};

export default function Page() {
  return (
    <div className="cg">
      <EnTete actif="Explorer" />
      <main>
        <ExplorerPage />
      </main>
      <Pied />
    </div>
  );
}
