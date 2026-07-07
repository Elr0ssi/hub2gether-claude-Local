import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ARTICLES } from "@/data/articles";

export const metadata: Metadata = {
  title: "Tous les articles — Analyses géopolitiques | The Essential Data",
  description:
    "Explorez toutes les analyses éditoriales de The Essential Data : PIB mondial, épidémies, empires historiques, régimes politiques et puissances militaires. Synthèses data journalism.",
  alternates: {
    canonical: "/articles",
  },
};

const THEME_LABELS: Record<string, string> = {
  economy: "Économie",
  epidemics: "Épidémies",
  empires: "Empires",
  military: "Militaire",
  politics: "Politique",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticlesIndexPage() {
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const byTheme = Object.entries(THEME_LABELS).map(([id, label]) => ({
    id,
    label,
    articles: sorted.filter((a) => a.theme === id),
  }));

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="btn-ghost px-0 mb-8 inline-flex gap-1.5 text-sm"
          style={{ color: "var(--ink-3)" }}
        >
          <ArrowLeft size={15} />
          Retour à l&apos;accueil
        </Link>

        <header className="mb-12">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-4 inline-block"
            style={{ background: "var(--accent)", color: "#000" }}
          >
            Analyses
          </span>
          <h1
            className="font-black mb-4"
            style={{ color: "var(--ink)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.025em" }}
          >
            Tous les articles
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--ink-2)", fontSize: "1.0625rem", maxWidth: "600px" }}>
            {sorted.length} analyses éditoriales sur la géopolitique mondiale — PIB, épidémies, empires historiques, régimes politiques et puissances militaires.
          </p>
        </header>

        {/* Quick filter by theme */}
        <nav className="flex flex-wrap gap-2 mb-10" aria-label="Filtrer par thème">
          {byTheme.map(({ id, label, articles }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              style={{ background: "var(--surface-2)", color: "var(--ink-2)", border: "1px solid var(--border)" }}
            >
              {label}
              <span className="ml-1.5 opacity-60">({articles.length})</span>
            </a>
          ))}
        </nav>

        <div className="space-y-16">
          {byTheme.map(({ id, label, articles }) =>
            articles.length === 0 ? null : (
              <section key={id} id={id}>
                <h2
                  className="font-bold mb-6"
                  style={{ color: "var(--ink)", fontSize: "1.15rem", letterSpacing: "-0.015em" }}
                >
                  {label}
                  <span className="ml-2 text-sm font-normal" style={{ color: "var(--ink-4)" }}>
                    {articles.length} article{articles.length > 1 ? "s" : ""}
                  </span>
                </h2>
                <div className="space-y-3">
                  {articles.map((article) => (
                    <article
                      key={article.slug}
                      className="p-5 rounded-2xl transition-colors"
                      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs" style={{ color: "var(--ink-4)" }}>
                              {formatDate(article.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--ink-4)" }}>
                              <Clock size={10} />
                              {article.readingTime} min
                            </span>
                          </div>
                          <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--ink)", lineHeight: "1.4" }}>
                            <Link
                              href={`/articles/${article.slug}`}
                              className="hover:underline underline-offset-2"
                            >
                              {article.title}
                            </Link>
                          </h3>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--ink-3)" }}>
                            {article.excerpt.slice(0, 160)}{article.excerpt.length > 160 ? "…" : ""}
                          </p>
                          {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <Tag size={10} style={{ color: "var(--ink-4)", marginTop: "1px" }} />
                              {article.tags.slice(0, 4).map((tag) => (
                                <span key={tag} className="tag text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="btn-primary text-xs flex-shrink-0 self-start"
                        >
                          Lire →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}
