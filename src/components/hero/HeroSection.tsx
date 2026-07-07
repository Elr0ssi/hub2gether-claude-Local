"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowRight, Globe2, TrendingUp, Shield, Map } from "lucide-react";

const GlobeCanvas = dynamic(() => import("@/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1.5px solid rgba(57,255,136,0.4)", animation: "spin 2s linear infinite" }} />
    </div>
  ),
});

const MiniMap = dynamic(() => import("@/components/hero/MiniMap"), { ssr: false });

const THEMES = [
  {
    id: "economy",
    label: "Économie mondiale",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    stat: "$105T PIB mondial",
    sub: "Projections FMI 2025",
    href: "/map/economy",
  },
  {
    id: "politics",
    label: "Régimes politiques",
    accent: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.08)",
    stat: "44,8% en démocratie",
    sub: "V-Dem 2024",
    href: "/map/politics",
  },
  {
    id: "epidemics",
    label: "Épidémies & santé",
    accent: "#EF4444",
    accentBg: "rgba(239,68,68,0.08)",
    stat: "7,04M décès COVID",
    sub: "OMS — cumulatif",
    href: "/map/epidemics",
  },
  {
    id: "military",
    label: "Puissances militaires",
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    stat: "2 443 Mds€ défense",
    sub: "SIPRI 2024",
    href: "/map/military",
  },
  {
    id: "empires",
    label: "Empires & histoire",
    accent: "#06B6D4",
    accentBg: "rgba(6,182,212,0.08)",
    stat: "500 ans d'évolution",
    sub: "1453 — 2025",
    href: "/map/empires",
  },
];

const BOTTOM_STATS = [
  { value: "195+", label: "Pays analysés", Icon: Globe2 },
  { value: "5", label: "Thèmes géopolitiques", Icon: TrendingUp },
  { value: "30+", label: "Puissances militaires", Icon: Shield },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const CARD_COUNT = THEMES.length;

interface StackCardProps {
  theme: typeof THEMES[number];
  index: number;
  scrollProgress: MotionValue<number>;
  reduced: boolean | null;
}

function StackCard({ theme, index, scrollProgress, reduced }: StackCardProps) {
  const offset = useTransform(scrollProgress, [0, 1], [0, CARD_COUNT]);

  const cardActive = useTransform(offset, (v) => {
    const dist = v - index;
    return dist;
  });

  const y = useTransform(cardActive, [-1, 0, 1], ["-105%", "0%", "8%"]);
  const scale = useTransform(cardActive, [-1, 0, 0.5, 1], [1, 1, 0.96, 0.92]);
  const opacity = useTransform(cardActive, [-1.2, -1, 0, 0.8, 1.2], [0, 1, 1, 0.7, 0]);
  const zIndex = useTransform(cardActive, (v) => Math.round(100 - Math.abs(v) * 10));

  if (reduced) {
    const isActive = index === 0;
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: isActive ? "flex" : "none",
          flexDirection: "column",
          borderRadius: 20,
          overflow: "hidden",
          background: "#fff",
          border: "1.5px solid #E8E8E8",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent theme={theme} />
      </div>
    );
  }

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        y,
        scale,
        opacity,
        zIndex,
        borderRadius: 20,
        overflow: "hidden",
        background: "#fff",
        border: "1.5px solid #E8E8E8",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        willChange: "transform",
        transformOrigin: "bottom center",
      }}
    >
      <CardContent theme={theme} />
    </motion.div>
  );
}

