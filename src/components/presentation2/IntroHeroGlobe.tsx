"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useMotionNumber } from "@/hooks/useMotionNumber";
import { HeroSurfaceLines } from "./HeroSurfaceLines";

const InteractiveGlobeIcons = dynamic(() => import("@/components/globe/InteractiveGlobeIcons"), {
  ssr: false,
  loading: () => null,
});

// Scroll phases, expressed as fractions of this component's own scroll range.
//
// The first half is the hero as it was: the globe grows out of the loading
// state, slides right, the title arrives, and the composition holds. The
// second half is the handover — a surface emerges under the globe and grows
// until it *is* the next section, rather than the next section arriving from
// below. The two are one continuous scroll: there is no point at which the
// hero ends and something else starts.
const T = {
  introEnd: 0.13, // small loading globe holds
  toHeroEnd: 0.34, // grows + slides into hero position
  heroHold: 0.46, // hero reads normally until here

  surfaceIn: 0.46, // the surface starts to rise from the bottom of the frame
  surfaceSeen: 0.56, // fully opaque, still a floating card
  surfaceMid: 0.72, // halfway through its expansion
  surfaceFull: 0.9, // as wide and tall as the viewport allows
  surfaceClose: 0.97, // inset, corner and shadow gone — it is the ground now

  titleOut: 0.58, // the title only leaves once the surface is established
  titleGone: 0.72,

  globeDrop: 0.64, // the globe begins to settle into the surface
  globeIn: 0.88, // it has fully entered
  globeFade: 0.8, // and is the last hero element to go
  globeGone: 0.94,
};

/** Where the surface ends up — the ground the next section is built on. */
const SURFACE = "#EEFBF4";

