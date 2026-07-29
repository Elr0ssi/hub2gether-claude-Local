"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMotionNumber } from "@/hooks/useMotionNumber";
import { AnimatedKpi } from "@/components/presentation2/AnimatedKpi";
import { DataFlowCurves } from "./DataFlowCurves";
import { FloatingIconField } from "./FloatingIconField";
import { getCategoryHero } from "@/data/categoryHeroes";

const InteractiveGlobeIcons = dynamic(() => import("@/components/globe/InteractiveGlobeIcons"), {
  ssr: false,
  loading: () => null,
});

/** Stable empty reference — keeps the globe from rebuilding its scene. */
const NO_GLOBE_MARKERS: never[] = [];

interface CategoryHeroProps {
  /** Theme slug — resolves its configuration from `src/data/categoryHeroes.ts`. */
  themeId: string;
}

/**
 * Full-viewport introduction for a category page: title, subtitle, an
 * oversized interactive globe and a floating panel of real indicators.
 *
 * Everything category-specific (colour, icons, figures, copy) lives in the
 * configuration, so a new section only needs a new entry there. On scroll the
 * whole scene clears out — globe sinking, flows dimming, panel leaving — and
 * hands the viewport over to the interactive map that follows it in the page.
 */
export function CategoryHero({ themeId }: CategoryHeroProps) {
  const config = getCategoryHero(themeId);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [globeActive, setGlobeActive] = useState(true);

  // Progress runs from the hero sitting on the fold to the hero having fully
  // scrolled past it. The scene is a single viewport that leaves with the page —
  // no sticky pin — so the map underneath rises into view from the first
  // scrolled pixel instead of waiting behind a padded track.
  const { scrollYProgress: p } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });

  // Scene exit — transform and opacity only. The layers leave in sequence:
  // title, then flows, icons, panel, and finally the globe.
  //
  // With reduced motion the scene just scrolls away with the page — no
  // parallax, no dissolve. Ranges collapse to their start value so the hook
  // order stays identical either way.
  const still = <T,>(from: T, to: T): [T, T] => (reduced ? [from, from] : [from, to]);
  const fade = still(1, 0);

  const titleY = useTransform(p, [0, 0.22], still(0, -56), { clamp: true });
  const titleOpacityMv = useTransform(p, [0, 0.15], fade, { clamp: true });
  const curvesOpacityMv = useTransform(p, [0.02, 0.22], fade, { clamp: true });
  const iconsOpacityMv = useTransform(p, [0.03, 0.24], fade, { clamp: true });
  // The panel and the globe leave last. Translating the globe down against the
  // page's own upward motion keeps it in frame a beat longer, so it reads as
  // sinking out of the viewport rather than being scrolled off it.
  const globeY = useTransform(p, [0, 0.5], still("0vh", "26vh"), { clamp: true });
  const globeScale = useTransform(p, [0, 0.5], still(1, 0.93), { clamp: true });
  const globeOpacityMv = useTransform(p, [0.1, 0.42], fade, { clamp: true });
  const statsY = useTransform(p, [0, 0.5], still("0vh", "18vh"), { clamp: true });
  const statsOpacityMv = useTransform(p, [0.03, 0.28], fade, { clamp: true });

  // Opacity is mirrored through React state — see useMotionNumber.
  const titleOpacity = useMotionNumber(titleOpacityMv);
  const curvesOpacity = useMotionNumber(curvesOpacityMv);
  const iconsOpacity = useMotionNumber(iconsOpacityMv);
  const globeOpacity = useMotionNumber(globeOpacityMv);
  const statsOpacity = useMotionNumber(statsOpacityMv);

  // Once the scene has cleared, stop rendering the WebGL frame entirely.
  useMotionValueEvent(p, "change", (v) => {
    const shouldRender = v < 0.46;
    setGlobeActive((current) => (current === shouldRender ? current : shouldRender));
  });

  if (!config) return null;

  const { accent, accentInk } = config;

  return (
    <div ref={trackRef} className="cat-hero-track">
      <div className="cat-hero-stage">
        {/* Data flows behind the globe */}
        <motion.div className="cat-hero-layer" style={{ opacity: curvesOpacity, zIndex: 1 }}>
          <DataFlowCurves accent={accent} layer="back" />
        </motion.div>

        {/* Globe — oversized on purpose, its lower half runs past the fold */}
        <div className="cat-hero-globe-anchor" style={{ zIndex: 2 }}>
          <motion.div
            className="cat-hero-globe"
            style={{ y: globeY, scale: globeScale, opacity: globeOpacity }}
          >
            {/* Badges live in the icon field above, not on the sphere: with the
                globe this large, surface-anchored ones would fall past the fold. */}
            <InteractiveGlobeIcons markers={NO_GLOBE_MARKERS} accent={accent} active={globeActive} />
          </motion.div>
        </div>

        {/* Category icons floating around the globe */}
        <motion.div className="cat-hero-layer" style={{ opacity: iconsOpacity, zIndex: 6 }}>
          <FloatingIconField icons={config.icons} accent={accent} />
        </motion.div>

        {/* Data flows crossing in front of the globe */}
        <motion.div className="cat-hero-layer" style={{ opacity: curvesOpacity, zIndex: 3 }}>
          <DataFlowCurves accent={accent} layer="front" />
        </motion.div>

        {/* Title */}
        <motion.div
          className="cat-hero-head"
          style={{ y: titleY, opacity: titleOpacity, zIndex: 4 }}
        >
          <span
            className="cat-hero-eyebrow"
            style={{
              color: accentInk,
              background: `${accent}14`,
              border: `1px solid ${accent}3D`,
            }}
          >
            {config.eyebrow}
          </span>
          <h1 className="cat-hero-title">
            {config.title} <span style={{ color: accentInk }}>{config.titleAccent}</span>
          </h1>
          <p className="cat-hero-subtitle">{config.subtitle}</p>
        </motion.div>

        {/* Floating indicators */}
        <motion.div
          className="cat-hero-stats-anchor"
          style={{ y: statsY, opacity: statsOpacity, zIndex: 5 }}
        >
          <div className="cat-hero-stats">
            {config.stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="cat-hero-stat">
                  <span className="cat-hero-stat-icon" style={{ background: `${accent}17` }}>
                    <Icon size={18} color={accent} strokeWidth={2.2} />
                  </span>
                  <p className="cat-hero-stat-label">{stat.label}</p>
                  <p className="cat-hero-stat-value">
                    <AnimatedKpi
                      target={stat.value}
                      decimals={stat.decimals ?? 0}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={1400}
                    />
                  </p>
                  <p className="cat-hero-stat-meta">
                    {stat.delta && (
                      <span style={{ color: accentInk, fontWeight: 700 }}>{stat.delta}</span>
                    )}
                    {stat.delta && stat.note ? " · " : ""}
                    {stat.note}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="cat-hero-source">{config.sourceNote}</p>
        </motion.div>
      </div>

      <style>{`
        .cat-hero-track {
          position: relative;
          height: calc(100vh - var(--navbar-height));
        }
        .cat-hero-stage {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: var(--bg);
        }
        .cat-hero-layer { position: absolute; inset: 0; pointer-events: none; }

        .cat-hero-globe-anchor {
          position: absolute;
          left: 50%;
          top: 34%;
          transform: translateX(-50%);
          width: min(900px, 118vw);
          aspect-ratio: 1 / 1;
        }
        .cat-hero-globe { width: 100%; height: 100%; position: relative; }

        .cat-hero-head {
          position: absolute;
          top: clamp(22px, 5vh, 60px);
          left: 0;
          right: 0;
          padding: 0 clamp(20px, 5vw, 56px);
          text-align: center;
        }
        .cat-hero-eyebrow {
          display: inline-block;
          padding: 4px 11px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .cat-hero-title {
          margin: 14px 0 0;
          font-size: clamp(2.3rem, 6vw, 4.6rem);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: -0.045em;
          color: var(--ink);
        }
        .cat-hero-subtitle {
          margin: 14px auto 0;
          max-width: 700px;
          font-size: clamp(0.9rem, 1.2vw, 1.08rem);
          line-height: 1.6;
          color: var(--ink-3);
        }

        .cat-hero-stats-anchor {
          position: absolute;
          left: 0;
          right: 0;
          bottom: clamp(14px, 3vh, 34px);
          padding: 0 clamp(14px, 3vw, 40px);
        }
        .cat-hero-stats {
          max-width: 1160px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-float);
          overflow: hidden;
        }
        .cat-hero-stat {
          padding: clamp(16px, 2.4vh, 26px) clamp(12px, 1.6vw, 24px);
          text-align: center;
          border-left: 1px solid var(--border-light);
        }
        .cat-hero-stat:first-child { border-left: none; }
        .cat-hero-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }
        .cat-hero-stat-label {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--ink-3);
          margin-bottom: 6px;
        }
        .cat-hero-stat-value {
          font-size: clamp(1.35rem, 2.2vw, 1.9rem);
          font-weight: 900;
          letter-spacing: -0.035em;
          color: var(--ink);
          margin-bottom: 5px;
        }
        .cat-hero-stat-meta { font-size: 0.68rem; color: var(--ink-4); }
        .cat-hero-source {
          max-width: 1160px;
          margin: 10px auto 0;
          text-align: center;
          font-size: 0.64rem;
          color: var(--ink-4);
        }

        @media (max-width: 900px) {
          .cat-hero-stats { grid-template-columns: repeat(2, 1fr); }
          .cat-hero-stat:nth-child(2n + 1) { border-left: none; }
          .cat-hero-stat:nth-child(n + 3) { border-top: 1px solid var(--border-light); }
          .cat-hero-globe-anchor { top: 40%; width: min(700px, 145vw); }
        }
        @media (max-width: 560px) {
          .cat-hero-stat { padding: 13px 10px; }
          .cat-hero-stat-icon { width: 32px; height: 32px; margin-bottom: 7px; }
          .cat-hero-stat-label { font-size: 0.7rem; }
          .cat-hero-stat-meta { display: none; }
          .cat-hero-source { display: none; }
        }
      `}</style>
    </div>
  );
}
