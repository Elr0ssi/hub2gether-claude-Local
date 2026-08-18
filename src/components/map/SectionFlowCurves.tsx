"use client";

import { useRef, type RefObject } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/** Rounded so the server and the browser agree on every coordinate. */
const q = (n: number): number => Math.round(n * 100) / 100;

interface Strand {
  /** Vertical anchor, as a fraction of the section's height. */
  y: number;
  /** Peak of the bend, in fractions of the height — signed. */
  bend: number;
  /** How far the strand travels across the section, in viewBox units. */
  travel: number;
  width: number;
  alpha: number;
  tinted: boolean;
  /** Dots riding the strand, positioned along its length. */
  dots: number[];
}

// Hand-placed rather than random: the sheaf has to leave the middle of the
// section clear for the card that sits on top of it, so the strands crowd the
// top and bottom edges and only graze the centre.
const STRANDS: Strand[] = [
  { y: 0.06, bend: -0.05, travel: 90, width: 1.4, alpha: 0.5, tinted: true, dots: [0.22, 0.68] },
  { y: 0.15, bend: 0.06, travel: 140, width: 1, alpha: 0.34, tinted: false, dots: [0.45] },
  { y: 0.26, bend: -0.07, travel: 200, width: 1, alpha: 0.22, tinted: false, dots: [] },
  { y: 0.74, bend: 0.07, travel: -190, width: 1, alpha: 0.22, tinted: false, dots: [0.58] },
  { y: 0.85, bend: -0.06, travel: -135, width: 1, alpha: 0.34, tinted: true, dots: [] },
  { y: 0.94, bend: 0.05, travel: -85, width: 1.4, alpha: 0.5, tinted: false, dots: [0.3, 0.77] },
];

const W = 1000;
const H = 1000;

// The strand is two cubics: a first bend from off the left edge to mid-span,
// then a smooth continuation to off the right edge. Both are kept here as
// control points so the beads can be placed by evaluating the very same curve
// the path draws, instead of measuring it out of the DOM.
function controls(s: Strand) {
  const y = s.y * H;
  const b = s.bend * H;
  const a: [number, number][] = [
    [-80, y],
    [W * 0.2, y + b],
    [W * 0.34, y - b * 1.5],
    [W * 0.5, y - b * 0.4],
  ];
  // "S" mirrors the previous control point about the join.
  const c: [number, number][] = [
    a[3],
    [2 * a[3][0] - a[2][0], 2 * a[3][1] - a[2][1]],
    [W * 0.82, y + b * 1.6],
    [W + 80, y + b * 0.3],
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
}

/**
 * Backdrop for a full-height section: a sheaf of long, unequal curves that
 * slide sideways as the section crosses the viewport. Purely decorative — it
 * sits behind the card, leaves the middle band clear, and carries no content.
 *
 * The drift is read from the section's own scroll progress and passed through
 * a spring, so it glides even when the page jumps from one section to the next
 * in a single step rather than scrolling there.
 */
export function SectionFlowCurves({ sectionRef }: SectionFlowCurvesProps) {
  const reduced = useReducedMotion();
  const idRef = useRef(`flow-${Math.random().toString(36).slice(2, 8)}`);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.7 });

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
          <Strand key={i} strand={s} progress={eased} reduced={!!reduced} idBase={idRef.current} />
        ))}
      </svg>
    </div>
  );
}

function Strand({
  strand,
  progress,
  reduced,
  idBase,
}: {
  strand: Strand;
  progress: ReturnType<typeof useSpring>;
  reduced: boolean;
  idBase: string;
}) {
  const d = pathFor(strand);
  const travel = reduced ? 0 : strand.travel;
  const x = useTransform(progress, [0, 1], [-travel / 2, travel / 2]);
  const stroke = strand.tinted ? `url(#${idBase}-tint)` : `url(#${idBase}-plain)`;

  return (
    <motion.g style={{ x }}>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strand.width}
        strokeOpacity={strand.alpha}
        vectorEffect="non-scaling-stroke"
      />
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
