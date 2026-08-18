"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { TELEPORT_EVENT, type TeleportDetail } from "@/hooks/useScrollTeleport";

/** Rounded so the server and the browser agree on every coordinate. */
const q = (n: number): number => Math.round(n * 100) / 100;

const W = 1000;
const H = 1000;

interface Strand {
  /** Vertical anchor, as a fraction of the section's height. */
  y: number;
  /** Peak of the bend, in fractions of the height — signed. */
  bend: number;
  /** How far the strand travels across the section as it scrolls past. */
  travel: number;
  /** Parallax weight: how strongly it answers the pointer, 0 to 1. */
  depth: number;
  /** Amplitude and period of the idle sway. */
  sway: number;
  swaySeconds: number;
  width: number;
  alpha: number;
  tinted: boolean;
  /** Beads riding the strand, positioned along its length. */
  dots: number[];
}

// Hand-placed rather than random: the sheaf has to leave the middle of the
// section clear for the card sitting on top of it, so the strands crowd the
// top and bottom edges, thin out towards the centre, and never cross it with
// any weight. Depth alternates so neighbours never move as one sheet.
const STRANDS: Strand[] = [
  { y: 0.03, bend: -0.045, travel: 70, depth: 0.30, sway: 7, swaySeconds: 19, width: 1.4, alpha: 0.50, tinted: true,  dots: [0.24, 0.7] },
  { y: 0.09, bend: 0.055,  travel: 112, depth: 0.62, sway: 11, swaySeconds: 24, width: 1,   alpha: 0.38, tinted: false, dots: [0.46] },
  { y: 0.15, bend: -0.04,  travel: 150, depth: 0.88, sway: 14, swaySeconds: 16, width: 1,   alpha: 0.30, tinted: true,  dots: [] },
  { y: 0.21, bend: 0.06,   travel: 186, depth: 0.44, sway: 9,  swaySeconds: 29, width: 1,   alpha: 0.24, tinted: false, dots: [0.66] },
  { y: 0.28, bend: -0.07,  travel: 222, depth: 1.00, sway: 16, swaySeconds: 21, width: 1,   alpha: 0.18, tinted: false, dots: [] },
  { y: 0.36, bend: 0.05,   travel: 258, depth: 0.70, sway: 12, swaySeconds: 33, width: 1,   alpha: 0.12, tinted: true,  dots: [] },
  { y: 0.64, bend: -0.05,  travel: -252, depth: 0.72, sway: 12, swaySeconds: 27, width: 1,   alpha: 0.12, tinted: false, dots: [] },
  { y: 0.72, bend: 0.07,   travel: -216, depth: 1.00, sway: 16, swaySeconds: 18, width: 1,   alpha: 0.18, tinted: true,  dots: [0.34] },
  { y: 0.79, bend: -0.06,  travel: -180, depth: 0.46, sway: 9,  swaySeconds: 31, width: 1,   alpha: 0.24, tinted: false, dots: [] },
  { y: 0.85, bend: 0.045,  travel: -142, depth: 0.86, sway: 14, swaySeconds: 22, width: 1,   alpha: 0.30, tinted: false, dots: [0.58] },
  { y: 0.91, bend: -0.055, travel: -104, depth: 0.60, sway: 11, swaySeconds: 26, width: 1,   alpha: 0.38, tinted: true,  dots: [] },
  { y: 0.97, bend: 0.05,   travel: -66, depth: 0.28, sway: 7,  swaySeconds: 20, width: 1.4, alpha: 0.50, tinted: false, dots: [0.28, 0.76] },
];

// The strand is two cubics: a first bend from off the left edge to mid-span,
// then a smooth continuation to off the right edge. Both are kept as control
// points so the beads can be placed by evaluating the very curve the path
// draws, instead of measuring it out of the DOM.
function controls(s: Strand) {
  const y = s.y * H;
  const b = s.bend * H;
  const a: [number, number][] = [
    [-90, y],
    [W * 0.2, y + b],
    [W * 0.34, y - b * 1.5],
    [W * 0.5, y - b * 0.4],
  ];
  // "S" mirrors the previous control point about the join.
  const c: [number, number][] = [
    a[3],
    [2 * a[3][0] - a[2][0], 2 * a[3][1] - a[2][1]],
    [W * 0.82, y + b * 1.6],
    [W + 90, y + b * 0.3],
  ];
  return [a, c] as const;
}

function pathFor(s: Strand): string {
  const [a, c] = controls(s);
  const p = (pt: [number, number]) => `${q(pt[0])} ${q(pt[1])}`;
  return `M ${p(a[0])} C ${p(a[1])}, ${p(a[2])}, ${p(a[3])} S ${p(c[2])}, ${p(c[3])}`;
}

function cubicAt(pts: readonly [number, number][], t: number): [number, number] {
  const m = 1 - t;
  const w = [m * m * m, 3 * m * m * t, 3 * m * t * t, t * t * t];
  return [
    w[0] * pts[0][0] + w[1] * pts[1][0] + w[2] * pts[2][0] + w[3] * pts[3][0],
    w[0] * pts[0][1] + w[1] * pts[1][1] + w[2] * pts[2][1] + w[3] * pts[3][1],
  ];
}

