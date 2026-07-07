"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe2, TrendingUp, Shield } from "lucide-react";
import { StatsCarousel } from "./StatsCarousel";

const GlobeCanvas = dynamic(() => import("@/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle, rgba(57,255,136,0.06) 0%, transparent 65%)",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "1px solid rgba(57,255,136,0.2)",
          animation: "spin 2s linear infinite",
        }}
      />
    </div>
  ),
});

const GLASS_STATS = [
  {
    value: "$105T",
    label: "PIB mondial 2025",
    sub: "Projections FMI",
    color: "#10B981",
  },
  {
    value: "195+",
    label: "Pays couverts",
    sub: "Éco · Politique · Santé",
    color: "#39FF88",
  },
  {
    value: "7,04M",
    label: "Décès COVID",
    sub: "OMS — données cumulées",
    color: "#EF4444",
  },
];

const BOTTOM_STATS = [
  { value: "195+", label: "Pays analysés", Icon: Globe2 },
  { value: "5", label: "Thèmes géopolitiques", Icon: TrendingUp },
  { value: "30+", label: "Puissances militaires", Icon: Shield },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #080810 0%, #0c0c1a 55%, #080810 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Ambient glows ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-220px",
          right: "-80px",
          width: "720px",
          height: "720px",
          background:
            "radial-gradient(circle, rgba(57,255,136,0.11) 0%, transparent 58%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 80,
          left: "-160px",
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle, rgba(57,255,136,0.055) 0%, transparent 58%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Dot grid ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(57,255,136,0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.28,
          pointerEvents: "none",
        }}
      />

      {/* ── Main 2-column grid ── */}
      <div
        className="hero-grid"
        style={{
          flex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          padding: "120px 24px 60px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "40px",
          alignItems: "center",
        }}
      >
        {/* LEFT ─ Text + glass panel + carousel */}
        <div>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ marginBottom: "26px" }}
          >
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Data journalism géopolitique
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            style={{
              fontSize: "clamp(2.8rem, 6vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              color: "#fff",
              marginBottom: "18px",
            }}
          >
            L&apos;histoire du monde,
            <br />
            <span
              style={{
                color: "#39FF88",
                textShadow:
                  "0 0 60px rgba(57,255,136,0.45), 0 0 120px rgba(57,255,136,0.15)",
              }}
            >
              cartographiée
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.7,
              maxWidth: "460px",
              marginBottom: "30px",
            }}
          >
            Empires, économies, épidémies — visualisez les grandes forces
            qui ont façonné le monde à travers le temps.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "36px",
            }}
          >
            <Link href="/map/economy" className="btn-primary gap-2 text-sm px-5 py-2.5">
              Explorer la carte
              <ArrowRight size={15} />
            </Link>
            <Link href="/map/politics" className="hero-btn-ghost">
              Régimes politiques 1900–2025
            </Link>
          </motion.div>

          {/* Glassmorphism data panel */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: EASE }}
            className="glass-panel-dark"
            style={{ marginBottom: "20px" }}
          >
            {GLASS_STATS.map((stat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  paddingTop: i > 0 ? "14px" : 0,
                  marginTop: i > 0 ? "14px" : 0,
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <div
                  style={{
                    width: "3px",
                    height: "38px",
                    borderRadius: "2px",
                    flexShrink: 0,
                    background: stat.color,
                    boxShadow: `0 0 10px ${stat.color}55`,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.48)",
                      marginTop: "2px",
                    }}
                  >
                    {stat.label}
                    <span style={{ margin: "0 5px", opacity: 0.4 }}>·</span>
                    {stat.sub}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Vertical stats carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          >
            <StatsCarousel bgColor="#080810" />
          </motion.div>
        </div>

        {/* RIGHT ─ Globe (hidden on mobile via CSS class) */}
        <div
          className="hero-globe-col"
          style={{ position: "relative", height: "520px" }}
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            {/* Glow halo behind globe */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "8%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(57,255,136,0.09) 0%, transparent 68%)",
                filter: "blur(28px)",
              }}
            />
            {/* Three.js canvas */}
            <GlobeCanvas />
          </motion.div>

          {/* "Globe interactif" label */}
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              borderRadius: "100px",
              background: "rgba(57,255,136,0.08)",
              border: "1px solid rgba(57,255,136,0.22)",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#39FF88",
                boxShadow: "0 0 6px rgba(57,255,136,0.9)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.62rem",
                color: "rgba(57,255,136,0.85)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Globe interactif — 195 pays
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom stats strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {BOTTOM_STATS.map(({ value, label, Icon }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(57,255,136,0.1)",
                border: "1px solid rgba(57,255,136,0.22)",
                flexShrink: 0,
              }}
            >
              <Icon size={13} style={{ color: "#39FF88" }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.42)",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Gradient fade to page background ── */}
      <div
        aria-hidden="true"
        style={{
          height: "120px",
          background: "linear-gradient(to bottom, #080810 0%, #FAFAFA 100%)",
          flexShrink: 0,
        }}
      />
    </section>
  );
}
