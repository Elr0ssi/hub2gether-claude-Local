"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useDeckReducedMotion, useTone, EASE, q } from "../primitives";
import type { Act } from "@/data/presentation/presentationData";

/**
 * THE RECURRING MOTIF — a field of data points that becomes progressively more
 * connected as the presentation advances.
 *
 *   Act 1  fragmented   · isolated points, no links
 *   Act 2  connecting   · short links appear between neighbours
 *   Act 3  structured   · directed flows, particles travelling left → right
 *   Act 4  coherent     · every point resolves toward a single centre
 *
 * Rendered as a low-opacity SVG backdrop behind the slide content. Deterministic
 * point placement (seeded PRNG) so server and client markup always agree.
 */

const W = 1920;
const H = 1080;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Point {
  x: number;
  y: number;
  r: number;
}

interface Edge {
  a: Point;
  b: Point;
  /** 0 → 1, how "settled" the link is; drives opacity. */
  weight: number;
}

const COUNTS: Record<Act, number> = { 1: 46, 2: 54, 3: 62, 4: 70 };

function buildField(act: Act, seed: number) {
  const rand = mulberry32(seed + act * 977);
  const count = COUNTS[act];
  const points: Point[] = [];

  const cx = W * 0.5;
  const cy = H * 0.5;

  for (let i = 0; i < count; i++) {
    if (act === 4) {
      // Coherent: points arranged in loose concentric rings around the centre.
      const ring = 0.34 + (i % 4) * 0.16;
      const angle = rand() * Math.PI * 2;
      const jitter = 0.9 + rand() * 0.2;
      points.push({
        x: q(cx + Math.cos(angle) * ring * W * 0.52 * jitter),
        y: q(cy + Math.sin(angle) * ring * H * 0.62 * jitter),
        r: q(1.4 + rand() * 1.8),
      });
    } else if (act === 3) {
      // Structured: banded lattice — reads as a pipeline substrate.
      const band = Math.floor(i / (count / 6));
      points.push({
        x: q(60 + rand() * (W - 120)),
        y: q(110 + band * ((H - 220) / 5) + (rand() - 0.5) * 70),
        r: q(1.3 + rand() * 1.6),
      });
    } else {
      // Fragmented / connecting: free scatter, biased away from the centre so
      // the composition stays readable behind large type.
      const x = rand() * W;
      const y = rand() * H;
      const dxN = (x - cx) / cx;
      const dyN = (y - cy) / cy;
      const dist = Math.sqrt(dxN * dxN + dyN * dyN);
      if (dist < 0.42 && rand() < 0.72) {
        i--;
        continue;
      }
      points.push({ x: q(x), y: q(y), r: q(1.2 + rand() * 2.1) });
    }
  }

  // ── Edges ───────────────────────────────────────────────────────────────
  const edges: Edge[] = [];

  if (act === 2) {
    // Nearest-neighbour links, sparse.
    for (let i = 0; i < points.length; i++) {
      let best = -1;
      let bestD = Infinity;
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const d =
          (points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (best >= 0 && bestD < 240 ** 2 && rand() < 0.55) {
        edges.push({ a: points[i], b: points[best], weight: 0.5 });
      }
    }
  } else if (act === 3) {
    // Directed horizontal flows within each band.
    const sorted = [...points].sort((m, n) => m.y - n.y || m.x - n.x);
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (Math.abs(a.y - b.y) < 80 && b.x > a.x) {
        edges.push({ a, b, weight: 0.75 });
      }
    }
  } else if (act === 4) {
    // Everything resolves toward the centre.
    const hub: Point = { x: cx, y: cy, r: 0 };
    for (const p of points) {
      if (rand() < 0.62) edges.push({ a: p, b: hub, weight: 0.85 });
    }
  }

  return { points, edges };
}

interface FlowFieldProps {
  act: Act;
  /** Change to reshuffle the field between slides of the same act. */
  seed?: number;
  /** Global opacity multiplier — lower it behind dense compositions. */
  intensity?: number;
  /** Number of accent particles travelling along the edges. */
  particles?: number;
}

export function FlowField({
  act,
  seed = 7,
  intensity = 1,
  particles = 0,
}: FlowFieldProps) {
  const reduced = useDeckReducedMotion();
  const tone = useTone();
  const { points, edges } = useMemo(() => buildField(act, seed), [act, seed]);

  const dotColor = tone === "dark" ? "#ffffff" : "#0a0a0a";
  const lineColor = tone === "dark" ? "#ffffff" : "#0a0a0a";
  const dotOpacity = (tone === "dark" ? 0.3 : 0.2) * intensity;
  const lineOpacity = (tone === "dark" ? 0.13 : 0.09) * intensity;

  // Longest edges make the most legible particle tracks.
  const particleEdges = useMemo(() => {
    if (particles <= 0 || edges.length === 0) return [];
    return [...edges]
      .sort(
        (e1, e2) =>
          (e2.b.x - e2.a.x) ** 2 +
          (e2.b.y - e2.a.y) ** 2 -
          ((e1.b.x - e1.a.x) ** 2 + (e1.b.y - e1.a.y) ** 2)
      )
      .slice(0, particles);
  }, [edges, particles]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {/* Links */}
      <g>
        {edges.map((e, i) => (
          <motion.line
            key={`e-${i}`}
            x1={e.a.x}
            y1={e.a.y}
            x2={e.b.x}
            y2={e.b.y}
            stroke={lineColor}
            strokeWidth={0.8}
            initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
            animate={
              reduced
                ? undefined
                : { pathLength: 1, opacity: lineOpacity * e.weight }
            }
            transition={{
              duration: 1.1,
              delay: 0.25 + (i % 14) * 0.045,
              ease: EASE,
            }}
            style={
              reduced ? { opacity: lineOpacity * e.weight } : undefined
            }
          />
        ))}
      </g>

      {/* Points */}
      <g>
        {points.map((p, i) => (
          <motion.circle
            key={`p-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={dotColor}
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: dotOpacity }}
            transition={{
              duration: 0.8,
              delay: (i % 18) * 0.035,
              ease: EASE,
            }}
            style={reduced ? { opacity: dotOpacity } : undefined}
          />
        ))}
      </g>

      {/* Accent particles travelling along the flows */}
      {!reduced &&
        particleEdges.map((e, i) => (
          <motion.circle
            key={`fp-${i}`}
            r={2.6}
            fill="var(--accent)"
            initial={{ cx: e.a.x, cy: e.a.y, opacity: 0 }}
            animate={{
              // Equal-length keyframe arrays: the particle travels linearly
              // while its opacity fades in and out at the ends of the track.
              cx: [
                e.a.x,
                e.a.x + (e.b.x - e.a.x) * 0.2,
                e.a.x + (e.b.x - e.a.x) * 0.8,
                e.b.x,
              ],
              cy: [
                e.a.y,
                e.a.y + (e.b.y - e.a.y) * 0.2,
                e.a.y + (e.b.y - e.a.y) * 0.8,
                e.b.y,
              ],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: 3.4 + (i % 4) * 0.7,
              delay: 0.8 + i * 0.55,
              repeat: Infinity,
              repeatDelay: 1.1,
              ease: "linear",
            }}
          />
        ))}
    </svg>
  );
}
