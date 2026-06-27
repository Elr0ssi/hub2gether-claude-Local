import type { Metadata } from "next";
import Link from "next/link";
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

function AITransparencyBanner() {
  return (
    <section
      className="max-w-5xl mx-auto px-6 py-10"
      aria-label="Transparence éditoriale et conformité EU AI Act"
    >
      <div
        className="rounded-2xl p-7"
        style={{
          background: "linear-gradient(135deg, rgba(57,255,136,0.06) 0%, rgba(57,255,136,0.02) 100%)",
          border: "1px solid rgba(57,255,136,0.25)",
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(57,255,136,0.2)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.5)" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="5" r="4" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M5 3v2.5l1.5 1" strokeLinecap="round" strokeWidth="1.2" stroke="currentColor" fill="none" />
              </svg>
              EU AI Act — Transparence
            </span>
          </div>
          <div>
            <h2 className="font-bold text-sm mb-2" style={{ color: "var(--ink)" }}>
              Un condensé mondial, impartial et multi-perspectives
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--ink-2)" }}>
              The Essential Data est un <strong>agrégateur éditorial assisté par intelligence artificielle</strong>.
              Chaque article est une synthèse d'<strong>articles médiatiques du monde entier</strong> — presse internationale,
              rapports d'institutions (FMI, Banque mondiale, OMS, SIPRI…) et recherches académiques — condensés pour offrir
              une <strong>vision impartiale, avec des points de vue multiples</strong>, en temps réel.
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink-3)" }}>
              Conformément au règlement européen sur l'intelligence artificielle (EU AI Act), nous indiquons explicitement
              lorsqu'un contenu est généré ou synthétisé par IA, et nous citons l'intégralité des sources utilisées dans
              chaque article.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/methodology"
                className="text-xs font-semibold underline underline-offset-2"
                style={{ color: "#0D7A40" }}
              >
                Notre méthodologie →
              </Link>
              <Link
                href="/sources"
                className="text-xs font-semibold underline underline-offset-2"
                style={{ color: "#0D7A40" }}
              >
                Sources de données →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const featuredArticles = getFeaturedArticles("empires", 6);

  return (
    <Layout>
      <HeroSection />
      <AITransparencyBanner />
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
