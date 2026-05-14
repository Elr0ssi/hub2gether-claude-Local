import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { ARTICLES, getArticleBySlug, getArticlesByTheme } from "@/data/articles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | The Essential Data`,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      canonical: `/articles/${slug}`,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getArticlesByTheme(article.theme)
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "The Essential Data",
    },
    publisher: {
      "@type": "Organization",
      name: "The Essential Data",
    },
    keywords: article.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Articles", item: "/articles" },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Back */}
        <Link
          href="/map/empires"
          className="btn-ghost px-0 mb-8 inline-flex gap-1.5 text-sm"
          style={{ color: "var(--ink-3)" }}
        >
          <ArrowLeft size={15} />
          Back to map
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="accent-badge capitalize">{article.theme}</span>
            <span className="flex items-center gap-1 text-caption" style={{ color: "var(--ink-4)" }}>
              <Clock size={11} />
              {article.readingTime} min read
            </span>
          </div>

          <h1 className="text-heading-1 mb-4" style={{ color: "var(--ink)", fontSize: "2rem", letterSpacing: "-0.025em" }}>
            {article.title}
          </h1>

          <p className="text-body" style={{ fontSize: "1.0625rem", color: "var(--ink-2)" }}>
            {article.excerpt}
          </p>

          <div className="flex items-center gap-3 mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-small">The Essential Data</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span className="text-caption">{formatDate(article.publishedAt)}</span>
          </div>
        </header>

        {/* Article body (placeholder) */}
        <div className="space-y-6">
          <p className="text-body leading-relaxed" style={{ fontSize: "1.0625rem" }}>
            {article.excerpt} This is a preview of the full article. The complete analysis —
            including primary sources, historical maps, and expert commentary — will be available
            as we develop the editorial platform.
          </p>

          <div
            className="p-6 rounded-2xl border"
            style={{ border: "1px solid var(--accent-border)", background: "var(--accent-dim)" }}
          >
            <p className="text-small font-semibold mb-1" style={{ color: "#0D7A40" }}>
              Explore the data
            </p>
            <p className="text-small mb-3">
              See the territories described in this article on our interactive historical map.
            </p>
            <Link href="/map/empires" className="btn-primary text-xs">
              Open the map
            </Link>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            {article.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <ArticleGrid articles={related} title="Related analysis" />
      )}
    </Layout>
  );
}

