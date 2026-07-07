"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const GlobeCanvas = dynamic(() => import("@/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => null,
});

const MiniMap = dynamic(() => import("@/components/hero/MiniMap"), { ssr: false });

const THEMES = [
  {
    id: "economy",
    label: "Économie mondiale",
    accent: "#10B981",
    dim: "rgba(16,185,129,0.12)",
    stat: "$105T",
    statLabel: "PIB mondial 2025",
    source: "Projections FMI",
    href: "/map/economy",
  },
  {
    id: "politics",
    label: "Régimes politiques",
    accent: "#8B5CF6",
    dim: "rgba(139,92,246,0.12)",
    stat: "44,8%",
    statLabel: "En démocratie",
    source: "V-Dem 2024",
    href: "/map/politics",
  },
  {
    id: "epidemics",
    label: "Épidémies & Santé",
    accent: "#EF4444",
    dim: "rgba(239,68,68,0.12)",
    stat: "7,04M",
    statLabel: "Décès COVID",
    source: "OMS 2024",
    href: "/map/epidemics",
  },
  {
    id: "military",
    label: "Puissances militaires",
    accent: "#F59E0B",
    dim: "rgba(245,158,11,0.12)",
    stat: "2 443 Mds€",
    statLabel: "Dépenses défense",
    source: "SIPRI 2024",
    href: "/map/military",
  },
  {
    id: "empires",
    label: "Empires & Histoire",
    accent: "#06B6D4",
    dim: "rgba(6,182,212,0.12)",
    stat: "500 ans",
    statLabel: "D'évolution mondiale",
    source: "1453 — 2025",
    href: "/map/empires",
  },
] as const;

type Theme = (typeof THEMES)[number];
const CARD_COUNT = THEMES.length;

// Phase boundaries (fraction of total scroll 0→1)
const PH_EXIT_START = 0.14;  // globe starts fading
const PH_EXIT_END   = 0.30;  // globe gone, cards fully visible
const PH_CARDS_END  = 0.94;  // last card reached

// ── Card in the stack ────────────────────────────────────────────────────────

interface StackCardProps {
  theme: Theme;
  index: number;
  cardProgress: MotionValue<number>;
}

