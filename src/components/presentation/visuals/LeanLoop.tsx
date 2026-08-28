"use client";

import { motion } from "framer-motion";
import { useDeckReducedMotion, useInk, EASE, DUR, t, q } from "../primitives";

/**
 * SLIDE 16 — Build → Measure → Learn.
 *
 * The theoretical loop drawn as a continuous circuit rather than three boxes:
 * arcs carry the direction, a travelling point carries the fact that the loop
 * never stops. The fourth beat (Rebuild) is deliberately outside the circle —
 * it is where the project actually stands.
 */

const BOX = 520;
const C = BOX / 2;
const R = 178;

function polar(deg: number, r = R) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: q(C + Math.cos(rad) * r), y: q(C + Math.sin(rad) * r) };
}

/** Arc between two angles, trimmed at both ends so it never touches a node. */
function arc(fromDeg: number, toDeg: number, trim = 22) {
  const a = polar(fromDeg + trim);
  const b = polar(toDeg - trim);
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
}

export function LeanLoop({
  nodes,
  startDelay = 0.4,
}: {
  nodes: readonly string[];
  startDelay?: number;
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  const step = 360 / nodes.length;
  const angles = nodes.map((_, i) => i * step);

  return (
    <div style={{ position: "relative", width: BOX, height: BOX }}>
      <svg
        viewBox={`0 0 ${BOX} ${BOX}`}
        width={BOX}
        height={BOX}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Guide circle */}
        <circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke={ink.rule}
          strokeWidth={1}
        />

        {/* Directed arcs */}
        {angles.map((a, i) => {
          const next = angles[(i + 1) % angles.length];
          const to = next > a ? next : next + 360;
          const head = polar(to - 22);
          // Position uses angle (θ - 90); the tangent for increasing θ is
          // (-sin, cos) of that same angle.
          const th = ((to - 22 - 90) * Math.PI) / 180;
          const hx = q(-Math.sin(th));
          const hy = q(Math.cos(th));

          return (
            <g key={`arc-${i}`}>
              <motion.path
                d={arc(a, to)}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={
                  reduced ? { opacity: 0.75 } : { pathLength: 0, opacity: 0.75 }
                }
                animate={reduced ? { opacity: 0.75 } : { pathLength: 1 }}
                transition={{
                  duration: 0.9,
                  delay: startDelay + 0.5 + i * 0.28,
                  ease: EASE,
                }}
                style={{ filter: "drop-shadow(0 0 8px rgba(57,255,136,0.4))" }}
              />
              {/* Arrow head */}
              <motion.path
                d={`M ${q(head.x - hx * 11 - hy * 6.5)} ${q(
                  head.y - hy * 11 + hx * 6.5
                )} L ${head.x} ${head.y} L ${q(head.x - hx * 11 + hy * 6.5)} ${q(
                  head.y - hy * 11 - hx * 6.5
                )}`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{
                  duration: 0.35,
                  delay: startDelay + 1.2 + i * 0.28,
                  ease: EASE,
                }}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {angles.map((a, i) => {
          const p = polar(a);
          return (
            <motion.circle
              key={`node-${i}`}
              cx={p.x}
              cy={p.y}
              r={8}
              fill="var(--accent)"
              initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1 }}
              transition={{
                duration: 0.45,
                delay: startDelay + 0.35 + i * 0.28,
                ease: EASE,
              }}
              style={{
                transformOrigin: `${p.x}px ${p.y}px`,
                filter: "drop-shadow(0 0 10px rgba(57,255,136,0.7))",
              }}
            />
          );
        })}

        {/* The loop, running */}
        {!reduced && (
          <motion.g
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            transition={{
              rotate: {
                duration: 9,
                repeat: Infinity,
                ease: "linear",
                delay: startDelay + 1.8,
              },
              opacity: { duration: 0.6, delay: startDelay + 1.8 },
            }}
            style={{ transformOrigin: `${C}px ${C}px` }}
          >
            <circle
              cx={C}
              cy={C - R}
              r={4.5}
              fill="var(--accent)"
              style={{ filter: "drop-shadow(0 0 10px rgba(57,255,136,1))" }}
            />
          </motion.g>
        )}
      </svg>

      {/* Node labels */}
      {nodes.map((n, i) => {
        const p = polar(angles[i], R + 54);
        return (
          // Static wrapper centres the label on its node; framer-motion owns
          // `transform` on the animated child.
          <div
            key={n}
            style={{
              position: "absolute",
              left: p.x - 130,
              top: p.y - 24,
              width: 260,
              height: 48,
              display: "grid",
              placeItems: "center",
            }}
          >
          <motion.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.96 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={t(DUR.quick, startDelay + 0.45 + i * 0.28)}
            style={{ whiteSpace: "nowrap" }}
          >
            <span
              className="t-h3"
              style={{
                color: ink.primary,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {n}
            </span>
          </motion.div>
          </div>
        );
      })}

      {/* Centre caption */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={t(DUR.base, startDelay + 1.6)}
        style={{
          position: "absolute",
          left: C - 100,
          top: C - 24,
          width: 200,
          textAlign: "center",
        }}
      >
        <div className="t-micro" style={{ color: ink.faint }}>
          Boucle
        </div>
        <div
          className="t-micro accent"
          style={{ marginTop: 7 }}
        >
          En continu
        </div>
      </motion.div>
    </div>
  );
}
