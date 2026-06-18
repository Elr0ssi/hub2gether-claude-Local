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

function ArticleCardCompact({ article }: { article: Article }) {
  return (
    <article
      className="flex-shrink-0 w-64 flex flex-col gap-2 p-4 rounded-xl transition-all"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="accent-badge capitalize text-xs">{article.theme}</span>
        <span className="flex items-center gap-1" style={{ color: "var(--ink-4)", fontSize: "0.62rem" }}>
          <Clock size={10} />
          {article.readingTime} min
        </span>
      </div>
      <h3
        className="text-xs font-semibold leading-snug"
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
      <p
        className="text-xs leading-relaxed"
        style={{
          color: "var(--ink-3)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          fontSize: "0.65rem",
        }}
      >
        {article.excerpt}
      </p>
      <Link
        href={`/articles/${article.slug}`}
        className="flex items-center gap-1 text-xs font-semibold mt-auto"
        style={{ color: "#0D7A40" }}
      >
        Lire <ArrowRight size={11} />
      </Link>
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
          className="flex gap-3 overflow-x-auto pb-2"
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