function StackCard({ theme, index, cardProgress }: StackCardProps) {
  const dist = useTransform(cardProgress, (v) => v - index);

  // y: future cards slightly below, active at 0, past cards exit upward
  const y = useTransform(dist, [-2, -1, 0, 0.55, 1], ["10%", "4%", "0%", "-4%", "-120%"]);
  const scale = useTransform(dist, [-2, -1, 0, 1], [0.88, 0.94, 1, 1]);
  const opacity = useTransform(dist, [-2, -1.3, 0, 0.85, 1.15], [0, 0.7, 1, 1, 0]);
  const zIndex = useTransform(dist, (v) => {
    if (v > 1.0) return 4;
    return Math.max(4, Math.round(50 + v * 6));
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        y,
        scale,
        opacity,
        zIndex,
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 28px 72px rgba(0,0,0,0.6), 0 4px 18px rgba(0,0,0,0.35)",
        willChange: "transform",
        transformOrigin: "bottom center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Accent strip */}
      <div
        style={{
          height: 4,
          background: theme.accent,
          flexShrink: 0,
          boxShadow: `0 0 28px ${theme.accent}aa`,
        }}
      />

      {/* Map area */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <MiniMap themeId={theme.id} />

        {/* Theme badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 100,
            background: theme.dim,
            border: `1px solid ${theme.accent}44`,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: theme.accent,
              boxShadow: `0 0 6px ${theme.accent}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: theme.accent,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            {theme.label}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          height: 76,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #F0F0F0",
          flexShrink: 0,
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "#0A0A0A",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {theme.stat}{" "}
            <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "#6B6B6B" }}>
              {theme.statLabel}
            </span>
          </div>
          <div style={{ fontSize: "0.62rem", color: "#9B9B9B", marginTop: 2 }}>
            {theme.source}
          </div>
        </div>
        <Link
          href={theme.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 13px",
            borderRadius: 9,
            background: theme.dim,
            border: `1px solid ${theme.accent}33`,
            color: theme.accent,
            fontSize: "0.7rem",
            fontWeight: 700,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Explorer <ArrowRight size={10} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Left panel: active card info (changes with scroll) ───────────────────────

interface CardInfoItemProps {
  theme: Theme;
  index: number;
  cardProgress: MotionValue<number>;
}

function CardInfoItem({ theme, index, cardProgress }: CardInfoItemProps) {
  const distance = useTransform(cardProgress, (v) => Math.abs(v - index));
  const opacity = useTransform(distance, [0, 0.3, 0.7], [1, 1, 0]);
  const y = useTransform(distance, [0, 0.8], ["0px", "14px"]);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        y,
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: theme.accent,
            boxShadow: `0 0 12px ${theme.accent}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "0.67rem",
            fontWeight: 700,
            color: theme.accent,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
          }}
        >
          {theme.label}
        </span>
      </div>

      <div
        style={{
          fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
          fontWeight: 900,
          color: "#fff",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          marginBottom: 10,
        }}
      >
        {theme.stat}
      </div>

      <div
        style={{
          fontSize: "0.88rem",
          color: "rgba(255,255,255,0.48)",
          marginBottom: 26,
          lineHeight: 1.5,
        }}
      >
        {theme.statLabel}
        <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
        {theme.source}
      </div>

      <Link
        href={theme.href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 18px",
          borderRadius: 10,
          background: theme.dim,
          border: `1px solid ${theme.accent}40`,
          color: theme.accent,
          fontSize: "0.78rem",
          fontWeight: 700,
          textDecoration: "none",
          pointerEvents: "auto",
        }}
      >
        Explorer la carte <ArrowRight size={12} />
      </Link>
    </motion.div>
  );
}

// ── Progress dot ─────────────────────────────────────────────────────────────

interface ProgressDotProps {
  index: number;
  cardProgress: MotionValue<number>;
  accent: string;
}

function ProgressDot({ index, cardProgress, accent }: ProgressDotProps) {
  const scale = useTransform(cardProgress, (v) => (Math.round(v) === index ? 1.6 : 1));
  const opacity = useTransform(cardProgress, (v) => (Math.round(v) === index ? 1 : 0.28));
  const bg = useTransform(cardProgress, (v) =>
    Math.round(v) === index ? accent : "rgba(255,255,255,0.22)"
  );

  return (
    <motion.div
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        scale,
        opacity,
        backgroundColor: bg,
      }}
    />
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────

export function HeroSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const globeOpacity = useTransform(scrollYProgress, [PH_EXIT_START, PH_EXIT_END], [1, 0]);
  const sloganOpacity = useTransform(scrollYProgress, [PH_EXIT_START, PH_EXIT_END], [1, 0]);
  const cardsOpacity = useTransform(
    scrollYProgress,
    [PH_EXIT_START + 0.05, PH_EXIT_END],
    [0, 1]
  );
  const cardInfoOpacity = useTransform(
    scrollYProgress,
    [PH_EXIT_START + 0.05, PH_EXIT_END],
    [0, 1]
  );
  const cardProgress = useTransform(
    scrollYProgress,
    [PH_EXIT_END, PH_CARDS_END],
    [0, CARD_COUNT - 1]
  );

  const EASE = [0.16, 1, 0.3, 1] as const;

  return (
    <section ref={sectionRef} className="hero-section-wrapper">
      <div
        className="hero-sticky"
        style={{
          background: "linear-gradient(160deg, #060608 0%, #08080f 55%, #060608 100%)",
          overflow: "hidden",
        }}
      >
        {/* Ambient glows */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -260,
            right: -120,
            width: 720,
            height: 720,
            background:
              "radial-gradient(circle, rgba(57,255,136,0.07) 0%, transparent 58%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -80,
            left: -120,
            width: 540,
            height: 540,
            background:
              "radial-gradient(circle, rgba(80,100,240,0.06) 0%, transparent 58%)",
            pointerEvents: "none",
          }}
        />

        {/* Main 2-col layout */}
        <div
          className="hero-grid"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            height: "100%",
            padding: "0 40px",
            display: "grid",
            gridTemplateColumns: "1fr",
            alignItems: "center",
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div
            style={{
              position: "relative",
              paddingTop: 70,
              paddingBottom: 60,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Brand label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ marginBottom: 22 }}
            >
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: "#39FF88",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                The Essential Data
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
              style={{
                fontSize: "clamp(3rem, 5.5vw, 6.2rem)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.04em",
                lineHeight: 1.04,
                marginBottom: 32,
              }}
            >
              Explore the world
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #39FF88 0%, #10B981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                from the sky.
              </span>
            </motion.h1>

            {/* Globe phase: CTA + scroll hint */}
            <motion.div style={{ opacity: sloganOpacity, flexShrink: 0 }}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
              >
                <Link
                  href="/map/economy"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "12px 24px",
                    borderRadius: 13,
                    background: "#39FF88",
                    color: "#000",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow:
                      "0 0 28px rgba(57,255,136,0.35), 0 2px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Explorer <ArrowRight size={15} />
                </Link>
              </motion.div>

              {!reduced && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  style={{
                    marginTop: 44,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDown
                      size={14}
                      style={{ color: "rgba(255,255,255,0.18)" }}
                    />
                  </motion.div>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.18)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Scroll pour explorer
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Cards phase: active card info */}
            <motion.div
              style={{
                opacity: cardInfoOpacity,
                position: "absolute",
                top: "clamp(180px, 26vh, 260px)",
                left: 0,
                right: 0,
              }}
            >
              <div style={{ position: "relative", height: 220 }}>
                {THEMES.map((theme, i) => (
                  <CardInfoItem
                    key={theme.id}
                    theme={theme}
                    index={i}
                    cardProgress={cardProgress}
                  />
                ))}
              </div>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: 7, marginTop: 18 }}>
                {THEMES.map((theme, i) => (
                  <ProgressDot
                    key={theme.id}
                    index={i}
                    cardProgress={cardProgress}
                    accent={theme.accent}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div
            className="hero-globe-col"
            style={{ position: "relative", height: "100%" }}
          >
            {/* Globe */}
            {!reduced && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: globeOpacity,
                }}
              >
                <GlobeCanvas />
              </motion.div>
            )}

            {/* Cards stack */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                opacity: cardsOpacity,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 8px",
              }}
            >
              {/* Landscape container: wider than tall */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "min(380px, 50vh)",
                }}
              >
                {THEMES.map((theme, i) => (
                  <StackCard
                    key={theme.id}
                    theme={theme}
                    index={i}
                    cardProgress={cardProgress}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
