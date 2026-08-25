import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { IntroHeroGlobe } from "@/components/presentation2/IntroHeroGlobe";
import { DataStoryScene } from "@/components/presentation2/DataStoryScene";
import { ArticlesShowcase } from "@/components/presentation2/ArticlesShowcase";

export const metadata: Metadata = {
  title: "The Essential Data · Cartes géopolitiques interactives PIB, Épidémies, Politique",
  description:
    "Explorez le PIB par pays 2025, les épidémies mondiales, les régimes politiques et les forces militaires grâce à des cartes interactives. Données FMI, Banque mondiale, OMS. Data journalism géopolitique de référence.",
  keywords: [
    "carte PIB monde 2025",
    "PIB par pays 2025",
    "carte géopolitique interactive",
    "données économiques mondiales",
    "régimes politiques carte",
    "épidémies mondiales carte",
    "world GDP map",
    "geopolitical data journalism",
    "comparaison pays économie",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Essential Data · Cartes géopolitiques interactives",
    description:
      "PIB par pays 2025, épidémies mondiales (COVID, VIH, Peste Noire), régimes politiques, puissances militaires. Cartes interactives avec données FMI, Banque mondiale et OMS.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Essential Data · Cartes géopolitiques interactives",
    description:
      "PIB par pays 2025, épidémies mondiales, régimes politiques. Data journalism géopolitique.",
  },
};

/**
 * The home page.
 *
 * What used to live at /presentation-2 is now the front door: globe, the
 * thematic maps, then the articles. The previous home is not deleted — it
 * sits at /accueil-v1 and can be swapped back by exchanging the two files.
 */
export default function HomePage() {
  return (
    <Layout>
      {/* .p2-snap turns on scroll snapping for this page only */}
      <div className="p2-snap">
        <IntroHeroGlobe />
        <DataStoryScene />
        <ArticlesShowcase />
      </div>
    </Layout>
  );
}
