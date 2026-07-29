"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useMotionNumber } from "@/hooks/useMotionNumber";

const InteractiveGlobeIcons = dynamic(() => import("@/components/globe/InteractiveGlobeIcons"), {
  ssr: false,
  loading: () => null,
});

// Scroll phases, expressed as fractions of this component's own scroll range.
const T = {
  introEnd: 0.14, // small loading globe holds
  toHeroEnd: 0.4, // grows + slides into hero position
  heroEnd: 0.68, // hero holds
  // 0.68 -> 1: fades out, handing off to the data story scene
};

export function IntroHeroGlobe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const leftPercent = useTransform(
    p,
    [0, T.introEnd, T.toHeroEnd, T.heroEnd, 1],
    ["50%", "50%", "68%", "68%", "62%"]
  );
  const globeScale = useTransform(p, [0, T.introEnd, T.toHeroEnd, T.heroEnd, 1], [0.32, 0.32, 1, 1, 0.92]);
  const globeOpacityMv = useTransform(p, [0, 0.82, 1], [1, 1, 0]);
  const loadingOpacityMv = useTransform(p, [0, 0.07, 0.16], [1, 1, 0]);
  const loadingScale = useTransform(p, [0, 0.16], [1, 0.85]);

  const titleOpacityMv = useTransform(p, [0.3, T.toHeroEnd, T.heroEnd, 0.85], [0, 1, 1, 0]);
  const titleY = useTransform(p, [0.3, T.toHeroEnd], [24, 0], { clamp: true });

  // See useMotionNumber: opacity specifically needs to be mirrored through
  // React state to actually reach the DOM in this environment.
  const globeOpacity = useMotionNumber(globeOpacityMv);
  const loadingOpacity = useMotionNumber(loadingOpacityMv);
  const titleOpacity = useMotionNumber(titleOpacityMv);

  // Reduced motion: the wrapper collapses to a single viewport, so the same
  // scroll-linked transforms above resolve almost immediately instead of
  // being disabled outright — content and final layout stay identical.
  return (
    <div ref={wrapperRef} style={{ height: reduced ? "100vh" : "340vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: "var(--navbar-height)",
          height: "calc(100vh - var(--navbar-height))",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* Hero title — left side, fades in as the globe settles into place.
            Outer div owns static vertical centering; inner motion.div owns the
            scroll-driven slide/opacity so the two transforms never fight. */}
        <div
          style={{
            position: "absolute",
            left: "clamp(24px, 6vw, 88px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            maxWidth: 460,
          }}
        >
          <motion.div style={{ y: titleY, opacity: titleOpacity }}>
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

        {/* Globe stage — outer motion.div owns the scroll-driven horizontal slide
            (left) plus a constant centering transform; inner motion.div owns
            scale/opacity, so the two never clash. */}
        <motion.div
          style={{
            position: "absolute",
            left: leftPercent,
            top: "52%",
            transform: "translate(-50%, -50%)",
            width: "min(620px, 62vh, 74vw)",
            aspectRatio: "1 / 1",
            zIndex: 1,
          }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              scale: globeScale,
              opacity: globeOpacity,
            }}
          >
            <InteractiveGlobeIcons />
          </motion.div>
        </motion.div>

        {/* Intro loading indicator — fades out almost immediately on first scroll */}
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "16%",
            x: "-50%",
            opacity: loadingOpacity,
            scale: loadingScale,
            zIndex: 3,
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
              animation: reduced ? "none" : "presentation2-pulse 1.6s ease-in-out infinite",
            }}
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
        `}</style>
      </div>
    </div>
  );
}
