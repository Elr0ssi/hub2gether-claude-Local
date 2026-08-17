"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useDeckReducedMotion, useTone, EASE } from "../primitives";

/**
 * The globe, used as a presentation backdrop.
 *
 * Rules of engagement:
 *   · mounted only by the slides that need it (cover / vision / conclusion), so
 *     a single WebGL context is ever alive;
 *   · loaded through a dynamic import with ssr disabled — three.js never ends
 *     up in the server render or in the initial bundle;
 *   · pointer-events disabled, so it can never swallow a click meant to
 *     advance the deck;
 *   · `size`/`left`/`top` let a slide crop it hugely off-centre.
 */
const PresentationGlobe = dynamic(() => import("./PresentationGlobe"), {
  ssr: false,
  loading: () => null,
});

interface GlobeBackdropProps {
  /** Square edge of the globe viewport, in stage px. */
  size: number;
  /** Position of that square inside the 1920×1080 stage. */
  left: number;
  top: number;
  /** Fade-in delay, seconds. */
  delay?: number;
  opacity?: number;
  /** Seconds for the border tracing to complete. */
  traceDuration?: number;
  /** Dot-matrix opacity — lower it when type sits over the globe. */
  dotOpacity?: number;
}

export function GlobeBackdrop({
  size,
  left,
  top,
  delay = 0.2,
  opacity = 1,
  traceDuration = 6,
  dotOpacity = 0.6,
}: GlobeBackdropProps) {
  const reduced = useDeckReducedMotion();
  const tone = useTone();

  return (
    <motion.div
      aria-hidden="true"
      initial={reduced ? { opacity } : { opacity: 0, scale: 1.04 }}
      animate={{ opacity, scale: 1 }}
      transition={{ duration: 1.6, delay, ease: EASE }}
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <PresentationGlobe
        tone={tone}
        traceDuration={traceDuration}
        dotOpacity={dotOpacity}
      />
    </motion.div>
  );
}
