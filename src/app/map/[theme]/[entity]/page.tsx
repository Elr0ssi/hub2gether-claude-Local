import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { DetailSection } from "@/components/detail/DetailSection";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { ROMAN_TIMELINE, getEntryBySlug, getAdjacentEntries } from "@/data/timeline";
import { getArticlesByTheme } from "@/data/articles";
import { formatYear } from "@/lib/utils";

interface PageProps {
  params: Promise<{ theme: string; entity: string }>;
}

export async function generateStaticParams() {
  return ROMAN_TIMELINE.map((entry) => ({
    theme: "empires",
    entity: `roman-empire-${entry.slug}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { entity } = await params;
  const slug = entity.replace("roman-empire-", "");
  const entry = getEntryBySlug(slug);

  if (!entry) {
    return { title: "Period not found" };
  }

  const title = `Roman Empire at ${entry.label} (${formatYear(entry.year)})`;
  const description = `${entry.description.slice(0, 155)}…`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | The Essential Data`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/map/empires/${entity}`,
    },
  };
}

export default async function EntityPage({ params }: PageProps) {
  const { entity } = await params;
  const slug = entity.replace("roman-empire-", "");
  const entry = getEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const { prev, next } = getAdjacentEntries(slug);
  const relatedArticles = getArticlesByTheme("empires").slice(0, 3);

  return (
    <Layout>
      <DetailSection entry={entry} prev={prev} next={next} />
      <ArticleGrid articles={relatedArticles} title="Related articles" />
    </Layout>
  );
}
