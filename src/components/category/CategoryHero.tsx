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
  // Measured by the flow field so the strands trace the sphere itself.
  const globeRef = useRef<HTMLDivElement>(null);
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

  // Scene exit. Each layer dissolves over the stretch of scroll during which
  // it is itself leaving the top of the viewport — never earlier — so the
  // scene is always complete above the map and no emptied band is left behind.
  // Opacity only, apart from the title, which is on its way out anyway.
  //
  // With reduced motion the scene simply scrolls away with the page. Ranges
  // collapse to their start value so the hook order stays identical.
  const still = <T,>(from: T, to: T): [T, T] => (reduced ? [from, from] : [from, to]);
  const fade = still(1, 0);

  // The globe and its sheaf leave as one body: a single wrapper lifts them
  // faster than the page scrolls, so the scene rises out of the top rather
  // than being scrolled past. The strands stay locked to the sphere because
  // they move with it — nothing is re-measured.
  const sceneY = useTransform(p, [0, 1], still(0, -260), { clamp: true });
  // At the same time the sheaf closes in around the globe, scaled about the
  // sphere's own centre, so the strands finish wrapped around it.
  const curvesScale = useTransform(p, [0, 0.85], still(1, 0.88), { clamp: true });

  const titleY = useTransform(p, [0, 0.26], still(0, -56), { clamp: true });
  const titleOpacityMv = useTransform(p, [0.06, 0.26], fade, { clamp: true });
  const curvesOpacityMv = useTransform(p, [0.26, 0.5], fade, { clamp: true });
  const globeOpacityMv = useTransform(p, [0.5, 0.92], fade, { clamp: true });
  const statsOpacityMv = useTransform(p, [0.5, 0.78], fade, { clamp: true });

  // Opacity is mirrored through React state — see useMotionNumber.
  const titleOpacity = useMotionNumber(titleOpacityMv);
  const curvesOpacity = useMotionNumber(curvesOpacityMv);
  const globeOpacity = useMotionNumber(globeOpacityMv);
  const statsOpacity = useMotionNumber(statsOpacityMv);

  // Once the scene has cleared, stop rendering the WebGL frame entirely.
  useMotionValueEvent(p, "change", (v) => {
    const shouldRender = v < 0.95;
    setGlobeActive((current) => (current === shouldRender ? current : shouldRender));
  });

  if (!config) return null;

  const { accent, accentInk } = config;

  return (
    <div ref={trackRef} className="cat-hero-track">
      <div className="cat-hero-stage">
        {/* Globe and sheaf ride together — one wrapper, one lift. */}
        <motion.div className="cat-hero-scene" style={{ y: sceneY }}>
          {/* Secondary strands, running higher and much fainter */}
          <motion.div
            className="cat-hero-layer cat-hero-curves"
            style={{ opacity: curvesOpacity, scale: curvesScale, zIndex: 1 }}
          >
            <DataFlowCurves accent={accent} layer="front" globeRef={globeRef} />
          </motion.div>

          {/* Globe — oversized on purpose, its lower half runs past the fold */}
          <div ref={globeRef} className="cat-hero-globe-anchor" style={{ zIndex: 2 }}>
            <motion.div className="cat-hero-globe" style={{ opacity: globeOpacity }}>
              {/* Badges ride the flow strands above, not the sphere: with the
                  globe this large, surface-anchored ones would fall past the fold. */}
              <InteractiveGlobeIcons markers={NO_GLOBE_MARKERS} accent={accent} active={globeActive} />
            </motion.div>
          </div>

          {/* Main sheaf, wrapping the top of the globe and carrying the icon
              nodes. Above the globe so the badges stay hoverable, below the
              title and the panel so it can never cut across either. */}
          <motion.div
            className="cat-hero-layer cat-hero-curves"
            style={{ opacity: curvesOpacity, scale: curvesScale, zIndex: 3 }}
          >
            <DataFlowCurves accent={accent} layer="back" icons={config.icons} globeRef={globeRef} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="cat-hero-head"
          style={{ y: titleY, opacity: titleOpacity, zIndex: 4 }}
        >
          <h1 className="cat-hero-title">
            {config.title} <span style={{ color: accentInk }}>{config.titleAccent}</span>
          </h1>
          <p className="cat-hero-subtitle">{config.subtitle}</p>
        </motion.div>

        {/* Floating indicators */}
        <motion.div
          className="cat-hero-stats-anchor"
          style={{ opacity: statsOpacity, zIndex: 5 }}
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
        .cat-hero-scene { position: absolute; inset: 0; }
        /* The sheaf closes about the sphere's centre, not the stage's, the
           globe anchor sits at 50% across and its centre a little below the
           middle of the stage. */
        .cat-hero-curves { transform-origin: 50% 76%; }

        .cat-hero-globe-anchor {
          position: absolute;
          left: 50%;
          top: 40%;
          transform: translateX(-50%);
          width: min(900px, 118vw);
          aspect-ratio: 1 / 1;
        }
        .cat-hero-globe { width: 100%; height: 100%; position: relative; }

        .cat-hero-head {
          position: absolute;
          top: clamp(26px, 5.5vh, 66px);
          left: 0;
          right: 0;
          padding: 0 clamp(20px, 5vw, 56px);
          text-align: center;
        }
        .cat-hero-title {
          margin: 0;
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

        /* Un portable : 800px de haut. Le titre, le bandeau de chiffres et
           la note de source y prenaient la place du globe, qui n'apparaissait
           plus que par une tranche sous le bandeau. On rend cette place. */
        @media (max-height: 900px) {
          .cat-hero-head { top: clamp(16px, 3.4vh, 34px); }
          .cat-hero-title { font-size: clamp(1.75rem, 3vw, 2.5rem); }
          .cat-hero-subtitle { margin-top: 8px; font-size: 0.86rem; }
          .cat-hero-globe-anchor { top: 35%; width: min(620px, 86vw); }
          .cat-hero-stats-anchor { bottom: clamp(10px, 2vh, 20px); }
          .cat-hero-stat { padding: 11px clamp(10px, 1.3vw, 18px); }
          .cat-hero-stat-icon { width: 28px; height: 28px; margin-bottom: 6px; }
          .cat-hero-stat-label { font-size: 0.68rem; margin-bottom: 3px; }
          .cat-hero-stat-value { font-size: clamp(1.15rem, 1.7vw, 1.5rem); margin-bottom: 2px; }
          .cat-hero-stat-meta { font-size: 0.62rem; }
          .cat-hero-source { margin-top: 6px; font-size: 0.6rem; }
        }

        @media (max-height: 780px) {
          .cat-hero-title { font-size: clamp(1.6rem, 2.6vw, 2.1rem); }
          .cat-hero-stat-icon { display: none; }
          .cat-hero-globe-anchor { top: 32%; width: min(560px, 80vw); }
        }

        @media (max-width: 900px) {
          .cat-hero-stats { grid-template-columns: repeat(2, 1fr); }
          .cat-hero-stat:nth-child(2n + 1) { border-left: none; }
          .cat-hero-stat:nth-child(n + 3) { border-top: 1px solid var(--border-light); }
          .cat-hero-globe-anchor { top: 44%; width: min(700px, 145vw); }
        }
        /* Sous 640px les quatre chiffres passent sur une seule ligne. En
           deux par deux ils faisaient un bloc plus haut que ce qui restait
           d'écran, et le lecteur n'en voyait jamais la fin. */
        @media (max-width: 640px) {
          .cat-hero-stats { grid-template-columns: repeat(4, 1fr); }
          .cat-hero-stat,
          .cat-hero-stat:nth-child(n + 3) { border-top: none; }
          .cat-hero-stat:nth-child(2n + 1) { border-left: 1px solid var(--border-light); }
          .cat-hero-stat:first-child { border-left: none; }
          .cat-hero-stat { padding: 10px 6px; }
          .cat-hero-stat-icon { display: none; }
          .cat-hero-stat-label {
            font-size: 0.58rem;
            line-height: 1.25;
            letter-spacing: 0.01em;
          }
          .cat-hero-stat-value { font-size: 0.98rem; }
          .cat-hero-stat-meta { display: none; }
          .cat-hero-source { display: none; }
          .cat-hero-title { font-size: clamp(1.9rem, 9vw, 2.4rem); }
          .cat-hero-globe-anchor { top: 38%; width: min(620px, 155vw); }
        }
      `}</style>
    </div>
  );
}