function CardContent({ theme }: { theme: typeof THEMES[number] }) {
  return (
    <>
      {/* Colored header strip */}
      <div
        style={{
          height: 5,
          background: theme.accent,
          boxShadow: `0 0 16px ${theme.accent}66`,
        }}
      />

      {/* Map area */}
      <div style={{ flex: 1, position: "relative", minHeight: 0, height: "calc(100% - 5px - 88px)", overflow: "hidden" }}>
        <MiniMap themeId={theme.id} />

        {/* Theme label overlay */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            borderRadius: 100,
            background: theme.accentBg,
            border: `1px solid ${theme.accent}44`,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: theme.accent,
              boxShadow: `0 0 8px ${theme.accent}`,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: theme.accent, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            {theme.label}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          height: 88,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #F0F0F0",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {theme.stat}
          </div>
          <div style={{ fontSize: "0.7rem", color: "#9B9B9B", marginTop: 3 }}>
            {theme.sub}
          </div>
        </div>
        <Link
          href={theme.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 10,
            background: theme.accentBg,
            border: `1px solid ${theme.accent}33`,
            color: theme.accent,
            fontSize: "0.75rem",
            fontWeight: 700,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Explorer <ArrowRight size={12} />
        </Link>
      </div>
    </>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map 0→1 scroll to 0→(CARD_COUNT-1) card index
  const cardProgress = useTransform(scrollYProgress, [0, 0.95], [0, CARD_COUNT - 1]);

  // Progress dots: 0 to CARD_COUNT-1
  const dotIndex = useTransform(cardProgress, (v) => Math.round(v));

  return (
    <section
      ref={sectionRef}
      className="hero-section-wrapper"
    >
      {/* Sticky viewport — fills 100vh and sticks */}
      <div className="hero-sticky">
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#FAFAFA",
            zIndex: 0,
          }}
        />

        {/* Subtle grid pattern */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(57,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,136,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            zIndex: 0,
          }}
        />

        {/* Main 2-col grid */}
        <div
          className="hero-grid"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            height: "100%",
            padding: "0 32px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingTop: 80 }}>
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ marginBottom: 24 }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 13px",
                  borderRadius: 100,
                  background: "#0A0A0A",
                  color: "#39FF88",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#39FF88", boxShadow: "0 0 8px rgba(57,255,136,0.9)", flexShrink: 0 }} />
                Data journalism géopolitique
              </span>
            </motion.div>

            {/* Left green bar + H1 */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
              style={{ display: "flex", gap: 14, marginBottom: 20 }}
            >
              <div
                style={{
                  width: 4,
                  borderRadius: 3,
                  background: "linear-gradient(180deg, #39FF88 0%, #10B981 100%)",
                  boxShadow: "0 0 16px rgba(57,255,136,0.5)",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              />
              <h1
                style={{
                  fontSize: "clamp(2.6rem, 5vw, 5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "#0A0A0A",
                }}
              >
                L&apos;histoire du monde,{" "}
                <span
                  style={{
                    color: "#39FF88",
                    WebkitTextStroke: "0px",
                    textShadow: "none",
                    background: "linear-gradient(135deg, #39FF88 0%, #10B981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  cartographiée
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
              style={{
                fontSize: "1rem",
                color: "#6B6B6B",
                lineHeight: 1.7,
                maxWidth: 440,
                marginBottom: 28,
              }}
            >
              Empires, économies, épidémies — visualisez les grandes forces qui ont façonné le monde à travers le temps.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
              style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}
            >
              <Link href="/map/economy" className="btn-primary">
                Explorer la carte <ArrowRight size={14} />
              </Link>
              <Link
                href="/map/politics"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "10px 18px",
                  borderRadius: 12,
                  background: "#fff",
                  border: "1.5px solid #E8E8E8",
                  color: "#3A3A3A",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <Map size={14} style={{ color: "#6B6B6B" }} />
                Régimes politiques
              </Link>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4, ease: EASE }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 36,
              }}
            >
              {BOTTOM_STATS.map(({ value, label, Icon }) => (
                <div
                  key={label}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "#fff",
                    border: "1.5px solid #E8E8E8",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 7,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(57,255,136,0.1)",
                        border: "1px solid rgba(57,255,136,0.22)",
                      }}
                    >
                      <Icon size={12} style={{ color: "#10B981" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#9B9B9B", marginTop: 2, lineHeight: 1.3 }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Small globe — dark container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle, #0c0c1a 0%, #080810 100%)",
                border: "1.5px solid rgba(57,255,136,0.25)",
                boxShadow: "0 0 30px rgba(57,255,136,0.12), inset 0 0 30px rgba(57,255,136,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <GlobeCanvas />
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Card Stack ── */}
          <div
            className="hero-globe-col"
            style={{ position: "relative", height: "72vh" }}
          >
            {/* Card stack container */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              {THEMES.map((theme, index) => (
                <StackCard
                  key={theme.id}
                  theme={theme}
                  index={index}
                  scrollProgress={cardProgress}
                  reduced={reduced}
                />
              ))}
            </motion.div>

            {/* Progress dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                position: "absolute",
                bottom: -36,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              {THEMES.map((theme, i) => (
                <ProgressDot key={theme.id} index={i} dotIndex={dotIndex} accent={theme.accent} />
              ))}
            </motion.div>

            {/* Scroll hint */}
            {!reduced && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{
                  position: "absolute",
                  bottom: -64,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: "0.65rem", color: "#C4C4C4", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Scrollez pour explorer
                </span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 1, height: 20, background: "linear-gradient(to bottom, #C4C4C4, transparent)" }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProgressDotProps {
  index: number;
  dotIndex: MotionValue<number>;
  accent: string;
}

function ProgressDot({ index, dotIndex, accent }: ProgressDotProps) {
  const scale = useTransform(dotIndex, (v) => (Math.round(v) === index ? 1.4 : 1));
  const opacity = useTransform(dotIndex, (v) => (Math.round(v) === index ? 1 : 0.3));
  const bg = useTransform(dotIndex, (v) => (Math.round(v) === index ? accent : "#D1D5DB"));

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
