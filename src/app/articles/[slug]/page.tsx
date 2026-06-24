import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ArticleCarousel } from "@/components/articles/ArticleCarousel";
import { ArticleBody } from "@/components/articles/ArticleBody";
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
    keywords: article.tags,
    openGraph: {
      title: `${article.title} | The Essential Data`,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      tags: article.tags,
      images: article.heroImage ? [{ url: article.heroImage }] : undefined,
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

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function AdSlot({ format }: { format: "vertical" | "horizontal" }) {
  const dim = format === "vertical"
    ? { width: "160px", height: "600px", label: "160×600" }
    : { width: "100%", height: "90px", label: "728×90" };
  return (
    <div style={{
      width: dim.width, height: dim.height,
      border: "1px dashed var(--border)",
      background: "var(--surface-2)",
      borderRadius: "8px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
    }}>
      <span style={{ color: "var(--ink-4)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Publicité</span>
      <span style={{ color: "var(--ink-4)", fontSize: "0.5rem", opacity: 0.6 }}>{dim.label}</span>
    </div>
  );
}

const THEME_MAP: Record<string, { label: string; backHref: string; locale: string }> = {
  economy:   { label: "Économie",  backHref: "/map/economy",   locale: "fr-FR" },
  epidemics: { label: "Épidémies", backHref: "/map/epidemics", locale: "fr-FR" },
  empires:   { label: "Empires",   backHref: "/map/empires",   locale: "en-US" },
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const themeConfig = THEME_MAP[article.theme] ?? { label: article.theme, backHref: "/", locale: "en-US" };

  const related = getArticlesByTheme(article.theme)
    .filter((a) => a.slug !== slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.heroImage,
    author: { "@type": "Organization", name: "The Essential Data" },
    publisher: { "@type": "Organization", name: "The Essential Data" },
    keywords: article.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "/" },
      { "@type": "ListItem", position: 2, name: themeConfig.label, item: themeConfig.backHref },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero image */}
      {article.heroImage && (
        <div className="relative w-full overflow-hidden" style={{ height: "380px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.heroImage}
            alt={article.heroCaption ?? article.title}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.55)" }}
          />
          {/* Title overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-16"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
                  style={{ background: "var(--accent)", color: "#000" }}
                >
                  {themeConfig.label}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <Clock size={11} />
                  {article.readingTime} min
                </span>
              </div>
              <h1
                className="font-black leading-tight"
                style={{ color: "#fff", fontSize: "clamp(1.4rem, 3vw, 2.1rem)", letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
              >
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Ad + Article layout */}
      <div className="flex justify-center gap-6">
        {/* Left ad — desktop only */}
        <aside className="hidden xl:flex flex-col flex-shrink-0 pt-10" style={{ width: "160px" }}>
          <AdSlot format="vertical" />
        </aside>

        {/* Article content column */}
        <div className="w-full min-w-0" style={{ maxWidth: "48rem" }}>

          {/* Mobile top ad */}
          <div className="xl:hidden px-6 pt-6">
            <AdSlot format="horizontal" />
          </div>

      <article className="px-6 py-10">
        {/* Back link */}
        <Link
          href={themeConfig.backHref}
          className="btn-ghost px-0 mb-6 inline-flex gap-1.5 text-sm"
          style={{ color: "var(--ink-3)" }}
        >
          <ArrowLeft size={15} />
          Retour à la carte {themeConfig.label}
        </Link>

        {/* Header (shown when no hero image) */}
        {!article.heroImage && (
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="accent-badge capitalize">{themeConfig.label}</span>
              <span className="flex items-center gap-1 text-caption" style={{ color: "var(--ink-4)" }}>
                <Clock size={11} />
                {article.readingTime} min
              </span>
            </div>
            <h1
              className="text-heading-1 mb-4"
              style={{ color: "var(--ink)", fontSize: "2rem", letterSpacing: "-0.025em" }}
            >
              {article.title}
            </h1>
            <p className="text-body" style={{ fontSize: "1.0625rem", color: "var(--ink-2)" }}>
              {article.excerpt}
            </p>
          </header>
        )}

        {/* Byline */}
        <div
          className="flex items-center justify-between gap-4 py-4 mb-8"
          style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: "var(--accent)", color: "#000" }}
            >
              T
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
                The Essential Data
              </p>
              <p className="text-xs" style={{ color: "var(--ink-4)" }}>
                {formatDate(article.publishedAt, themeConfig.locale)}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--ink-4)" }}>
            <Clock size={11} />
            {article.readingTime} min de lecture
          </span>
        </div>

        {/* Hero caption */}
        {article.heroCaption && article.heroImage && (
          <p className="text-xs italic mb-6 -mt-2" style={{ color: "var(--ink-4)" }}>
            {article.heroCaption}
          </p>
        )}

        {/* Article body — rich content or excerpt fallback */}
        {article.body ? (
          <ArticleBody sections={article.body} />
        ) : (
          <div className="space-y-6">
            <p
              className="text-base leading-relaxed"
              style={{ fontSize: "1.0625rem", color: "var(--ink-2)", lineHeight: "1.8" }}
            >
              {article.excerpt}
            </p>
            <div
              className="p-6 rounded-2xl"
              style={{ border: "1px solid rgba(57,255,136,0.25)", background: "var(--accent-dim)" }}
            >
              <p className="text-small font-semibold mb-1" style={{ color: "#0D7A40" }}>
                Explorer les données
              </p>
              <p className="text-small mb-3">
                Retrouvez les données liées à cet article sur notre carte interactive.
              </p>
              <Link href={themeConfig.backHref} className="btn-primary text-xs">
                Ouvrir la carte
              </Link>
            </div>
          </div>
        )}

        {/* CTA to map */}
        <div
          className="mt-10 p-6 rounded-2xl"
          style={{ background: "var(--accent-dim)", border: "1px solid rgba(57,255,136,0.25)" }}
        >
          <p className="text-small font-semibold mb-1" style={{ color: "#0D7A40" }}>
            Explorer les données interactives
          </p>
          <p className="text-small mb-3" style={{ color: "var(--ink-2)" }}>
            Visualisez les données présentées dans cet article sur notre carte mondiale interactive.
          </p>
          <Link href={themeConfig.backHref} className="btn-primary text-xs">
            Ouvrir la carte →
          </Link>
        </div>

        {/* Tags */}
        <div
          className="flex flex-wrap gap-2 pt-6 mt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Tag size={12} style={{ color: "var(--ink-4)", marginTop: "2px" }} />
          {article.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </article>

          {/* Mobile bottom ad */}
          <div className="xl:hidden px-6 pb-6">
            <AdSlot format="horizontal" />
          </div>

        </div>{/* end article content column */}

        {/* Right ad — desktop only */}
        <aside className="hidden xl:flex flex-col flex-shrink-0 pt-10" style={{ width: "160px" }}>
          <AdSlot format="vertical" />
        </aside>
      </div>{/* end ad + article layout */}

      {/* Related articles */}
      {related.length > 0 && (
        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-3xl mx-auto px-6 py-8">
            <ArticleCarousel
              articles={related}
              title={article.theme === "empires" ? "Related analysis" : "À lire aussi"}
              subtitle={
                article.theme === "economy"
                  ? "Autres analyses économiques et données mondiales."
                  : article.theme === "epidemics"
                  ? "Autres analyses sur les épidémies et la santé mondiale."
                  : "More editorial analysis on the empires theme."
              }
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
