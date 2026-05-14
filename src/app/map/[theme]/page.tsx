import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { MapViewLoader } from "@/components/map/MapViewLoader";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { FAQSection } from "@/components/faq/FAQSection";
import { getThemeById } from "@/data/themes";
import { getArticlesByTheme } from "@/data/articles";
import { getFaqsByTheme } from "@/data/faqs";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ThemeId } from "@/types";

interface PageProps {
  params: Promise<{ theme: string }>;
  searchParams: Promise<{ year?: string }>;
}

export async function generateStaticParams() {
  return [{ theme: "empires" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { theme } = await params;
  const themeData = getThemeById(theme);

  if (!themeData) {
    return { title: "Theme not found" };
  }

  if (theme === "empires") {
    return {
      title: "Roman Empire — Interactive Historical Map",
      description:
        "Explore the Roman Empire from 500 BC to 1453 AD through interactive maps. Track territorial expansion, key periods, and historical context.",
      openGraph: {
        title: "Roman Empire — Interactive Historical Map | The Essential Data",
        description:
          "Trace the rise and fall of the Roman Empire across seven key periods, from the founding city-state to the fall of Constantinople.",
        type: "website",
      },
    };
  }

  return {
    title: `${themeData.label} — Interactive Map`,
    description: themeData.description,
  };
}

export default async function MapPage({ params, searchParams }: PageProps) {
  const { theme } = await params;
  const { year } = await searchParams;
  const themeData = getThemeById(theme);

  if (!themeData) {
    notFound();
  }

  const articles = getArticlesByTheme(theme);
  const faqs = getFaqsByTheme(theme);
  const initialYear = year ? parseInt(year) : 117;

  return (
    <Layout>
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="mb-2">
          <span className="accent-badge text-xs capitalize">{themeData.label}</span>
        </div>
        <h1 className="text-heading-1 mb-2" style={{ color: "var(--ink)" }}>
          {theme === "empires" ? "Roman Empire" : themeData.label}
        </h1>
        <p className="text-body" style={{ maxWidth: "540px" }}>
          {theme === "empires"
            ? "Trace the rise and fall of the Roman Empire across seven key periods, from the founding city-state to the fall of Constantinople."
            : themeData.description}
        </p>
      </div>

      {/* Interactive map */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <Suspense
          fallback={
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ border: "1px solid var(--border)", height: "600px" }}
            >
              <Skeleton className="w-full h-full" />
            </div>
          }
        >
          <MapViewLoader theme={themeData.id as ThemeId} initialYear={initialYear} />
        </Suspense>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <ArticleGrid
          articles={articles.slice(0, 3)}
          title="Related analysis"
          subtitle="Editorial deep-dives on the Roman Empire — its expansion, administration, decline and legacy."
        />
      )}

      {/* FAQ */}
      {faqs.length > 0 && <FAQSection items={faqs} />}
    </Layout>
  );
}
