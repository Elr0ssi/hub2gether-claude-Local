"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  BookOpen,
  Bookmark,
  ImageIcon,
  ChevronDown,
} from "lucide-react";
import type { Article } from "@/types";

const SECTION_STYLE: React.CSSProperties = {
  borderRadius: 16,
  padding: "16px 20px",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const PAGE_SIZE = 12;
const RECO_PREVIEW = 5;

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

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: "0.6rem",
        fontWeight: 800,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#0D7A40",
      }}
    >
      {children}
    </span>
  );
}

// ─── Reserved visual slot ─────────────────────────────────────────────────────
// No photography is shipped yet: every card keeps an empty framed box of the
// right aspect ratio so the layout does not shift the day `heroImage` lands.
function MediaSlot({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16 / 10",
        borderRadius: 10,
        background: "var(--surface-2)",
        border: "1px dashed var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <ImageIcon size={18} style={{ color: "var(--ink-4)", opacity: 0.45 }} aria-hidden="true" />
      {children}
    </div>
  );
}

// ─── Bookmark toggle ──────────────────────────────────────────────────────────
function BookmarkButton({
  saved,
  onToggle,
  title,
}: {
  saved: boolean;
  onToggle: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? `Retirer « ${title} » des favoris` : `Enregistrer « ${title} »`}
      title={saved ? "Retirer des favoris" : "Enregistrer"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 22,
        height: 22,
        borderRadius: 6,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: saved ? "#0D7A40" : "var(--ink-4)",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <Bookmark size={13} fill={saved ? "#39FF88" : "none"} />
    </button>
  );
}

// ─── Recommendation card ──────────────────────────────────────────────────────
function RecommendedCard({
  article,
  saved,
  onToggleSave,
}: {
  article: Article;
  saved: boolean;
  onToggleSave: (slug: string) => void;
}) {
  return (
    <article
      style={{
        borderRadius: 14,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
      onMouseEnter={(e) => cardEnter(e.currentTarget as HTMLElement)}
      onMouseLeave={(e) => cardLeave(e.currentTarget as HTMLElement)}
    >
      <MediaSlot>
        <span
          style={{
            position: "absolute",
            top: 7,
            left: 7,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            padding: "2px 7px",
            borderRadius: 100,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            fontSize: "0.55rem",
            fontWeight: 600,
            color: "var(--ink-3)",
          }}
        >
          <Clock size={9} /> {article.readingTime} min
        </span>
      </MediaSlot>

      <span
        style={{
          fontSize: "0.52rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#0D7A40",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {article.tags[0]}
      </span>

      <h3
        style={{
          fontSize: "0.82rem",
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

      <div
        style={{
          marginTop: "auto",
          paddingTop: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
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
          }}
        >
          Lire l&apos;article <ArrowRight size={10} />
        </Link>
        <BookmarkButton
          saved={saved}
          onToggle={() => onToggleSave(article.slug)}
          title={article.title}
        />
      </div>
    </article>
  );
}

// ─── Compact card for the full grid ───────────────────────────────────────────
function CompactCard({
  article,
  saved,
  onToggleSave,
}: {
  article: Article;
  saved: boolean;
  onToggleSave: (slug: string) => void;
}) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
        minWidth: 0,
      }}
      onMouseEnter={(e) => cardEnter(e.currentTarget as HTMLElement)}
      onMouseLeave={(e) => cardLeave(e.currentTarget as HTMLElement)}
    >
      <span
        style={{
          fontSize: "0.52rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#0D7A40",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {article.tags[0]}
      </span>

      <Link
        href={`/articles/${article.slug}`}
        style={{
          fontSize: "0.76rem",
          fontWeight: 700,
          color: "var(--ink)",
          lineHeight: 1.3,
          textDecoration: "none",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}
      >
        {article.title}
      </Link>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
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
        <BookmarkButton
          saved={saved}
          onToggle={() => onToggleSave(article.slug)}
          title={article.title}
        />
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        borderRadius: 10,
        background: "var(--surface-2)",
        border: "1px dashed var(--border)",
      }}
    >
      <p style={{ fontSize: "0.72rem", color: "var(--ink-4)" }}>{label}</p>
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
  const [allSearch, setAllSearch] = useState("");
  const [showAllReco, setShowAllReco] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [saved, setSaved] = useState<string[]>([]);

  const toggleSave = useCallback((slug: string) => {
    setSaved((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const recommendedArticles = useMemo(() => {
    const countryQ = selectedCountry?.toLowerCase() ?? "";
    if (!countryQ) return themeArticles;

    return themeArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(countryQ) ||
        a.tags.some((t) => t.toLowerCase().includes(countryQ))
    );
  }, [themeArticles, selectedCountry]);

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

  const shownReco = showAllReco
    ? recommendedArticles
    : recommendedArticles.slice(0, RECO_PREVIEW);
  const shownAll = allArticles.slice(0, visibleCount);
  const hasMore = allArticles.length > shownAll.length;

  const onSearch = useCallback((v: string) => {
    setAllSearch(v);
    setVisibleCount(PAGE_SIZE);
  }, []);

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Recommandations ── */}
      <section style={SECTION_STYLE}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 150 }}>
            <MapPin size={13} style={{ color: "#39FF88", flexShrink: 0 }} />
            <SectionLabel>Recommandations</SectionLabel>
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

          {recommendedArticles.length > RECO_PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAllReco((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "#0D7A40",
              }}
            >
              {showAllReco ? "Réduire les recommandations" : "Voir toutes les recommandations"}
              <ArrowRight size={11} />
            </button>
          )}
        </div>

        {shownReco.length === 0 ? (
          <EmptyState
            label={
              selectedCountry
                ? `Aucun article spécifique pour ${selectedCountry}`
                : "Aucun article disponible"
            }
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
              alignItems: "stretch",
            }}
          >
            {shownReco.map((article) => (
              <RecommendedCard
                key={article.slug}
                article={article}
                saved={saved.includes(article.slug)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Tous les articles ── */}
      {themeArticles.length > 0 && (
        <section style={SECTION_STYLE}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 150 }}>
              <BookOpen size={13} style={{ color: "#39FF88", flexShrink: 0 }} />
              <SectionLabel>Tous les articles</SectionLabel>
              <span style={{ fontSize: "0.6rem", color: "var(--ink-4)" }}>
                · {allArticles.length} article{allArticles.length > 1 ? "s" : ""}
              </span>
            </div>

            <ArticleSearch value={allSearch} onChange={onSearch} />
          </div>

          {shownAll.length === 0 ? (
            <EmptyState label="Aucun article trouvé" />
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 10,
                  alignItems: "stretch",
                }}
              >
                {shownAll.map((article) => (
                  <CompactCard
                    key={article.slug}
                    article={article}
                    saved={saved.includes(article.slug)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>

              {hasMore && (
                <div style={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "7px 16px",
                      borderRadius: 100,
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "var(--ink-2)",
                    }}
                  >
                    Charger plus d&apos;articles <ChevronDown size={12} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
