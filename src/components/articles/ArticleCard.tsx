import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="card-hover flex flex-col h-full group" style={{ borderRadius: "16px" }}>
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header row: theme badge + reading time */}
        <div className="flex items-center justify-between">
          <span className="accent-badge capitalize">{article.theme}</span>
          <span
            className="flex items-center gap-1 text-caption"
            style={{ color: "var(--ink-4)" }}
          >
            <Clock size={11} />
            {article.readingTime} min
          </span>
        </div>

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

        {/* Excerpt — 3 lines clamped */}
        <p
          className="text-small leading-relaxed flex-1"
          style={{
            color: "var(--ink-3)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="text-caption" style={{ color: "var(--ink-4)" }}>
            {formatDate(article.publishedAt)}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
            style={{ color: "var(--accent-fg, #0D7A40)" }}
          >
            Lire l&apos;article
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
