"use client";

import { motion } from "framer-motion";
import { TEST_ARTICLE } from "@/data/testArticle/testArticleData";
import { useFranceSeries } from "./pieces";

/* ═══════════════════════════════════════════════════════════════════════════
   HERO — the image, the title, the rule, the section

   The image is not a photograph. Nothing decorative is fetched for this page:
   the band across the top is the article's own subject, the French debt
   series, drawn at scale. It illustrates because it is the data, not because
   it resembles it.
   ═══════════════════════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1] as const;

export function TestArticleHero() {
  const series = useFranceSeries();

  const W = 1600;
  const H = 420;
  const values = series.map((p) => p.debt as number);
  const lo = Math.min(...values) - 14;
  const hi = Math.max(...values) + 10;

  const x = (i: number) => (i / Math.max(1, series.length - 1)) * W;
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;

  const line = series
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.debt as number).toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;

  return (
    <header>
      {/* ── The band ── */}
      <div
        className="ta-hero-band"
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(200px, 30vh, 340px)",
          overflow: "hidden",
          background: "linear-gradient(160deg, #06140E 0%, #0A2418 55%, #06140E 100%)",
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="ta-hero-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#39FF88" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#39FF88" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* A quiet grid, so the band reads as a measurement and not a texture. */}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={0}
              x2={W}
              y1={H * t}
              y2={H * t}
              stroke="#39FF88"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          ))}

          <path d={area} fill="url(#ta-hero-fill)" />
          <motion.path
            d={line}
            fill="none"
            stroke="#39FF88"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span
          style={{
            position: "absolute",
            left: "clamp(16px, 4vw, 44px)",
            bottom: 16,
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Dette publique française · {series[0]?.year}–{series[series.length - 1]?.year}
        </span>
      </div>

      {/* ── Title, rule, section ── */}
      <div className="ta-hero-head" style={{ maxWidth: 880, margin: "0 auto", padding: "clamp(26px, 6vw, 40px) clamp(18px, 5vw, 20px) 0", textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.62rem",
            fontWeight: 900,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#0D7A40",
            marginBottom: 16,
          }}
        >
          {TEST_ARTICLE.kicker}
        </p>

        <h1
          className="font-black ta-hero-title"
          style={{
            fontSize: "clamp(1.9rem, 4.4vw, 3.4rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.04em",
            color: "var(--ink)",
          }}
        >
          {TEST_ARTICLE.title}
        </h1>

        <p
          style={{
            fontSize: "clamp(0.95rem, 1.5vw, 1.12rem)",
            lineHeight: 1.6,
            color: "var(--ink-3)",
            maxWidth: 620,
            margin: "16px auto 0",
          }}
        >
          {TEST_ARTICLE.standfirst}
        </p>

        {/* The rule, and the section hanging under it. */}
        <div style={{ marginTop: "clamp(20px, 5vw, 30px)" }}>
          <div style={{ height: 1, background: "var(--border)", width: "100%" }} />
          <p
            style={{
              display: "inline-block",
              marginTop: -1,
              paddingTop: 13,
              borderTop: "2px solid #39FF88",
              fontSize: "0.66rem",
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            {TEST_ARTICLE.section}
          </p>
        </div>
      </div>
    </header>
  );
}
