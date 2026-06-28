import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article
      className="card-hover flex flex-col h-full overflow-hidden group"
      style={{ borderRadius: "16px" }}
    >
      {/* Hero image or colored header */}
      {article.heroImage ? (
        <div className="relative w-full shrink-0" style={{ aspectRatio: "16/9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
            }}
          />
          {/* Theme badge overlaid on image */}
          <div className="absolute bottom-3 left-3">
            <span className="accent-badge capitalize">{article.theme}</span>
          </div>
        </div>
      ) : (
        <div
          className="relative w-full shrink-0 flex items-end px-3 pb-2"
          style={{
            height: "60px",
            background:
              "linear-gradient(135deg, var(--accent-dim) 0%, var(--surface-2) 100%)",
          }}
        >
          <span className="accent-badge capitalize">{article.theme}</span>
        </div>
      )}

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Reading time */}
        <span
          className="flex items-center gap-1 text-caption"
          style={{ color: "var(--ink-4)" }}
        >
          <Clock size={11} />
          {article.readingTime} min
        </span>

        {/* Title — 2 lines clamped */}
        <h3
          className="text-heading-3 leading-snug"
          style={{
            color: "var(--ink)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.title}
        </h3>

        {/* Excerpt — 2 lines clamped */}
        <p
          className="text-small leading-relaxed"
          style={{
            color: "var(--ink-3)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-caption px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--ink-3)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="text-caption" style={{ color: "var(--ink-4)" }}>
            {formatDate(article.publishedAt)}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
            style={{ color: "#0D7A40" }}
          >
            Lire
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
