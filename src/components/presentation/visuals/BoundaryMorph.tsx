"use client";

import { motion } from "framer-motion";
import { useDeckReducedMotion, useInk, EASE, DUR, t } from "../primitives";

/**
 * SLIDE 19 — the target model.
 *
 * Two zones — what gets automated, what stays human — separated by a boundary
 * that never stops moving. No percentages: the frontier is decided process by
 * process, and the drawing says exactly that.
 */

const W = 1660;
const H = 560;
const MID = W * 0.5;

/** Two structurally identical paths, so the `d` attribute can be interpolated. */
const SHAPE_A = `M ${MID} 0 C ${MID + 54} ${H * 0.24}, ${MID - 58} ${H * 0.52}, ${
  MID + 30
} ${H * 0.74} C ${MID + 62} ${H * 0.88}, ${MID - 20} ${H * 0.95}, ${MID} ${H}`;

const SHAPE_B = `M ${MID} 0 C ${MID - 48} ${H * 0.22}, ${MID + 66} ${H * 0.5}, ${
  MID - 34
} ${H * 0.72} C ${MID - 70} ${H * 0.86}, ${MID + 26} ${H * 0.94}, ${MID} ${H}`;

export function BoundaryMorph({
  left,
  right,
  startDelay = 0.4,
}: {
  left: { label: string; items: readonly string[] };
  right: { label: string; items: readonly string[] };
  startDelay?: number;
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      {/* Moving frontier */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      >
        <motion.path
          d={SHAPE_A}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          initial={
            reduced ? { opacity: 0.85 } : { pathLength: 0, opacity: 0.85 }
          }
          animate={
            reduced
              ? { opacity: 0.85 }
              : { pathLength: 1, d: [SHAPE_A, SHAPE_B, SHAPE_A] }
          }
          transition={{
            pathLength: { duration: 1.6, delay: startDelay, ease: EASE },
            d: {
              duration: 16,
              delay: startDelay + 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{ filter: "drop-shadow(0 0 14px rgba(57,255,136,0.45))" }}
        />
      </svg>

      {/* Zones */}
      {[
        { side: left, align: "flex-start" as const, x: 0 },
        { side: right, align: "flex-start" as const, x: MID + 96 },
      ].map(({ side, x }, i) => (
        <div
          key={side.label}
          style={{
            position: "absolute",
            left: x,
            top: 0,
            width: MID - 96,
            zIndex: 2,
          }}
        >
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={t(DUR.base, startDelay + 0.3 + i * 0.2)}
          >
            <div
              className="t-micro"
              style={{
                color: i === 0 ? "var(--accent)" : ink.muted,
                marginBottom: 14,
              }}
            >
              {i === 0 ? "Automatisation" : "Humain"}
            </div>
            <div
              className="t-h3"
              style={{
                color: ink.primary,
                lineHeight: 1.2,
                marginBottom: 30,
                maxWidth: 620,
              }}
            >
              {side.label}
            </div>
          </motion.div>

          <ul style={{ listStyle: "none", display: "grid", gap: 15 }}>
            {side.items.map((item, j) => (
              <motion.li
                key={item}
                initial={reduced ? undefined : { opacity: 0, x: i === 0 ? -12 : 12 }}
                animate={reduced ? undefined : { opacity: 1, x: 0 }}
                transition={t(DUR.quick, startDelay + 0.6 + i * 0.2 + j * 0.07)}
                className="t-lead"
                style={{
                  color: ink.secondary,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 2,
                    background: i === 0 ? "var(--accent)" : ink.faint,
                    flexShrink: 0,
                    transform: "translateY(-9px)",
                  }}
                />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
