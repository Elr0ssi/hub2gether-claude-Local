"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useMotionNumber } from "@/hooks/useMotionNumber";
import { StoryPreview, STORY_PREVIEW_WIDTH } from "./StoryPreview";

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
  surfaceMid: 0.74, // halfway through its expansion
  surfaceFull: 0.97, // as wide and tall as the viewport allows
  surfaceClose: 1.0, // inset, corner and shadow gone — it is the ground now

  titleOut: 0.58, // the title only leaves once the surface is established
  titleGone: 0.72,

  globeDrop: 0.64, // the globe begins to settle into the surface
  globeIn: 0.9, // it has fully entered
  globeFade: 0.84, // and is the last hero element to go
  globeGone: 0.98,
};

/** Where the surface ends up — the ground the next section is built on. */
const SURFACE = "#EEFBF4";

export function IntroHeroGlobe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // ── Hero exit ────────────────────────────────────────────────────────────
  // Title and globe leave together, straight up, holding their positions:
  // nothing slides sideways, nothing sinks. The hero simply travels off the
  // top of the frame while the pane comes up from the bottom to take its
  // place. One movement, two directions.
  const heroY = useTransform(p, [T.heroHold, 1], [0, -760], { clamp: true });

  const globeLeft = useTransform(p, [0, T.introEnd, T.toHeroEnd], ["50%", "50%", "68%"]);
  const globeScale = useTransform(p, [0, T.introEnd, T.toHeroEnd], [0.32, 0.32, 1]);
  const globeOpacityMv = useTransform(p, [0, T.globeFade, T.globeGone], [1, 1, 0]);

  const loadingOpacityMv = useTransform(p, [0, 0.055, 0.125], [1, 1, 0]);
  const loadingScale = useTransform(p, [0, 0.125], [1, 0.85]);

  // ── Title ────────────────────────────────────────────────────────────────
  // Le titre arrive plus tôt et reste plus longtemps : posé à 0,28 et repris
  // à 0,58, il n'était pleinement lisible qu'un dixième de la course, et le
  // lecteur passait à la section suivante avant de l'avoir lu.
  const titleOpacityMv = useTransform(
    p,
    [0.15, 0.26, 0.64, 0.76],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(p, [0.15, 0.26], [24, 0], { clamp: true });

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
  // The next section is inside the pane from the first frame, scaled down.
  // It grows with the pane rather than being faded in once the pane is full,
  // so what the reader watches opening out is the section itself.
  const previewScale = useTransform(
    p,
    [T.surfaceIn, T.surfaceMid, T.surfaceFull],
    // 0.93 is not arbitrary: the preview is drawn at 1240 and the real scene
    // renders at max-width 1280 less its gutters, so this is the scale at
    // which the two are the same size when the handover happens.
    [0.34, 0.62, 0.93]
  );
  const previewOpacityMv = useTransform(p, [T.surfaceIn, T.surfaceSeen], [0, 1]);

  // The page itself takes the surface's colour just as the surface reaches the
  // edges of the screen, so the inset dissolves instead of snapping shut and
  // the scene underneath can take over on the same ground.
  const stageBg = useTransform(p, [0.86, 0.98], ["#ffffff", SURFACE]);

  // The whole stage goes out over the last breath of the runway. At that exact
  // frame the real scene is pinned behind it, showing the same panel in the
  // same place — measured to within a few pixels — so the fade cannot be seen,
  // and the hero's slide out of the top happens transparent. Without it the
  // reader watches two copies of the section pass each other.
  const stageOpacityMv = useTransform(p, [0.965, 1], [1, 0], { clamp: true });

  // See useMotionNumber: opacity specifically needs to be mirrored through
  // React state to actually reach the DOM in this environment.
  const globeOpacity = useMotionNumber(globeOpacityMv);
  const loadingOpacity = useMotionNumber(loadingOpacityMv);
  const titleOpacity = useMotionNumber(titleOpacityMv);
  const surfaceOpacity = useMotionNumber(surfaceOpacityMv);
  const haloOpacity = useMotionNumber(haloOpacityMv);
  const previewOpacity = useMotionNumber(previewOpacityMv);
  const stageOpacity = useMotionNumber(stageOpacityMv);

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
          opacity: stageOpacity,
          // Le panneau du héros couvre la scène qui est tirée sous lui. Une
          // fois fondu, il restait quand même le premier sous le curseur :
          // la carte de la première catégorie ne réagissait pas au survol.
          // Transparent, il laisse passer.
          pointerEvents: stageOpacity < 0.05 ? "none" : "auto",
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
          {/* The section that follows, already here. */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              opacity: previewOpacity,
            }}
          >
            <motion.div
              style={{
                width: STORY_PREVIEW_WIDTH,
                scale: previewScale,
                transformOrigin: "center center",
              }}
            >
              <StoryPreview />
            </motion.div>
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
            top: "52%",
            transform: "translate(-50%, -50%)",
            width: "min(620px, 62vh, 74vw)",
            aspectRatio: "1 / 1",
            zIndex: 2,
          }}
        >
          <motion.div style={{ y: heroY }}>
            <motion.div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                position: "relative",
                scale: globeScale,
                opacity: globeOpacity,
              }}
            >
              <InteractiveGlobeIcons />
            </motion.div>
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
          <motion.div style={{ y: heroY }}>
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
