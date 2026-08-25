import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { AdRail, AdBanner } from "@/components/layout/AdRail";
import { TestArticleHero } from "@/components/testArticle/TestArticleHero";
import { TestArticleBody } from "@/components/testArticle/TestArticleBody";
import { TEST_ARTICLE } from "@/data/testArticle/testArticleData";

export const metadata: Metadata = {
  title: `${TEST_ARTICLE.title} — Format en test | The Essential Data`,
  description: TEST_ARTICLE.standfirst,
  alternates: { canonical: "/test-article" },
  // A layout laboratory, not an editorial publication: it should not be
  // indexed alongside the articles it is a rehearsal for.
  robots: { index: false, follow: false },
};

/**
 * The article format under test.
 *
 * It takes the economy page's full-bleed geometry rather than the centred
 * column the published articles use: margin ad rails above 1180px, the same
 * horizontal banner below that width, and the reading column between them.
 */
export default function TestArticlePage() {
  return (
    <Layout>
      <TestArticleHero />

      <div className="eco-section-body ta-page" style={{ paddingTop: 28, paddingBottom: 64 }}>
        <div className="eco-section-row">
          <AdRail side="left" />
          <div className="eco-section-main">
            <AdBanner />
            <TestArticleBody />
            <div style={{ marginTop: 44 }}>
              <AdBanner />
            </div>
          </div>
          <AdRail side="right" />
        </div>
      </div>
    </Layout>
  );
}
