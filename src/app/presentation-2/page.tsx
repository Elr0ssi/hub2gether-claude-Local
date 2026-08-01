import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { IntroHeroGlobe } from "@/components/presentation2/IntroHeroGlobe";
import { DataStoryScene } from "@/components/presentation2/DataStoryScene";
import { ArticlesShowcase } from "@/components/presentation2/ArticlesShowcase";

export const metadata: Metadata = {
  title: "Présentation 2 (prototype) — The Essential Data",
  description: "Prototype de nouvelle page d'accueil — globe interactif, cartes thématiques et articles.",
  robots: { index: false, follow: false },
};

export default function Presentation2Page() {
  return (
    <Layout>
      <IntroHeroGlobe />
      <DataStoryScene />
      <ArticlesShowcase />
    </Layout>
  );
}
