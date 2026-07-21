"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/types";
import {
  ECONOMY_ARTICLES,
  POLITICS_ARTICLES,
  EPIDEMICS_ARTICLES,
  MILITARY_ARTICLES,
} from "@/data/articles";

const GlobeCanvas = dynamic(() => import("@/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => null,
});

// Globe color keys  →  article pool + metadata
const HERO_PHASES = [
  {
    globeTheme: "pib" as const,
    label: "Économie mondiale",
    accent: "#10B981",
    href: "/map/economy",
    articles: ECONOMY_ARTICLES.slice(0, 4),
  },
  {
    globeTheme: "politique" as const,
    label: "Régimes politiques",
    accent: "#8B5CF6",
    href: "/map/politics",
    articles: POLITICS_ARTICLES.slice(0, 4),
  },
  {
    globeTheme: "demographie" as const,
    label: "Épidémies & Santé mondiale",
    accent: "#3B82F6",
    href: "/map/epidemics",
    articles: EPIDEMICS_ARTICLES.slice(0, 4),
  },
  {
    globeTheme: "chomage" as const,
    label: "Puissances militaires",
    accent: "#F59E0B",
    href: "/map/military",
    articles: MILITARY_ARTICLES.slice(0, 4),
  },
] as const;

type GlobeTheme = (typeof HERO_PHASES)[number]["globeTheme"];

const SCROLL_PHASES: { end: number; idx: number | null }[] = [
  { end: 0.14, idx: null },
  { end: 0.36, idx: 0 },
  { end: 0.58, idx: 1 },
  { end: 0.78, idx: 2 },
  { end: 1.00, idx: 3 },
];

