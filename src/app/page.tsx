import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/hero/HeroSection";
import { ThemePreviewGrid } from "@/components/hero/ThemePreviewGrid";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { FAQSection } from "@/components/faq/FAQSection";
import { THEMES } from "@/data/themes";
import { getFeaturedArticles } from "@/data/articles";
import { FAQS_EMPIRES } from "@/data/faqs";

export const metadata: Metadata = {
  title: "The Essential Data — Cartes géopolitiques interactives PIB, Épidémies, Empires",
  description:
    "Explorez le PIB par pays 2025, les épidémies mondiales et les grands empires historiques grâce à des cartes interactives. Données FMI, Banque mondiale, OMS. Data journalism géopolitique de référence.",
  keywords: [
    "carte PIB monde 2025",
    "PIB par pays 2025",
    "carte géopolitique interactive",
    "données économiques mondiales",
    "empires historiques carte",
    "empire romain carte interactif",
    "épidémies mondiales carte",
    "world GDP map",
    "geopolitical data journalism",
    "comparaison pays économie",
  ],
  openGraph: {
    title: "The Essential Data — Cartes géopolitiques interactives",
    description:
      "PIB par pays 2025, épidémies mondiales (COVID, VIH, Peste Noire), empires historiques. Cartes interactives avec données FMI, Banque mondiale et OMS.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Essential Data — Cartes géopolitiques interactives",
    description:
      "PIB par pays 2025, épidémies mondiales, empires historiques. Data journalism géopolitique.",
  },
};

export default function HomePage() {
  const featuredArticles = getFeaturedArticles("empires", 6);

  return (
    <Layout>
      <HeroSection />
      <ThemePreviewGrid themes={THEMES} />
      <ArticleGrid
        articles={featuredArticles}
        title="Analyses approfondies"
        subtitle="Décryptages éditoriaux sur la montée et la chute des empires, les mécaniques de l'expansion et les leçons de l'histoire."
      />
      <FAQSection items={FAQS_EMPIRES} />
    </Layout>
  );
}
