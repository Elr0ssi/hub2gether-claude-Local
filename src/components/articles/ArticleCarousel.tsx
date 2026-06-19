"use client";

import { useState } from "react";
import { Search, Clock, ArrowRight, Newspaper, MapPin } from "lucide-react";
import Link from "next/link";
import { useDragScroll } from "@/hooks/useDragScroll";
import type { Article } from "@/types";

interface ArticleCarouselProps {
  articles: Article[];
  title: string;
  subtitle?: string;
  emptyMessage?: string;
  icon?: "newspaper" | "pin";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
}

function ArticleCardCompact({ article }: { article: Article }) {
  return (
    <article
      className="flex-shrink-0 w-72 flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 article-card-hover"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
    >
      {/* Accent bar */}
      <div style={{ height: "3px", background: "var(--accent)", opacity: 0.45, flexShrink: 0 }} />

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="accent-badge capitalize text-xs">{article.theme}</span>
          <span className="flex items-center gap-1" style={{ color: "var(--ink-4)", fontSize: "0.62rem" }}>
            <Clock size={10} />
            {article.readingTime} min
          </span>
        </div>
        <h3
          className="font-bold leading-snug"
          style={{
            color: "var(--ink)",
            fontSize: "0.82rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.title}
        </h3>
        <p
          className="leading-relaxed"
          style={{
            color: "var(--ink-3)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.72rem",
          }}
        >
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2.5" style={{ borderTop: "1px solid var(--border)" }}>
          <span style={{ color: "var(--ink-4)", fontSize: "0.62rem" }}>{formatDate(article.publishedAt)}</span>
          <Link
            href={`/articles/${article.slug}`}
            className="flex items-center gap-1 text-xs font-semibold transition-all hover:gap-2"
            style={{ color: "#0D7A40" }}
          >
            Lire l'article <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleCarousel({ articles, title, subtitle, emptyMessage, icon = "newspaper" }: ArticleCarouselProps) {
  const [search, setSearch] = useState("");
  const { ref, onMouseDown, onMouseUp, onMouseLeave, onMouseMove } = useDragScroll();

  const filtered = search.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : articles;

  const Icon = icon === "pin" ? MapPin : Newspaper;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color: "var(--ink-3)" }} />
          <div>
            <p className="text-xs font-bold" style={{ color: "var(--ink-2)" }}>{title}</p>
            {subtitle && <p style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>{subtitle}</p>}
          </div>
        </div>
        {/* Search */}
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", minWidth: "160px" }}
        >
          <Search size={11} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
            style={{ color: "var(--ink-2)", fontSize: "0.7rem" }}
          />
        </div>
      </div>

      <style>{`
        .article-card-hover:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.16);
          border-color: rgba(57,255,136,0.3) !important;
        }
      `}</style>

      {/* Carousel */}
      {filtered.length === 0 ? (
        <div
          className="flex items-center justify-center py-6 rounded-xl"
          style={{ background: "var(--surface-2)", border: "1px dashed var(--border)" }}
        >
          <p style={{ color: "var(--ink-4)", fontSize: "0.72rem" }}>
            {emptyMessage ?? "Aucun article disponible"}
          </p>
        </div>
      ) : (
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", cursor: "grab" }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          {filtered.map((article) => (
            <ArticleCardCompact key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
