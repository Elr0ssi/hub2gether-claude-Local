"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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

const HERO_PHASES = [
  {
    globeTheme: "pib" as const,
    label: "Économie mondiale",
    sectionLabel: "§ 01 · Économie",
    accent: "#10B981",
    href: "/map/economy",
    articles: ECONOMY_ARTICLES.slice(0, 4),
  },
  {
    globeTheme: "politique" as const,
    label: "Régimes politiques",
    sectionLabel: "§ 02 · Politique",
    accent: "#8B5CF6",
    href: "/map/politics",
    articles: POLITICS_ARTICLES.slice(0, 4),
  },
  {
    globeTheme: "demographie" as const,
    label: "Épidémies & Santé",
    sectionLabel: "§ 03 · Santé",
    accent: "#3B82F6",
    href: "/map/epidemics",
    articles: EPIDEMICS_ARTICLES.slice(0, 4),
  },
  {
    globeTheme: "chomage" as const,
    label: "Puissances militaires",
    sectionLabel: "§ 04 · Défense",
    accent: "#F59E0B",
    href: "/map/military",
    articles: MILITARY_ARTICLES.slice(0, 4),
  },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // heroProgress: 0 → 3 (one unit per phase)
  const heroProgress = useTransform(scrollYProgress, [0, 1], [0, 3]);

  // Globe grow animation (0→1 as heroProgress 0→0.47)
  const growT = useTransform(heroProgress, [0, 0.47], [0, 1], { clamp: true });
  const globeScale = useTransform(growT, [0, 1], [1, 1.42]);
  const globeX = useTransform(growT, [0, 1], [0, -260]);

  // Layer cross-fade
  const introOpacity = useTransform(heroProgress, [0, 0.35], [1, 0], { clamp: true });
  const scrolledOpacity = useTransform(heroProgress, [0.12, 0.47], [0, 1], { clamp: true });

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActiveIdx(Math.min(3, Math.floor(v * 4)));
    });
  }, [scrollYProgress]);

  const activePhase = HERO_PHASES[activeIdx];

  return (
    <div ref={wrapperRef} className="hero-section-wrapper">
      <div className="hero-sticky" style={{ background: "#fff" }}>

        {/* Ambient glow — changes color per phase */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          {HERO_PHASES.map((ph, i) => (
            <div
              key={ph.globeTheme}
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 60% 70% at 42% 58%, ${ph.accent}1C 0%, transparent 68%)`,
                opacity: activeIdx === i ? 1 : 0,
                transition: "opacity 0.9s ease",
              }}
            />
          ))}
        </div>

        {/* Globe — centered then translates left + scales */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(50% + var(--navbar-height) / 2)",
            transform: "translate(-50%, -50%)",
            width: "min(82vh, 82vw)",
            height: "min(82vh, 82vw)",
            zIndex: 1,
          }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              x: globeX,
              scale: globeScale,
            }}
          >
            <GlobeCanvas theme={activePhase.globeTheme} onCountryClick={() => {}} />
          </motion.div>
        </div>

        {/* INTRO layer — fades out as user scrolls */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: "var(--navbar-height)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `calc(var(--navbar-height) + 7vh) clamp(28px, 5.5vw, 76px) 7vh`,
            zIndex: 2,
            pointerEvents: "none",
            opacity: introOpacity,
          }}
        >
          {/* Left: headline */}
          <div style={{ maxWidth: "clamp(200px, 26vw, 370px)" }}>
            <p
              style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#39FF88",
                marginBottom: 10,
              }}
            >
              The Essential Data
            </p>
            <h1
              style={{
                fontSize: "clamp(1.55rem, 2.7vw, 3rem)",
                fontWeight: 900,
                color: "#0A0A0A",
                letterSpacing: "-0.04em",
                lineHeight: 1.07,
              }}
            >
              Explorez le monde
              <br />
              <em
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                  background: "linear-gradient(125deg, #39FF88 0%, #10B981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                depuis les étoiles
              </em>
            </h1>
          </div>

          {/* Right: scroll cue */}
          <div
            style={{
              maxWidth: "clamp(140px, 18vw, 260px)",
              textAlign: "right",
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                color: "#C4C4C4",
                lineHeight: 1.55,
                marginBottom: 8,
              }}
            >
              Faites défiler pour explorer
            </p>
            <p style={{ fontSize: "0.68rem", color: "#B0B0B0", lineHeight: 1.5 }}>
              Données géopolitiques
              <br />
              de référence
            </p>
          </div>
        </motion.div>

        {/* SCROLLED layer — appears as user scrolls */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: "var(--navbar-height)",
            zIndex: 2,
            opacity: scrolledOpacity,
          }}
        >
          <div
            style={{
              height: "calc(100% - var(--navbar-height))",
              padding: `clamp(14px, 4vh, 36px) clamp(28px, 5.5vw, 76px)`,
              display: "flex",
              alignItems: "center",
              gap: "clamp(20px, 3vw, 52px)",
            }}
          >
            {/* Left: phase title (sits over the globe area) */}
            <div style={{ flex: "0 0 auto", width: "clamp(200px, 38vw, 500px)" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.42, ease: EASE }}
                >
                  <p
                    style={{
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: activePhase.accent,
                      marginBottom: 14,
                    }}
                  >
                    {activePhase.sectionLabel}
                  </p>
                  <h2
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 3.4rem)",
                      fontWeight: 900,
                      color: "#0A0A0A",
                      letterSpacing: "-0.04em",
                      lineHeight: 1.06,
                    }}
                  >
                    {activePhase.label}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: article panel */}
            <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.42, ease: EASE }}
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {/* Badge row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
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
                        flexShrink: 0,
                      }}
                    >
                      Explorer la carte <ArrowRight size={10} />
                    </Link>
                  </div>

                  {/* Featured dark card */}
                  <FeaturedCard article={activePhase.articles[0]} accent={activePhase.accent} />

                  {/* Chip cards grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {activePhase.articles.slice(1, 4).map((a) => (
                      <SmallCard key={a.slug} article={a} accent={activePhase.accent} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Progress dots — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: "clamp(28px, 5.5vw, 76px)",
            zIndex: 3,
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          {HERO_PHASES.map((ph, i) => (
            <div
              key={ph.globeTheme}
              style={{
                width: activeIdx === i ? 28 : 18,
                height: 5,
                borderRadius: 100,
                background: activeIdx === i ? ph.accent : "#E0E0E0",
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Featured dark card ── */
function FeaturedCard({ article, accent }: { article: Article; accent: string }) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          height: "clamp(140px, 18vh, 200px)",
          borderRadius: 14,
          overflow: "hidden",
          background: "#0d0e10",
          position: "relative",
          transition: "box-shadow 0.22s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${accent}38`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {article.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.heroImage}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
          />
        )}
        {/* Tag */}
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
        {/* Title overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "32px 16px 14px",
            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(0.82rem, 1.2vw, 1rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as React.CSSProperties}
          >
            {article.title}
          </p>
        </div>
      </div>
      <p
        style={{
          fontSize: "0.72rem",
          color: "#6B6B6B",
          lineHeight: 1.6,
          marginTop: 8,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}
      >
        {article.excerpt}
      </p>
    </Link>
  );
}

/* ── Small chip card ── */
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
          transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = `${accent}55`;
          el.style.background = "#fff";
          el.style.boxShadow = `0 4px 18px ${accent}22`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "#F0F0F0";
          el.style.background = "#FAFAFA";
          el.style.boxShadow = "none";
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
        <span style={{ fontSize: "0.6rem", color: "#C4C4C4" }}>{article.readingTime} min</span>
      </div>
    </Link>
  );
}