function phaseForProgress(p: number): number | null {
  for (const ph of SCROLL_PHASES) {
    if (p < ph.end) return ph.idx;
  }
  return 3;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActiveIdx(phaseForProgress(v));
    });
  }, [scrollYProgress]);

  const activePhase = activeIdx !== null ? HERO_PHASES[activeIdx] : null;
  const globeTheme: GlobeTheme | null = activePhase?.globeTheme ?? null;

  return (
    <div ref={wrapperRef} className="hero-section-wrapper">
      <div
        className="hero-sticky"
        style={{ background: "#fff", paddingTop: "var(--navbar-height)" }}
      >
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            height: "100%",
            maxWidth: 1560,
            margin: "0 auto",
          }}
        >
          {/* ── LEFT: site identity + globe ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "clamp(20px, 3vh, 36px) 0 clamp(16px, 2vh, 28px) clamp(24px, 3.5vw, 56px)",
            }}
          >
            {/* Identity */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#39FF88",
                  marginBottom: 8,
                }}
              >
                The Essential Data
              </p>
              <h1
                style={{
                  fontSize: "clamp(1.55rem, 2.6vw, 2.6rem)",
                  fontWeight: 900,
                  color: "#0A0A0A",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.07,
                  marginBottom: 6,
                }}
              >
                Explorez le monde
                <br />
                <span
                  style={{
                    background: "linear-gradient(125deg, #39FF88 0%, #10B981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  depuis les étoiles
                </span>
              </h1>
              <p style={{ fontSize: "0.74rem", color: "#9B9B9B", lineHeight: 1.5 }}>
                Données géopolitiques de référence
              </p>
            </motion.div>

            {/* Globe */}
            <div style={{ flex: 1, position: "relative", minHeight: 0, marginTop: 12 }}>
              <GlobeCanvas theme={globeTheme} onCountryClick={() => {}} />
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 5, marginTop: 10, alignItems: "center" }}>
              {HERO_PHASES.map((ph, i) => (
                <div
                  key={ph.globeTheme}
                  style={{
                    width: activeIdx === i ? 22 : 5,
                    height: 5,
                    borderRadius: 100,
                    background: activeIdx === i ? ph.accent : "#E0E0E0",
                    transition: "all 0.35s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT: articles column ── */}
          <div
            className="hero-articles-col"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(20px, 3vh, 36px) clamp(24px, 3.5vw, 56px) clamp(16px, 2vh, 28px) clamp(16px, 2vw, 32px)",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              {activePhase ? (
                <motion.div
                  key={activePhase.globeTheme}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.42, ease: EASE }}
                  style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 2vh, 22px)", height: "100%" }}
                >
                  {/* Theme label */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: activePhase.accent,
                          boxShadow: `0 0 8px ${activePhase.accent}`,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: activePhase.accent,
                        }}
                      >
                        {activePhase.label}
                      </span>
                    </div>
                    <Link
                      href={activePhase.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.62rem",
                        fontWeight: 600,
                        color: "#9B9B9B",
                        textDecoration: "none",
                        letterSpacing: "0.04em",
                        transition: "color 0.15s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      Explorer la carte <ArrowRight size={10} />
                    </Link>
                  </div>

                  {/* Featured article */}
                  <FeaturedCard
                    article={activePhase.articles[0]}
                    accent={activePhase.accent}
                  />

                  {/* Secondary articles */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 12,
                    }}
                  >
                    {activePhase.articles.slice(1, 4).map((a) => (
                      <SmallCard key={a.slug} article={a} accent={activePhase.accent} />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                    gap: 16,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#C4C4C4",
                    }}
                  >
                    Faites défiler pour explorer
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    {[...ECONOMY_ARTICLES.slice(0, 1), ...POLITICS_ARTICLES.slice(0, 1), ...EPIDEMICS_ARTICLES.slice(0, 1), ...MILITARY_ARTICLES.slice(0, 1)].map((a) => (
                      <SmallCard key={a.slug} article={a} accent="#39FF88" />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Featured article card ── */
function FeaturedCard({ article, accent }: { article: Article; accent: string }) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none", display: "block" }}>
      {/* Image */}
      <div
        style={{
          width: "100%",
          height: "min(30vh, 220px)",
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 14,
          background: `linear-gradient(135deg, #0A0A0A 0%, #1a1a2e 100%)`,
          position: "relative",
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
        {/* Tag overlay */}
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: accent,
            color: "#000",
            fontSize: "0.56rem",
            fontWeight: 700,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 100,
          }}
        >
          {article.tags[0]}
        </span>
      </div>

      {/* Text */}
      <p
        style={{
          fontSize: "0.58rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#B4B4B4",
          marginBottom: 7,
        }}
      >
        {article.readingTime} min de lecture
      </p>
      <h2
        style={{
          fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)",
          fontWeight: 800,
          color: "#0A0A0A",
          letterSpacing: "-0.025em",
          lineHeight: 1.25,
          marginBottom: 8,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}
      >
        {article.title}
      </h2>
      <p
        style={{
          fontSize: "0.76rem",
          color: "#6B6B6B",
          lineHeight: 1.65,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}
      >
        {article.excerpt}
      </p>
    </Link>
  );
}

/* ── Small article card ── */
function SmallCard({ article, accent }: { article: Article; accent: string }) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          height: "100%",
          padding: "12px 13px 14px",
          borderRadius: 12,
          border: "1px solid #F0F0F0",
          background: "#FAFAFA",
          display: "flex",
          flexDirection: "column",
          gap: 7,
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}55`;
          (e.currentTarget as HTMLDivElement).style.background = "#fff";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#F0F0F0";
          (e.currentTarget as HTMLDivElement).style.background = "#FAFAFA";
        }}
      >
        <span
          style={{
            fontSize: "0.54rem",
            fontWeight: 700,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {article.tags[0]}
        </span>
        <p
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#0A0A0A",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          } as React.CSSProperties}
        >
          {article.title}
        </p>
        <span style={{ fontSize: "0.6rem", color: "#C4C4C4" }}>
          {article.readingTime} min
        </span>
      </div>
    </Link>
  );
}
