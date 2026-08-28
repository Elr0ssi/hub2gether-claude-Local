"use client";

import { motion } from "framer-motion";
import { useDeckReducedMotion, useInk, EASE, DUR, t } from "../primitives";

/**
 * SLIDE 11 — the editorial engine.
 *
 * Eight stages on one lit rail. Rather than a flowchart of boxes, the stages
 * are columns hanging off a single line, with data points travelling through
 * the whole run — the pipeline is shown as a movement, not as a structure.
 */

export function Pipeline({
  stages,
  startDelay = 0.4,
  /** Stages rendered with extra weight — where the argument lives. */
  emphasise = [],
  width = 1680,
}: {
  stages: readonly string[];
  startDelay?: number;
  emphasise?: readonly string[];
  width?: number;
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  const H = 420;
  const RAIL = 96;
  const colW = width / stages.length;

  const nodeX = (i: number) => colW * i + colW / 2;

  return (
    <div style={{ position: "relative", width, height: H }}>
      <svg
        viewBox={`0 0 ${width} ${H}`}
        width={width}
        height={H}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Rail */}
        <motion.line
          x1={nodeX(0)}
          y1={RAIL}
          x2={nodeX(stages.length - 1)}
          y2={RAIL}
          stroke={ink.rule}
          strokeWidth={1}
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.6, delay: startDelay, ease: EASE }}
        />
        <motion.line
          x1={nodeX(0)}
          y1={RAIL}
          x2={nodeX(stages.length - 1)}
          y2={RAIL}
          stroke="var(--accent)"
          strokeWidth={1.6}
          initial={reduced ? { opacity: 0.45 } : { pathLength: 0, opacity: 0.45 }}
          animate={reduced ? { opacity: 0.45 } : { pathLength: 1 }}
          transition={{ duration: 2.4, delay: startDelay + 0.4, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 9px rgba(57,255,136,0.4))" }}
        />

        {stages.map((s, i) => {
          const x = nodeX(i);
          const strong = emphasise.includes(s);
          return (
            <g key={`n-${s}`}>
              {/* Drop line to the label column */}
              <motion.line
                x1={x}
                y1={RAIL + 12}
                x2={x}
                y2={RAIL + 58}
                stroke={ink.rule}
                strokeWidth={1}
                initial={reduced ? undefined : { pathLength: 0 }}
                animate={reduced ? undefined : { pathLength: 1 }}
                transition={{
                  duration: 0.45,
                  delay: startDelay + 0.6 + i * 0.13,
                  ease: EASE,
                }}
              />
              <motion.circle
                cx={x}
                cy={RAIL}
                r={strong ? 8 : 5}
                fill={strong ? "var(--accent)" : ink.tone === "dark" ? "#0f0f0f" : "#fff"}
                stroke="var(--accent)"
                strokeWidth={strong ? 2.5 : 1.6}
                initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.42,
                  delay: startDelay + 0.5 + i * 0.13,
                  ease: EASE,
                }}
                style={{
                  transformOrigin: `${x}px ${RAIL}px`,
                  filter: strong
                    ? "drop-shadow(0 0 11px rgba(57,255,136,0.7))"
                    : undefined,
                }}
              />
              {/* Chevron between stages */}
              {i < stages.length - 1 && (
                <motion.path
                  d={`M ${x + colW / 2 - 5} ${RAIL - 5} L ${x + colW / 2 + 1} ${RAIL} L ${
                    x + colW / 2 - 5
                  } ${RAIL + 5}`}
                  fill="none"
                  stroke={ink.faint}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={reduced ? undefined : { opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: startDelay + 0.8 + i * 0.13,
                    ease: EASE,
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Data points running the whole pipeline */}
        {!reduced &&
          [0, 1, 2].map((k) => (
            <motion.circle
              key={`flux-${k}`}
              r={4}
              cy={RAIL}
              fill="var(--accent)"
              initial={{ cx: nodeX(0), opacity: 0 }}
              animate={{
                cx: [
                  nodeX(0),
                  nodeX(0) + (nodeX(stages.length - 1) - nodeX(0)) * 0.15,
                  nodeX(0) + (nodeX(stages.length - 1) - nodeX(0)) * 0.85,
                  nodeX(stages.length - 1),
                ],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 5.2,
                delay: startDelay + 2.4 + k * 1.5,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: "linear",
              }}
              style={{ filter: "drop-shadow(0 0 9px rgba(57,255,136,0.95))" }}
            />
          ))}
      </svg>

      {/* Stage labels */}
      {stages.map((s, i) => {
        const strong = emphasise.includes(s);
        return (
          <motion.div
            key={`l-${s}`}
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={t(DUR.quick, startDelay + 0.7 + i * 0.13)}
            style={{
              position: "absolute",
              left: colW * i,
              top: RAIL + 58,
              width: colW,
              padding: "0 14px",
              textAlign: "center",
            }}
          >
            <div
              className="t-index"
              style={{
                color: strong ? "var(--accent)" : ink.faint,
                marginBottom: 12,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              className="t-body"
              style={{
                color: strong ? ink.primary : ink.secondary,
                fontWeight: strong ? 800 : 600,
                lineHeight: 1.28,
                letterSpacing: "-0.005em",
              }}
            >
              {s}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
