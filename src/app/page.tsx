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
  title: "The Essential Data — Geopolitical Intelligence",
  description:
    "Explore history's greatest empires, conflicts, and economic powers through interactive maps and data journalism. Start with the Roman Empire.",
  openGraph: {
    title: "The Essential Data — Geopolitical Intelligence",
    description:
      "Interactive historical maps and data journalism. Economy, conflicts, empires, epidemics and power dynamics — mapped through time.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Essential Data — Geopolitical Intelligence",
    description: "Interactive historical maps and data journalism.",
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
        title="Deep dives"
        subtitle="Editorial analysis on the rise and fall of empires, the mechanics of expansion, and the lessons of history."
      />
      <FAQSection items={FAQS_EMPIRES} />
    </Layout>
  );
}