/** Point on the whole strand, `u` running 0 (left) to 1 (right). */
function pointAt(s: Strand, u: number): [number, number] {
  const [a, c] = controls(s);
  return u < 0.5 ? cubicAt(a, u * 2) : cubicAt(c, (u - 0.5) * 2);
}

interface SectionFlowCurvesProps {
  /** The section the strands belong to — their drift is read from its scroll. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Index of that section, so it can answer its own arrival. */
  index: number;
}

/**
 * Backdrop for a full-height section: a sheaf of long, unequal curves behind
 * the card. Purely decorative — it leaves the middle band clear and carries
 * no content.
 *
 * Three things move it, and they add up rather than replace each other:
 *  - the section's own scroll progress, passed through a spring so the sheaf
 *    still glides when the page jumps to the section rather than scrolls to it;
 *  - the pointer, which each strand answers by its own depth, so the sheaf
 *    opens out instead of sliding as one sheet;
 *  - an idle sway, so the section is never completely still.
 * A jump to this section adds a one-off kick that settles back to rest.
 */
export function SectionFlowCurves({ sectionRef, index }: SectionFlowCurvesProps) {
  const reduced = useReducedMotion();
  const idRef = useRef(`flow-${index}`);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const drift = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.7 });

  // Pointer, normalised to -1..1 across the section and smoothed so the sheaf
  // trails the cursor instead of sticking to it.
  const pxRaw = useMotionValue(0);
  const pyRaw = useMotionValue(0);
  const px = useSpring(pxRaw, { stiffness: 60, damping: 20, mass: 0.9 });
  const py = useSpring(pyRaw, { stiffness: 60, damping: 20, mass: 0.9 });

  // -1..1, driven to ±1 on arrival and released back to 0.
  const kick = useMotionValue(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      pxRaw.set(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)));
      pyRaw.set(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)));
    };
    const onLeave = () => {
      pxRaw.set(0);
      pyRaw.set(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [sectionRef, reduced, pxRaw, pyRaw]);

  useEffect(() => {
    if (reduced) return;
    const onTeleport = (e: Event) => {
      const detail = (e as CustomEvent<TeleportDetail>).detail;
      if (detail.index !== index) return;
      // The sheaf is thrown in the direction the page came from and swings
      // back — the flight the instant jump cannot show on its own.
      kick.set(-detail.dir);
      animate(kick, 0, { type: "spring", stiffness: 120, damping: 15, mass: 1.1 });
    };
    window.addEventListener(TELEPORT_EVENT, onTeleport);
    return () => window.removeEventListener(TELEPORT_EVENT, onTeleport);
  }, [index, kick, reduced]);

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id={`${idRef.current}-tint`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#39FF88" stopOpacity="0" />
            <stop offset="35%" stopColor="#39FF88" stopOpacity="1" />
            <stop offset="72%" stopColor="#0D7A40" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0D7A40" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${idRef.current}-plain`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ink-4)" stopOpacity="0" />
            <stop offset="40%" stopColor="var(--ink-4)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--ink-4)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {STRANDS.map((s, i) => (
          <StrandLine
            key={i}
            strand={s}
            drift={drift}
            px={px}
            py={py}
            kick={kick}
            reduced={!!reduced}
            idBase={idRef.current}
          />
        ))}
      </svg>
    </div>
  );
}

type MV = ReturnType<typeof useMotionValue<number>>;

function StrandLine({
  strand,
  drift,
  px,
  py,
  kick,
  reduced,
  idBase,
}: {
  strand: Strand;
  drift: MV;
  px: MV;
  py: MV;
  kick: MV;
  reduced: boolean;
  idBase: string;
}) {
  const d = pathFor(strand);
  const sway = useMotionValue(0);

  useEffect(() => {
    if (reduced) return;
    const controls = animate(sway, [-strand.sway, strand.sway], {
      duration: strand.swaySeconds,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [sway, strand.sway, strand.swaySeconds, reduced]);

  const travel = reduced ? 0 : strand.travel;
  const depth = reduced ? 0 : strand.depth;

  const x = useTransform<number, number>(
    [drift, px, kick, sway],
    ([dv, pv, kv, sv]: number[]) =>
      (dv - 0.5) * travel + pv * depth * 34 + kv * travel * 0.55 + sv
  );
  const y = useTransform<number, number>(
    [py, kick],
    ([pv, kv]: number[]) => pv * depth * 16 + kv * depth * 26
  );

  const stroke = strand.tinted ? `url(#${idBase}-tint)` : `url(#${idBase}-plain)`;

  return (
    <motion.g style={{ x, y }}>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strand.width}
        strokeOpacity={strand.alpha}
        vectorEffect="non-scaling-stroke"
      />
      {/* Beads are drawn as round stroke caps: the viewBox is stretched to the
          section's aspect, so a circle would render as a flattened ellipse. */}
      {strand.dots.map((u, i) => {
        const [cx, cy] = pointAt(strand, u);
        return (
          <line
            key={i}
            x1={q(cx)}
            y1={q(cy)}
            x2={q(cx) + 0.01}
            y2={q(cy)}
            stroke={strand.tinted ? "#39FF88" : "var(--ink-4)"}
            strokeOpacity={strand.alpha + 0.2}
            strokeWidth={6}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </motion.g>
  );
}
