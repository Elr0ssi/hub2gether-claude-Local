"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COUNTRIES, THEME_DATA_LABELS } from "@/data/countryData";

const GlobeCanvas = dynamic(() => import("@/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => null,
});

const THEMES = [
  {
    id: "economy",
    label: "Économie mondiale",
    accent: "#10B981",
    dim: "rgba(16,185,129,0.07)",
    glow: "rgba(16,185,129,0.12)",
    stat: "$105T de PIB mondial",
    source: "FMI · 195 pays · 2025",
    href: "/map/economy",
    textDark: false,
  },
  {
    id: "politics",
    label: "Régimes politiques",
    accent: "#8B5CF6",
    dim: "rgba(139,92,246,0.07)",
    glow: "rgba(139,92,246,0.14)",
    stat: "44,8% en démocratie",
    source: "V-Dem · 18e recul consécutif",
    href: "/map/politics",
    textDark: false,
  },
  {
    id: "epidemics",
    label: "Épidémies & Santé",
    accent: "#EF4444",
    dim: "rgba(239,68,68,0.07)",
    glow: "rgba(239,68,68,0.14)",
    stat: "7,04M décès COVID",
    source: "OMS · données 2020–2024",
    href: "/map/epidemics",
    textDark: false,
  },
  {
    id: "military",
    label: "Puissances militaires",
    accent: "#F59E0B",
    dim: "rgba(245,158,11,0.07)",
    glow: "rgba(245,158,11,0.14)",
    stat: "2 443 Mds€ de défense",
    source: "SIPRI · Record absolu 2024",
    href: "/map/military",
    textDark: true,
  },
  {
    id: "empires",
    label: "Empires & Histoire",
    accent: "#39FF88",
    dim: "rgba(57,255,136,0.07)",
    glow: "rgba(57,255,136,0.14)",
    stat: "500 ans d'évolution",
    source: "1453 — 2025 · Atlas mondial",
    href: "/map/empires",
    textDark: true,
  },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

// Scroll phase breakpoints (fraction 0→1 through the 500vh wrapper)
const SCROLL_PHASES: { end: number; theme: ThemeId | null }[] = [
  { end: 0.16, theme: null },
  { end: 0.33, theme: "economy" },
  { end: 0.51, theme: "politics" },
  { end: 0.69, theme: "epidemics" },
  { end: 0.85, theme: "military" },
  { end: 1.00, theme: "empires" },
];

function themeForProgress(p: number): ThemeId | null {
  for (const ph of SCROLL_PHASES) {
    if (p < ph.end) return ph.theme;
  }
  return "empires";
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const [activeThemeId, setActiveThemeId] = useState<ThemeId | null>(null);
  const [tooltip, setTooltip] = useState<{
    name: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActiveThemeId(themeForProgress(v));
    });
  }, [scrollYProgress]);

  const activeTheme = THEMES.find((t) => t.id === activeThemeId) ?? null;

  const handleCountryClick = useCallback(
    (name: string | null, x: number, y: number) => {
      if (!name || !activeThemeId) {
        setTooltip(null);
        return;
      }
      const entry = COUNTRIES[name];
      const label = THEME_DATA_LABELS[activeThemeId];
      if (!entry || !label) {
        setTooltip(null);
        return;
      }
      const text = label.tooltip(entry);
      if (!text) {
        setTooltip(null);
        return;
      }
      setTooltip({ name, text, x, y });
    },
    [activeThemeId]
  );

  return (
    <>
      {/* ── Scroll wrapper (500vh desktop, 100vh mobile) ── */}
      <div ref={wrapperRef} className="hero-section-wrapper">
        <div
          className="hero-sticky"
          style={{ background: "#F8FAFB", paddingTop: "var(--navbar-height)" }}
        >
          {/* Two-column grid */}
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "1fr",
              height: "100%",
              maxWidth: 1440,
              margin: "0 auto",
              padding: "0 40px",
            }}
          >
            {/* ── Left column: title + scroll-driven theme card ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingBottom: 40,
                zIndex: 10,
                position: "relative",
              }}
            >
              {/* Eyebrow + headline */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <p
                  style={{
                    fontSize: "0.63rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#39FF88",
                    marginBottom: 18,
                  }}
                >
                  The Essential Data
                </p>

                <h1
                  style={{
                    fontSize: "clamp(2rem, 3.8vw, 3.6rem)",
                    fontWeight: 900,
                    color: "#0A0A0A",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.07,
                    marginBottom: 18,
                  }}
                >
                  Explorez le monde<br />
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

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#6B6B6B",
                    lineHeight: 1.7,
                    maxWidth: 340,
                  }}
                >
                  Données géopolitiques de référence —<br />
                  économie, démocratie, santé, défense.
                </p>
              </motion.div>

              {/* Animated theme info / scroll hint */}
              <AnimatePresence mode="wait">
                {activeTheme ? (
                  <motion.div
                    key={activeTheme.id}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.38, ease: EASE }}
                    style={{
                      marginTop: 34,
                      padding: "22px 24px 20px",
                      borderRadius: 18,
                      background: "#fff",
                      border: `1.5px solid ${activeTheme.accent}38`,
                      boxShadow: `0 4px 24px ${activeTheme.glow}`,
                      maxWidth: 360,
                    }}
                  >
                    {/* Label row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: activeTheme.accent,
                          display: "inline-block",
                          boxShadow: `0 0 8px ${activeTheme.accent}`,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.11em",
                          textTransform: "uppercase",
                          color: activeTheme.accent,
                        }}
                      >
                        {activeTheme.label}
                      </span>
                    </div>

                    {/* Stat */}
                    <div
                      style={{
                        fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)",
                        fontWeight: 900,
                        color: "#0A0A0A",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        marginBottom: 5,
                      }}
                    >
                      {activeTheme.stat}
                    </div>

                    {/* Source */}
                    <p
                      style={{
                        fontSize: "0.68rem",
                        color: "#B4B4B4",
                        marginBottom: 18,
                      }}
                    >
                      {activeTheme.source}
                    </p>

                    {/* CTA */}
                    <Link
                      href={activeTheme.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 18px",
                        borderRadius: 10,
                        background: activeTheme.accent,
                        color: activeTheme.textDark ? "#000" : "#fff",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        letterSpacing: "0.01em",
                        transition: "opacity 0.15s",
                      }}
                    >
                      Explorer <ArrowRight size={12} />
                    </Link>

                    {/* Hint: click on globe */}
                    <p
                      style={{
                        marginTop: 14,
                        fontSize: "0.63rem",
                        color: "#C4C4C4",
                      }}
                    >
                      Cliquez sur un pays pour ses données
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    style={{
                      marginTop: 46,
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                    }}
                  >
                    <div
                      style={{
                        width: 1,
                        height: 46,
                        background:
                          "linear-gradient(to bottom, rgba(10,10,10,0.5), transparent)",
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.66rem",
                        color: "#9B9B9B",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Faites défiler pour explorer
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Theme progress dots */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 28,
                  alignItems: "center",
                }}
              >
                {THEMES.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      width: activeThemeId === t.id ? 20 : 5,
                      height: 5,
                      borderRadius: 100,
                      background:
                        activeThemeId === t.id ? t.accent : "#E0E0E0",
                      transition: "all 0.35s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Right column: globe only ── */}
            <div
              className="hero-globe-col"
              style={{ position: "relative", overflow: "hidden", height: "100%" }}
            >
              <GlobeCanvas
                theme={activeThemeId}
                onCountryClick={handleCountryClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Country tooltip overlay ── */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            key="country-tip"
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 6 }}
            transition={{ duration: 0.18 }}
            onClick={() => setTooltip(null)}
            style={{
              position: "fixed",
              left: tooltip.x + 14,
              top: tooltip.y - 90,
              zIndex: 1000,
              background: "#fff",
              border: "1px solid #E8E8E8",
              borderRadius: 14,
              padding: "14px 18px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
              maxWidth: 230,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#0A0A0A",
                marginBottom: 5,
              }}
            >
              {tooltip.name}
            </div>
            <div
              style={{
                fontSize: "0.71rem",
                color: "#6B6B6B",
                lineHeight: 1.55,
              }}
            >
              {tooltip.text}
            </div>
            <div
              style={{
                fontSize: "0.58rem",
                color: "#C4C4C4",
                marginTop: 8,
              }}
            >
              Cliquez pour fermer
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
