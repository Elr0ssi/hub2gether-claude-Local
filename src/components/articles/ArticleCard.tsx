import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
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
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category badge */}
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

        {/* Title */}
        <h3
          className="text-heading-3 leading-snug flex-1"
          style={{
            color: "var(--ink)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p
          className="text-small leading-relaxed"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="text-caption">{formatDate(article.publishedAt)}</span>
          <Link
            href={`/articles/${article.slug}`}
            className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
            style={{ color: "#0D7A40" }}
          >
            Read article
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
