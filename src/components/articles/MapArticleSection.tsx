"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, MapPin, Clock, ArrowRight, BookOpen } from "lucide-react";
import type { Article } from "@/types";

const SECTION_STYLE: React.CSSProperties = {
  borderRadius: 16,
  padding: "16px 20px",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

function cardEnter(el: HTMLElement) {
  el.style.borderColor = "rgba(57,255,136,0.4)";
  el.style.boxShadow = "0 8px 28px rgba(57,255,136,0.18), 0 2px 8px rgba(0,0,0,0.07)";
  el.style.transform = "translateY(-3px)";
}
function cardLeave(el: HTMLElement) {
  el.style.borderColor = "var(--border)";
  el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
  el.style.transform = "translateY(0)";
}

// ─── Shared search bar ────────────────────────────────────────────────────────
function ArticleSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "5px 10px",
        borderRadius: 8,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        minWidth: 190,
      }}
    >
      <Search size={11} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
      <input
        type="text"
        placeholder="Rechercher un article…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--ink-2)",
          fontSize: "0.68rem",
          width: "100%",
        }}
      />
    </div>
  );
}

// ─── Card for the recommendation drag-carousel ────────────────────────────────
function RecommendedCard({ article }: { article: Article }) {
  return (
    <article
      style={{
        flexShrink: 0,
        width: 256,
        borderRadius: 14,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
        userSelect: "none",
      }}
      onMouseEnter={(e) => cardEnter(e.currentTarget as HTMLElement)}
      onMouseLeave={(e) => cardLeave(e.currentTarget as HTMLElement)}
    >
      <div style={{ height: 3, background: "var(--accent)", opacity: 0.5 }} />
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
          <span
            style={{
              fontSize: "0.52rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#0D7A40",
            }}
          >
            {article.tags[0]}
          </span>
          <span
            style={{
              fontSize: "0.56rem",
              color: "var(--ink-4)",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Clock size={9} /> {article.readingTime} min
          </span>
        </div>
        <h3
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--ink)",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {article.title}
        </h3>
        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--ink-3)",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {article.excerpt}
        </p>
        <Link
          href={`/articles/${article.slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "#0D7A40",
            textDecoration: "none",
            marginTop: 2,
          }}
        >
          Lire l&apos;article <ArrowRight size={10} />
        </Link>
      </div>
    </article>
  );
}

// ─── Small card for the auto-scroll rows ──────────────────────────────────────
function AutoScrollCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{ textDecoration: "none", flexShrink: 0, display: "block" }}
    >
      <div
        style={{
          width: 210,
          padding: "10px 13px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
          userSelect: "none",
        }}
        onMouseEnter={(e) => cardEnter(e.currentTarget as HTMLElement)}
        onMouseLeave={(e) => cardLeave(e.currentTarget as HTMLElement)}
      >
        <div style={{ height: 2, background: "var(--accent)", opacity: 0.35, borderRadius: 2 }} />
        <span
          style={{
            fontSize: "0.52rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          {article.tags[0]}
        </span>
        <p
          style={{
            fontSize: "0.76rem",
            fontWeight: 700,
            color: "var(--ink)",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {article.title}
        </p>
        <span
          style={{
            fontSize: "0.56rem",
            color: "var(--ink-4)",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Clock size={9} /> {article.readingTime} min
        </span>
      </div>
    </Link>
  );
}

// ─── Infinite auto-scrolling row ──────────────────────────────────────────────
function AutoScrollRow({
  articles,
  direction,
}: {
  articles: Article[];
  direction: "left" | "right";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const isHovering = useRef(false);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStartX = useRef(0);
  const offsetAtDrag = useRef(0);
  const [grabbing, setGrabbing] = useState(false);

  const doubled = useMemo(() => [...articles, ...articles], [articles]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || articles.length === 0) return;

    const SPEED = 0.55;
    const step = direction === "left" ? -SPEED : SPEED;

    if (direction === "right") {
      const hw = track.scrollWidth / 2;
      offsetRef.current = -hw;
      track.style.transform = `translateX(${offsetRef.current}px)`;
    }

    function tick() {
      if (!isHovering.current && !isDragging.current && track) {
        const halfWidth = track.scrollWidth / 2;
        offsetRef.current += step;
        if (direction === "left" && offsetRef.current <= -halfWidth) {
          offsetRef.current += halfWidth;
        } else if (direction === "right" && offsetRef.current >= 0) {
          offsetRef.current -= halfWidth;
        }
        track.style.transform = `translateX(${offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [articles, direction]);

  const handleMouseEnter = useCallback(() => { isHovering.current = true; }, []);
  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    isDragging.current = false;
    hasDragged.current = false;
    setGrabbing(false);
  }, []);
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    offsetAtDrag.current = offsetRef.current;
    setGrabbing(true);
  }, []);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 5) hasDragged.current = true;
    offsetRef.current = offsetAtDrag.current + dx;
    trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
  }, []);
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    setGrabbing(false);
  }, []);
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.stopPropagation();
      hasDragged.current = false;
    }
  }, []);

  if (articles.length === 0) return null;

  return (
    <div
      style={{ overflow: "hidden", cursor: grabbing ? "grabbing" : "grab" }}
      onClickCapture={handleClickCapture}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div ref={trackRef} style={{ display: "flex", gap: 10, width: "max-content" }}>
        {doubled.map((article, i) => (
          <AutoScrollCard key={`${article.slug}-${i}`} article={article} />
        ))}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
interface MapArticleSectionProps {
  themeArticles: Article[];
  selectedCountry: string | null;
  themeLabel?: string;
}

export function MapArticleSection({
  themeArticles,
  selectedCountry,
  themeLabel,
}: MapArticleSectionProps) {
  const [recoSearch, setRecoSearch] = useState("");
  const [allSearch, setAllSearch] = useState("");
  const recoRef = useRef<HTMLDivElement>(null);
  const recoIsDragging = useRef(false);
  const recoHasDragged = useRef(false);
  const recoStartClientX = useRef(0);
  const recoStartScrollLeft = useRef(0);
  const recoStartElemX = useRef(0);

  const recommendedArticles = useMemo(() => {
    const countryQ = selectedCountry?.toLowerCase() ?? "";
    const searchQ = recoSearch.trim().toLowerCase();

    if (!countryQ && !searchQ) return themeArticles;

    return themeArticles.filter(
      (a) =>
        (!countryQ ||
          a.title.toLowerCase().includes(countryQ) ||
          a.tags.some((t) => t.toLowerCase().includes(countryQ))) &&
        (!searchQ ||
          a.title.toLowerCase().includes(searchQ) ||
          a.excerpt.toLowerCase().includes(searchQ) ||
          a.tags.some((t) => t.toLowerCase().includes(searchQ)))
    );
  }, [themeArticles, selectedCountry, recoSearch]);

  const allArticles = useMemo(() => {
    const q = allSearch.trim().toLowerCase();
    if (!q) return themeArticles;
    return themeArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [themeArticles, allSearch]);

  const reversed = useMemo(() => [...themeArticles].reverse(), [themeArticles]);

  const recoOnMouseDown = useCallback((e: React.MouseEvent) => {
    const el = recoRef.current;
    if (!el) return;
    recoIsDragging.current = true;
    recoHasDragged.current = false;
    recoStartClientX.current = e.pageX;
    recoStartElemX.current = e.pageX - el.getBoundingClientRect().left;
    recoStartScrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  }, []);

  const recoOnMouseMove = useCallback((e: React.MouseEvent) => {
    if (!recoIsDragging.current || !recoRef.current) return;
    e.preventDefault();
    const el = recoRef.current;
    if (Math.abs(e.pageX - recoStartClientX.current) > 5) recoHasDragged.current = true;
    const x = e.pageX - el.getBoundingClientRect().left;
    const walk = (x - recoStartElemX.current) * 1.5;
    el.scrollLeft = recoStartScrollLeft.current - walk;
  }, []);

  const recoOnMouseUp = useCallback(() => {
    recoIsDragging.current = false;
    if (recoRef.current) recoRef.current.style.cursor = "grab";
  }, []);

  const recoOnMouseLeave = useCallback(() => {
    recoIsDragging.current = false;
    recoHasDragged.current = false;
    if (recoRef.current) recoRef.current.style.cursor = "grab";
  }, []);

  const recoOnClickCapture = useCallback((e: React.MouseEvent) => {
    if (recoHasDragged.current) {
      e.stopPropagation();
      recoHasDragged.current = false;
    }
  }, []);

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Recommendation banner ── */}
      <div style={SECTION_STYLE}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 150 }}>
            <MapPin size={13} style={{ color: "#39FF88", flexShrink: 0 }} />
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0D7A40",
              }}
            >
              Recommandations
            </span>
            {selectedCountry && (
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  padding: "2px 9px",
                  borderRadius: 100,
                  background: "rgba(57,255,136,0.12)",
                  color: "#0D7A40",
                  border: "1px solid rgba(57,255,136,0.3)",
                }}
              >
                {selectedCountry}
              </span>
            )}
            {!selectedCountry && themeLabel && (
              <span style={{ fontSize: "0.6rem", color: "var(--ink-4)" }}>— {themeLabel}</span>
            )}
          </div>

          <ArticleSearch value={recoSearch} onChange={setRecoSearch} />
        </div>

        {recommendedArticles.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              borderRadius: 10,
              background: "var(--surface-2)",
              border: "1px dashed var(--border)",
            }}
          >
            <p style={{ fontSize: "0.72rem", color: "var(--ink-4)" }}>
              {selectedCountry
                ? `Aucun article spécifique pour ${selectedCountry}`
                : "Aucun article disponible"}
            </p>
          </div>
        ) : (
          <div
            ref={recoRef}
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
              cursor: "grab",
            }}
            onClickCapture={recoOnClickCapture}
            onMouseDown={recoOnMouseDown}
            onMouseMove={recoOnMouseMove}
            onMouseUp={recoOnMouseUp}
            onMouseLeave={recoOnMouseLeave}
          >
            {recommendedArticles.map((article) => (
              <RecommendedCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* ── Tous les articles ── */}
      {themeArticles.length > 0 && (
        <div style={SECTION_STYLE}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 150 }}>
              <BookOpen size={13} style={{ color: "#39FF88", flexShrink: 0 }} />
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#0D7A40",
                }}
              >
                Tous les articles
              </span>
              <span style={{ fontSize: "0.6rem", color: "var(--ink-4)" }}>
                · passez la souris pour faire une pause
              </span>
            </div>

            <ArticleSearch value={allSearch} onChange={setAllSearch} />
          </div>

          {allSearch.trim() ? (
            allArticles.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  borderRadius: 10,
                  background: "var(--surface-2)",
                  border: "1px dashed var(--border)",
                }}
              >
                <p style={{ fontSize: "0.72rem", color: "var(--ink-4)" }}>
                  Aucun article trouvé
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {allArticles.map((article) => (
                  <AutoScrollCard key={article.slug} article={article} />
                ))}
              </div>
            )
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <AutoScrollRow articles={themeArticles} direction="left" />
              <AutoScrollRow articles={reversed} direction="right" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
