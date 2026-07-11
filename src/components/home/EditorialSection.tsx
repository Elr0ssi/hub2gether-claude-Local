import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ECONOMY_ARTICLES,
  POLITICS_ARTICLES,
  MILITARY_ARTICLES,
  EPIDEMICS_ARTICLES,
} from "@/data/articles";
import type { Article } from "@/types";

const FEATURED = ECONOMY_ARTICLES[0];
const SECONDARY: Article[] = [POLITICS_ARTICLES[0], MILITARY_ARTICLES[0]];
const TERTIARY: Article[] = [EPIDEMICS_ARTICLES[0], ECONOMY_ARTICLES[1], POLITICS_ARTICLES[1]];

const THEME_COLORS: Record<string, string> = {
  economy: "#10B981",
  politics: "#8B5CF6",
  military: "#F59E0B",
  epidemics: "#3B82F6",
  empires: "#39FF88",
};

function articleAccent(article: Article): string {
  return THEME_COLORS[article.theme] ?? "#39FF88";
}

export function EditorialSection() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(56px, 8vh, 96px) 0",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
        }}
      >
        {/* ── Section header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: "clamp(32px, 5vh, 52px)",
            paddingBottom: "clamp(20px, 3vh, 32px)",
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#39FF88",
                marginBottom: 12,
              }}
            >
              § 02 — Briefings régionaux
            </p>
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 3.2rem)",
                fontWeight: 700,
                fontStyle: "normal",
                color: "#0A0A0A",
                letterSpacing: "-0.025em",
                lineHeight: 1.12,
              }}
            >
              Ce que les chancelleries{" "}
              <em style={{ fontStyle: "italic", color: "#3A3A3A" }}>savent déjà</em>
            </h2>
          </div>
          <Link
            href="/articles"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9B9B9B",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "color 0.15s",
            }}
          >
            Tous les briefings <ArrowRight size={11} />
          </Link>
        </div>

        {/* ── Main editorial grid ── */}
        <div
          className="editorial-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(32px, 4vw, 52px)",
            marginBottom: "clamp(40px, 5vh, 60px)",
          }}
        >
          {/* Featured large article */}
          <article>
            <Link href={`/articles/${FEATURED.slug}`} style={{ textDecoration: "none", display: "block" }}>
              {/* Image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 8",
                  borderRadius: 18,
                  overflow: "hidden",
                  marginBottom: 24,
                  background: "linear-gradient(135deg, #0A0A1A 0%, #0D2817 50%, #1a0a0a 100%)",
                  position: "relative",
                }}
              >
                {FEATURED.heroImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={FEATURED.heroImage}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(20%)",
                      opacity: 0.88,
                    }}
                  />
                )}
                {/* Category + read time badges */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      background: articleAccent(FEATURED),
                      color: "#000",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      borderRadius: 100,
                    }}
                  >
                    {FEATURED.tags[0]}
                  </span>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      color: "#fff",
                      fontSize: "0.55rem",
                      fontWeight: 600,
                      padding: "5px 12px",
                      borderRadius: 100,
                    }}
                  >
                    {FEATURED.readingTime} MIN
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <p
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#C4C4C4",
                  marginBottom: 12,
                }}
              >
                À LA UNE · {new Date(FEATURED.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(1.3rem, 2.5vw, 2.1rem)",
                  fontWeight: 700,
                  color: "#0A0A0A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.18,
                  marginBottom: 14,
                }}
              >
                {FEATURED.title}
              </h3>

              {/* Excerpt */}
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "#3A3A3A",
                  lineHeight: 1.75,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                } as React.CSSProperties}
              >
                {FEATURED.excerpt}
              </p>
            </Link>
          </article>

          {/* Right column: 2 secondary articles */}
          <div
            className="editorial-secondary"
            style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 3vh, 36px)" }}
          >
            {SECONDARY.map((article) => (
              <SecondaryArticle key={article.slug} article={article} />
            ))}
          </div>
        </div>

        {/* ── Tertiary articles row ── */}
        <div
          style={{
            borderTop: "1px solid #F0F0F0",
            paddingTop: "clamp(28px, 4vh, 44px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {TERTIARY.map((article) => (
            <TertiaryArticle key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Secondary article (right column) ── */
function SecondaryArticle({ article }: { article: Article }) {
  const accent = articleAccent(article);
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none" }}>
      <article
        style={{ display: "flex", gap: 18, alignItems: "flex-start" }}
      >
        {/* Image thumbnail */}
        <div
          style={{
            width: 100,
            height: 80,
            borderRadius: 10,
            overflow: "hidden",
            flexShrink: 0,
            background: "linear-gradient(135deg, #1A1A2E 0%, #0D3D1E 100%)",
          }}
        >
          {article.heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.heroImage}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
            />
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: "0.54rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: accent,
              }}
            >
              {article.tags[0]}
            </span>
            <span style={{ fontSize: "0.54rem", color: "#E0E0E0" }}>·</span>
            <span style={{ fontSize: "0.54rem", color: "#B4B4B4" }}>
              {article.readingTime} MIN
            </span>
          </div>
          <h4
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(0.88rem, 1.3vw, 1.1rem)",
              fontWeight: 700,
              color: "#0A0A0A",
              lineHeight: 1.28,
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as React.CSSProperties}
          >
            {article.title}
          </h4>
          <p
            style={{
              fontSize: "0.72rem",
              color: "#6B6B6B",
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as React.CSSProperties}
          >
            {article.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}

/* ── Tertiary article (bottom row) ── */
function TertiaryArticle({ article }: { article: Article }) {
  const accent = articleAccent(article);
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none" }}>
      <article>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              width: 4,
              height: 16,
              borderRadius: 2,
              background: accent,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "0.56rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {article.tags[0]}
          </span>
          <span style={{ fontSize: "0.56rem", color: "#C4C4C4" }}>
            · {article.readingTime} min
          </span>
        </div>
        <h4
          style={{
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#0A0A0A",
            lineHeight: 1.35,
            marginBottom: 8,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {article.title}
        </h4>
        <p
          style={{
            fontSize: "0.72rem",
            color: "#9B9B9B",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {article.excerpt}
        </p>
      </article>
    </Link>
  );
}
