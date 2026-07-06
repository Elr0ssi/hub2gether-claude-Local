import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { DetailSection } from "@/components/detail/DetailSection";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { ROMAN_TIMELINE, getEntryBySlug, getAdjacentEntries } from "@/data/timeline";
import { getArticlesByTheme } from "@/data/articles";
import { formatYear } from "@/lib/utils";
import { jsonLdString } from "@/lib/schema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

const ROMAN_EMPIRE_PREFIX = "roman-empire-";

function parseEntitySlug(entity: string): string {
  return entity.startsWith(ROMAN_EMPIRE_PREFIX)
    ? entity.slice(ROMAN_EMPIRE_PREFIX.length)
    : entity;
}

interface PageProps {
  params: Promise<{ theme: string; entity: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return ROMAN_TIMELINE.map((entry) => ({
    theme: "empires",
    entity: `roman-empire-${entry.slug}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { entity } = await params;
  const slug = parseEntitySlug(entity);
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
  const slug = parseEntitySlug(entity);
  const entry = getEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const { prev, next } = getAdjacentEntries(slug);
  const relatedArticles = getArticlesByTheme("empires").slice(0, 3);

  const pageUrl = `${siteUrl}/map/empires/${entity}`;
  const yearLabel = formatYear(entry.year);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Empire romain — ${entry.label} (${yearLabel})`,
    description: entry.description.slice(0, 200),
    url: pageUrl,
    datePublished: "2025-01-01",
    author: { "@type": "Organization", name: "The Essential Data", url: siteUrl },
    publisher: { "@type": "Organization", name: "The Essential Data", url: siteUrl },
    about: {
      "@type": "Thing",
      name: `Empire romain — ${entry.label}`,
      description: entry.description,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Carte Empires", item: `${siteUrl}/map/empires` },
      { "@type": "ListItem", position: 3, name: `${entry.label} (${yearLabel})`, item: pageUrl },
    ],
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema) }} />
      <DetailSection entry={entry} prev={prev} next={next} />
      <ArticleGrid articles={relatedArticles} title="Related articles" />
    </Layout>
  );
}