export function IntroHeroGlobe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // ── Globe ────────────────────────────────────────────────────────────────
  // It recentres as it descends, so it is over the surface, not beside it.
  const globeLeft = useTransform(
    p,
    [0, T.introEnd, T.toHeroEnd, T.globeDrop, T.globeIn],
    ["50%", "50%", "68%", "68%", "50%"]
  );
  const globeTop = useTransform(p, [0, T.globeDrop, T.globeIn], ["52%", "52%", "58%"]);
  const globeScale = useTransform(
    p,
    [0, T.introEnd, T.toHeroEnd, T.globeDrop, T.globeIn],
    [0.32, 0.32, 1, 1, 0.58]
  );
  const globeOpacityMv = useTransform(p, [0, T.globeFade, T.globeGone], [1, 1, 0]);

  // As it sinks, its lower edge softens — it is going *into* the surface, not
  // sitting on top of it.
  const maskStop = useTransform(p, [T.globeDrop, T.globeIn], [108, 62], { clamp: true });
  const globeMask = useMotionTemplate`linear-gradient(to bottom, #000 38%, rgba(0,0,0,0.92) ${maskStop}%, transparent 100%)`;

  const loadingOpacityMv = useTransform(p, [0, 0.055, 0.125], [1, 1, 0]);
  const loadingScale = useTransform(p, [0, 0.125], [1, 0.85]);

  // ── Title ────────────────────────────────────────────────────────────────
  const titleOpacityMv = useTransform(
    p,
    [0.28, T.toHeroEnd + 0.08, T.titleOut, T.titleGone],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    p,
    [0.28, T.toHeroEnd + 0.08, T.titleOut, T.titleGone],
    [24, 0, 0, -30]
  );

  // ── Surface ──────────────────────────────────────────────────────────────
  // A real geometric expansion — width, height, corner radius and position all
  // interpolate, so it reads as a pane unfolding rather than a scaled sprite.
  // Single unit per property: mixing vw with calc() would break interpolation.
  // The last stretch closes the inset entirely — edge to edge, no corner, no
  // shadow. By the time the pane stops being an object it is indistinguishable
  // from the ground the next scene is built on, so the handover has no seam to
  // give it away.
  const surfaceWidth = useTransform(
    p,
    [T.surfaceIn, T.surfaceMid, T.surfaceFull, T.surfaceClose],
    ["44%", "74%", "98%", "100%"]
  );
  const surfaceHeight = useTransform(
    p,
    [T.surfaceIn, T.surfaceMid, T.surfaceFull, T.surfaceClose],
    ["30%", "62%", "94%", "100%"]
  );
  // Centred from the first pixel and rising from below the fold: the pane
  // arrives as the next section coming up to meet the reader, not as a card
  // tucked behind the globe's shoulder.
  const surfaceLeft = "50%";
  const surfaceTop = useTransform(
    p,
    [T.surfaceIn, T.surfaceSeen, T.surfaceMid, T.surfaceFull],
    ["124%", "96%", "72%", "50%"]
  );
  const surfaceRadius = useTransform(
    p,
    [T.surfaceIn, T.surfaceMid, T.surfaceFull, T.surfaceClose],
    [44, 34, 26, 0]
  );
  const shadowAlpha = useTransform(p, [T.surfaceFull, T.surfaceClose], [0.07, 0], { clamp: true });
  const shadowBlur = useTransform(p, [T.surfaceFull, T.surfaceClose], [80, 0], { clamp: true });
  const surfaceShadow = useMotionTemplate`0 30px ${shadowBlur}px rgba(10,60,35,${shadowAlpha})`;
  const surfaceOpacityMv = useTransform(p, [T.surfaceIn, T.surfaceSeen], [0, 1]);
  const surfaceBorder = useTransform(
    p,
    [T.surfaceIn, T.surfaceFull, T.surfaceClose],
    ["rgba(20,160,95,0.14)", "rgba(20,160,95,0.10)", "rgba(20,160,95,0)"]
  );
  const haloOpacityMv = useTransform(
    p,
    [T.surfaceIn, T.surfaceSeen, T.surfaceMid, T.surfaceFull],
    [0, 0.9, 0.9, 0]
  );
  // The trajectories inside the surface hand over to the section's own content.
  const linesOpacityMv = useTransform(p, [0.58, 0.7, 0.86, 0.97], [0, 0.9, 0.9, 0]);

  // The page itself takes the surface's colour just as the surface reaches the
  // edges of the screen, so the inset dissolves instead of snapping shut and
  // the scene underneath can take over on the same ground.
  const stageBg = useTransform(p, [0.84, 0.95], ["#ffffff", SURFACE]);

  // See useMotionNumber: opacity specifically needs to be mirrored through
  // React state to actually reach the DOM in this environment.
  const globeOpacity = useMotionNumber(globeOpacityMv);
  const loadingOpacity = useMotionNumber(loadingOpacityMv);
  const titleOpacity = useMotionNumber(titleOpacityMv);
  const surfaceOpacity = useMotionNumber(surfaceOpacityMv);
  const haloOpacity = useMotionNumber(haloOpacityMv);
  const linesOpacity = useMotionNumber(linesOpacityMv);

  // Reduced motion: `.p2-hero-runway` collapses to a single viewport, so the
  // same scroll-linked transforms above resolve almost immediately instead of
  // being disabled outright — content and final layout stay identical, and the
  // preference never has to be asked during render.
  return (
    <div ref={wrapperRef} className="p2-hero-runway">
      <motion.div
        style={{
          position: "sticky",
          top: "var(--navbar-height)",
          height: "calc(100vh - var(--navbar-height))",
          overflow: "hidden",
          background: stageBg,
        }}
      >
        {/* Halo — a breath of colour under the surface as it appears, gone by
            the time the surface is large enough to carry itself. */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: surfaceLeft,
            top: surfaceTop,
            width: "120%",
            height: "120%",
            transform: "translate(-50%, -50%)",
            opacity: haloOpacity,
            background:
              "radial-gradient(circle, rgba(57,255,136,0.08) 0%, rgba(57,255,136,0) 65%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* The surface. It emerges behind the globe's lower half as a floating
            pane and grows until it is the whole viewport — the next section
            arriving as an object of this one rather than as a new block. */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: surfaceLeft,
            top: surfaceTop,
            width: surfaceWidth,
            height: surfaceHeight,
            transform: "translate(-50%, -50%)",
            borderRadius: surfaceRadius,
            background: SURFACE,
            border: "1px solid",
            borderColor: surfaceBorder,
            boxShadow: surfaceShadow,
            opacity: surfaceOpacity,
            overflow: "hidden",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <motion.div style={{ position: "absolute", inset: 0, opacity: linesOpacity }}>
            <HeroSurfaceLines />
          </motion.div>
        </motion.div>

        {/* Globe stage — outer motion.div owns the scroll-driven position plus a
            constant centering transform; inner motion.div owns scale/opacity and
            the mask, so the two never clash. Above the surface: it is the last
            piece of the hero on screen, and it sinks into the pane. */}
        <motion.div
          style={{
            position: "absolute",
            left: globeLeft,
            top: globeTop,
            transform: "translate(-50%, -50%)",
            width: "min(620px, 62vh, 74vw)",
            aspectRatio: "1 / 1",
            zIndex: 2,
          }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              scale: globeScale,
              opacity: globeOpacity,
              maskImage: globeMask,
              WebkitMaskImage: globeMask,
            }}
          >
            <InteractiveGlobeIcons />
          </motion.div>
        </motion.div>

        {/* Hero title — left side, fades in as the globe settles into place.
            Outer div owns static vertical centering; inner motion.div owns the
            scroll-driven slide/opacity so the two transforms never fight. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 clamp(20px, 4vw, 64px)",
            }}
          >
          <motion.div style={{ y: titleY, opacity: titleOpacity, maxWidth: 460, pointerEvents: "auto" }}>
            <h1
              style={{
                fontSize: "clamp(2.4rem, 6vw, 4.6rem)",
                fontWeight: 900,
                color: "#0A0A0A",
                letterSpacing: "-0.045em",
                lineHeight: 1.02,
                margin: 0,
              }}
            >
              The Essential
              <br />
              <span
                style={{
                  background: "linear-gradient(125deg, #39FF88 0%, #10B981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Data
              </span>
            </h1>
            <p
              style={{
                marginTop: 20,
                fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
                color: "#6B6B6B",
                lineHeight: 1.6,
                maxWidth: 380,
              }}
            >
              Le monde à portée de main.
            </p>
          </motion.div>
          </div>
        </div>

        {/* Intro loading indicator — fades out almost immediately on first scroll */}
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "16%",
            x: "-50%",
            opacity: loadingOpacity,
            scale: loadingScale,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 8px rgba(16,185,129,0.8)",
            }}
            className="p2-loading-dot"
          />
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9B9B9B",
            }}
          >
            Chargement des données du monde
          </span>
        </motion.div>

        <style>{`
          @keyframes presentation2-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(0.72); }
          }
          .p2-loading-dot { animation: presentation2-pulse 1.6s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .p2-loading-dot { animation: none; }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
