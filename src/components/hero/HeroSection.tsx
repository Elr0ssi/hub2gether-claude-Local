"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe, TrendingUp, Swords } from "lucide-react";

const BLOB_SHAPES = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "40% 60% 55% 45% / 35% 65% 45% 65%",
  "50% 50% 70% 30% / 45% 55% 35% 65%",
  "70% 30% 45% 55% / 65% 35% 60% 40%",
  "35% 65% 60% 40% / 50% 50% 65% 35%",
  "60% 40% 30% 70% / 60% 30% 70% 40%",
];

const BLOB_SHAPES_B = [
  "45% 55% 65% 35% / 55% 45% 55% 45%",
  "65% 35% 40% 60% / 40% 60% 40% 60%",
  "35% 65% 55% 45% / 60% 40% 65% 35%",
  "55% 45% 70% 30% / 35% 65% 45% 55%",
  "70% 30% 50% 50% / 50% 50% 40% 60%",
  "45% 55% 65% 35% / 55% 45% 55% 45%",
];

function MorphingBlob({
  shapes, size, color, style, duration,
}: {
  shapes: string[]; size: number; color: string; style?: React.CSSProperties; duration: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden="true"
      animate={{ borderRadius: shapes }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
      style={{
        position: "absolute",
        width: size, height: size,
        background: color,
        filter: "blur(48px)",
        pointerEvents: "none",
        willChange: "border-radius",
        ...style,
      }}
    />
  );
}

const STATS = [
  { value: "6", label: "Grands empires", icon: Globe },
  { value: "50+", label: "Périodes historiques", icon: TrendingUp },
  { value: "13,5M km²", label: "Plus grand empire colonial", icon: Swords },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "92vh" }}>
      {/* Morphing blob — top right */}
      <MorphingBlob
        shapes={BLOB_SHAPES}
        size={680}
        color="rgba(57,255,136,0.13)"
        duration={10}
        style={{ top: "-200px", right: "-180px" }}
      />
      {/* Morphing blob — bottom left */}
      <MorphingBlob
        shapes={BLOB_SHAPES_B}
        size={440}
        color="rgba(57,255,136,0.09)"
        duration={13}
        style={{ bottom: "-80px", left: "-120px" }}
      />
      {/* Morphing blob — center accent */}
      <MorphingBlob
        shapes={BLOB_SHAPES_B.slice().reverse()}
        size={320}
        color="rgba(57,255,136,0.06)"
        duration={16}
        style={{ top: "30%", left: "30%" }}
      />

      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.55,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-16 flex flex-col items-center text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="accent-badge text-xs inline-flex items-center gap-1.5">
            <span className="accent-dot" />
            Data journalism géopolitique
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-display text-center mb-5"
          style={{ color: "var(--ink)", maxWidth: "820px", lineHeight: 1.08 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          L&apos;histoire du monde,{" "}
          <br />
          <span
            style={{
              color: "var(--accent)",
              textShadow: "0 0 50px rgba(57,255,136,0.35), 0 0 100px rgba(57,255,136,0.15)",
            }}
          >
            cartographiée
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-body text-center mb-10"
          style={{ maxWidth: "580px", color: "var(--ink-3)", fontSize: "1.05rem", lineHeight: 1.65 }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Empires, économies, épidémies — visualisez les grandes forces
          qui ont façonné le monde à travers le temps.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 mb-16"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/map/empires" className="btn-primary gap-2 text-sm px-5 py-2.5">
            Explorer la carte
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/map/empires?empire=napoleonic&year=1812"
            className="btn-secondary gap-2 text-sm px-5 py-2.5"
          >
            Empire napoléonien 1812
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-16"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}
              >
                <Icon size={13} style={{ color: "#0D7A40" }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight" style={{ color: "var(--ink)" }}>
                  {value}
                </p>
                <p className="text-caption leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Map preview card */}
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: "var(--border)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.09), 0 0 0 1px var(--border)",
            }}
          >
            {/* Card header */}
            <div
              className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
            >
              <div className="flex items-center gap-3">
                <span className="accent-badge text-xs">Empires</span>
                <span className="text-small font-semibold" style={{ color: "var(--ink-2)" }}>
                  Empire napoléonien — 1812
                </span>
              </div>
              <span className="text-caption hidden sm:block">Extension maximale · 130 départements</span>
            </div>

            {/* Map preview with SVG illustration */}
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{ height: "300px", background: "#EEF0F5" }}
            >
              {/* Stylized Europe SVG placeholder */}
              <svg
                viewBox="0 0 900 480"
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.18 }}
              >
                {/* Rough Europe outline */}
                <path
                  d="M100,200 Q150,160 200,150 Q240,140 260,130 Q280,120 310,115 Q340,110 370,118 Q410,125 440,120 Q480,115 510,125 Q540,130 570,140 Q600,150 620,160 Q640,170 650,185 Q660,200 655,215 Q645,235 630,245 Q610,258 590,265 Q560,275 540,285 Q510,295 490,305 Q460,318 440,330 Q410,345 380,355 Q350,362 320,358 Q290,352 265,340 Q235,325 210,308 Q185,290 165,270 Q140,245 120,225 Q108,212 100,200Z"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                {/* Grid lines */}
                {[120, 200, 280, 360, 440, 520, 600, 680, 760].map((x) => (
                  <line key={x} x1={x} y1="60" x2={x} y2="420" stroke="var(--border)" strokeWidth="0.5" />
                ))}
                {[80, 160, 240, 320, 400].map((y) => (
                  <line key={y} x1="80" y1={y} x2="820" y2={y} stroke="var(--border)" strokeWidth="0.5" />
                ))}
              </svg>

              {/* Neon glow overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse 60% 50% at 42% 52%, rgba(57,255,136,0.12) 0%, transparent 70%)",
                }}
              />

              {/* Empire territory hint */}
              <div
                className="absolute"
                style={{
                  left: "18%",
                  top: "22%",
                  width: "42%",
                  height: "52%",
                  background: "rgba(57,255,136,0.14)",
                  borderRadius: "30% 40% 35% 45%",
                  border: "1.5px solid rgba(57,255,136,0.35)",
                  filter: "blur(4px)",
                }}
              />

              <div className="relative z-10 text-center px-4">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{
                    background: "rgba(57,255,136,0.12)",
                    border: "1px solid rgba(57,255,136,0.3)",
                    color: "#0D7A40",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#39FF88", boxShadow: "0 0 6px rgba(57,255,136,0.8)" }}
                  />
                  Carte interactive
                </div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--ink-2)" }}>
                  6 empires · 50+ périodes historiques
                </p>
                <p className="text-caption mb-4">
                  Roman, Napoléon, Mongol, Ottoman, Macédonien, Colonial
                </p>
                <Link href="/map/empires" className="btn-primary text-xs gap-1.5 inline-flex">
                  Ouvrir la carte
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Bottom info strip */}
            <div
              className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap"
              style={{ borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}
            >
              {[
                { label: "Surface", value: "750 000 km²" },
                { label: "Population", value: "44 millions" },
                { label: "Capitale", value: "Paris" },
                { label: "Système", value: "Empire absolu" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-caption">{label}</p>
                  <p className="text-xs font-semibold" style={{ color: "var(--ink-2)" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
