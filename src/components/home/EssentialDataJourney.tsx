"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEconomyShowcase } from "./EconomyShowcase";

const GlobeCanvas = dynamic(() => import("@/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => null,
});

const THEME_LINKS = [
  { href: "/map/economy", label: "Économie", accent: "#10B981" },
  { href: "/map/politics", label: "Politique", accent: "#8B5CF6" },
  { href: "/map/epidemics", label: "Épidémies", accent: "#3B82F6" },
  { href: "/map/military", label: "Militaire", accent: "#F59E0B" },
];

/* ── Scroll choreography ──────────────────────────────────────────────────────
 * A single normalised progress value drives every property, so the journey is
 * one uninterrupted motion: nothing mounts, unmounts or switches phase midway.
 *
 *   0.00 → 0.42   the intro (title + globe) rises and fades as ONE block while
 *                 the rectangle — which already contains the interactive map —
 *                 grows from a thumbnail to full size.
 *   0.42 → 0.46   the map settles at 1:1.
 *   0.46 → 0.94   the inner stack glides upward: the map leaves, the ranking
 *                 arrives. Same continuous motion, no cut.
 *   0.94 → 1.00   the ranking holds, then the sticky stage releases and the
 *                 page resumes its normal flow.
 * ---------------------------------------------------------------------------*/
const ZOOM_END = 0.42;
const TRAVEL_START = 0.46;
const TRAVEL_END = 0.94;

// Smoothstep — eases into and out of the map → ranking glide.
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function EssentialDataJourney() {
  const { mapPanel, rankingsPanel } = useEconomyShowcase();

  // Desktop + motion-safe only; elsewhere the same panels are stacked normally.
  // The animated stage is a separate component so that its useScroll only ever
  // runs with the wrapper already mounted and measurable.
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimated(wide.matches && !reduced.matches);
    update();
    wide.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  if (!animated) {
    return (
      <section>
        <div className="journey-intro journey-intro--static">
          <IntroCopy />
          <div className="journey-globe journey-globe--static">
            <GlobeCanvas theme="pib" />
          </div>
        </div>
        <div className="journey-static-stack">
          <div className="journey-card journey-card--static">{mapPanel}</div>
          <div className="journey-card journey-card--static">{rankingsPanel}</div>
        </div>
      </section>
    );
  }

  return <JourneyStage mapPanel={mapPanel} rankingsPanel={rankingsPanel} />;
}

function JourneyStage({
  mapPanel,
  rankingsPanel,
}: {
  mapPanel: ReactNode;
  rankingsPanel: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed progress: the stage keeps gliding for a beat after the wheel
  // stops, which is what makes the descent read as continuous rather than stepped.
  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.42,
    restDelta: 0.0002,
  });

  /* Intro block — title and globe move together, as a single unit. */
  const introY = useTransform(p, [0, ZOOM_END], ["0vh", "-64vh"]);
  const introOpacity = useTransform(p, [0.04, 0.3], [1, 0]);
  const introScale = useTransform(p, [0, ZOOM_END], [1, 0.9]);

  /* Rectangle — geometric keyframes so the perceived zoom speed stays constant. */
  const frameScale = useTransform(
    p,
    [0.02, 0.15, 0.29, ZOOM_END],
    [0.17, 0.31, 0.57, 1]
  );
  const frameOpacity = useTransform(p, [0.015, 0.1], [0, 1]);
  const frameY = useTransform(p, [0.02, ZOOM_END], ["15vh", "0vh"]);
  const frameShadow = useTransform(
    p,
    [0.02, ZOOM_END],
    ["0 8px 24px rgba(10,10,10,0.10)", "0 30px 80px rgba(10,10,10,0.14)"]
  );

  /* Inner stack — map panel out, ranking panel in, one uninterrupted glide. */
  const stackY = useTransform(p, [TRAVEL_START, TRAVEL_END], ["0%", "-50%"], {
    ease: smoothstep,
  });

  // Only let the card take pointer events once it is (nearly) full size — a
  // thumbnail-sized map should not swallow hovers during the zoom. And stop
  // painting the globe once the intro is fully faded.
  const [cardLive, setCardLive] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const flags = useRef({ cardLive: false, introHidden: false });
  useMotionValueEvent(p, "change", (v) => {
    // Ref-guarded so a scroll frame never schedules a render for an unchanged flag.
    const live = v > 0.4;
    if (live !== flags.current.cardLive) {
      flags.current.cardLive = live;
      setCardLive(live);
    }
    const hidden = v > 0.34;
    if (hidden !== flags.current.introHidden) {
      flags.current.introHidden = hidden;
      setIntroHidden(hidden);
    }
  });

  return (
    <div ref={wrapperRef} className="journey-wrapper">
      <div className="journey-sticky">
        {/* ── Intro: title left, globe right — one block, one movement ── */}
        <motion.div
          className="journey-intro"
          style={{
            y: introY,
            opacity: introOpacity,
            scale: introScale,
            visibility: introHidden ? "hidden" : "visible",
          }}
        >
          <IntroCopy />
          <div className="journey-globe">
            <GlobeCanvas theme="pib" />
          </div>
        </motion.div>

        {/* ── The rectangle: the map section is inside it from the first frame ── */}
        <motion.div
          className="journey-frame"
          style={{ scale: frameScale, opacity: frameOpacity, y: frameY }}
        >
          <motion.div
            className="journey-card"
            style={{
              boxShadow: frameShadow,
              pointerEvents: cardLive ? "auto" : "none",
            }}
          >
            <motion.div className="journey-stack" style={{ y: stackY }}>
              {mapPanel}
              {rankingsPanel}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Left column of the intro ── */
function IntroCopy() {
  return (
    <div className="journey-copy">
      <p className="journey-brand">The Essential Data</p>
      <h1 className="journey-title">
        Explorez le monde
        <br />
        <span className="journey-title-accent">depuis les étoiles</span>
      </h1>
      <p className="journey-lede">
        PIB, dette, chômage, régimes politiques, épidémies et puissances
        militaires — 70+ pays, cartographiés et classés à partir des données
        FMI, Banque mondiale, OMS et SIPRI.
      </p>

      <div className="journey-links">
        {THEME_LINKS.map((t) => (
          <Link key={t.href} href={t.href} className="journey-link">
            <span
              className="journey-link-dot"
              style={{ background: t.accent, boxShadow: `0 0 8px ${t.accent}` }}
            />
            {t.label}
            <ArrowRight size={11} />
          </Link>
        ))}
      </div>

      <p className="journey-cue">Faites défiler pour entrer dans la carte</p>
    </div>
  );
}
