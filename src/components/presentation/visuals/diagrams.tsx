"use client";

import { motion } from "framer-motion";
import {
  useDeckReducedMotion,
  useInk,
  EASE,
  DUR,
  Rise,
  t,
} from "../primitives";

/* ═══════════════════════════════════════════════════════════════════════════
   VALUE CHAIN — slide 04
   A single horizontal flow, not a box-and-arrow diagram. The accent line is
   the argument; the labels hang off it.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ValueChain({
  steps,
  startDelay = 0.4,
}: {
  steps: readonly string[];
  startDelay?: number;
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  const W = 1560;
  const H = 260;
  const BASE = 168;
  // Label boxes are positioned with left/width rather than translate(-50%):
  // framer-motion owns `transform` on the elements it animates and would
  // overwrite a static translate. first/last are inset by half a label so
  // every box centres exactly on its node without needing to be clamped.
  const labelW = 340;
  const first = 190;
  const last = W - 170;
  const gap = (last - first) / (steps.length - 1);
  const labelLeft = (x: number) => x - labelW / 2;

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Base rail */}
        <motion.line
          x1={first}
          y1={BASE}
          x2={last}
          y2={BASE}
          stroke={ink.rule}
          strokeWidth={1}
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.4, delay: startDelay, ease: EASE }}
        />

        {/* Accent overlay — draws through the whole chain */}
        <motion.line
          x1={first}
          y1={BASE}
          x2={last}
          y2={BASE}
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          initial={reduced ? { opacity: 0.9 } : { pathLength: 0, opacity: 0.9 }}
          animate={reduced ? { opacity: 0.9 } : { pathLength: 1 }}
          transition={{ duration: 2.2, delay: startDelay + 0.5, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 10px rgba(57,255,136,0.5))" }}
        />

        {/* Nodes */}
        {steps.map((s, i) => {
          const x = first + i * gap;
          const isLast = i === steps.length - 1;
          return (
            <g key={`n-${s}`}>
              <motion.circle
                cx={x}
                cy={BASE}
                r={isLast ? 9 : 5.5}
                fill={isLast ? "var(--accent)" : ink.tone === "dark" ? "#0a0a0a" : "#fff"}
                stroke="var(--accent)"
                strokeWidth={2}
                initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: startDelay + 0.7 + i * 0.42,
                  ease: EASE,
                }}
                style={{ transformOrigin: `${x}px ${BASE}px` }}
              />
              {/* Tick up to the label */}
              <motion.line
                x1={x}
                y1={BASE - 14}
                x2={x}
                y2={BASE - 44}
                stroke={ink.rule}
                strokeWidth={1}
                initial={reduced ? undefined : { pathLength: 0 }}
                animate={reduced ? undefined : { pathLength: 1 }}
                transition={{
                  duration: 0.5,
                  delay: startDelay + 0.8 + i * 0.42,
                  ease: EASE,
                }}
              />
            </g>
          );
        })}

        {/* Travelling data point */}
        {!reduced && (
          <motion.circle
            r={4}
            cy={BASE}
            fill="var(--accent)"
            initial={{ cx: first, opacity: 0 }}
            animate={{
              cx: [first, first + (last - first) * 0.2, first + (last - first) * 0.8, last],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3.6,
              delay: startDelay + 2.6,
              repeat: Infinity,
              repeatDelay: 1.4,
              ease: "linear",
            }}
            style={{ filter: "drop-shadow(0 0 8px rgba(57,255,136,0.9))" }}
          />
        )}
      </svg>

      {/* Labels */}
      {steps.map((s, i) => {
        const x = first + i * gap;
        const isLast = i === steps.length - 1;
        return (
          <motion.div
            key={`lbl-${s}`}
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={t(DUR.quick, startDelay + 0.9 + i * 0.42)}
            style={{
              position: "absolute",
              left: labelLeft(x),
              top: 0,
              width: labelW,
              height: BASE - 44,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              textAlign: "center",
            }}
          >
            <div
              className="t-index"
              style={{ color: ink.faint, marginBottom: 8 }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              className="t-h3"
              style={{
                color: isLast ? ink.primary : ink.secondary,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
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

/* ═══════════════════════════════════════════════════════════════════════════
   SOURCE NETWORK — slide 10
   Five source families are gathered into one node, then out into a single
   structured analysis. The point of the drawing is the gathering, so the
   inbound curves carry the accent, not the boxes.
   ═══════════════════════════════════════════════════════════════════════════ */

export function SourceNetwork({
  sources,
  hub,
  output,
  startDelay = 0.4,
}: {
  sources: readonly string[];
  hub: string;
  output: string;
  startDelay?: number;
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  const W = 1620;
  const H = 560;
  const CY = H / 2;

  const labelRight = 360; // where source labels end
  const hubX = 830;
  const hubW = 300;
  const outX = hubX + hubW / 2 + 210;

  const rowTop = 46;
  const rowGap = (H - rowTop * 2) / (sources.length - 1);

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        {sources.map((s, i) => {
          const y = rowTop + i * rowGap;
          const d = `M ${labelRight} ${y} L ${labelRight + 130} ${y} Q ${
            hubX - hubW / 2 - 40
          } ${y} ${hubX - hubW / 2 - 6} ${CY}`;
          return (
            <motion.path
              key={`p-${s}`}
              d={d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.4}
              initial={reduced ? { opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
              animate={
                reduced ? { opacity: 0.4 } : { pathLength: 1, opacity: 0.42 }
              }
              transition={{
                duration: 1.1,
                delay: startDelay + 0.7 + i * 0.14,
                ease: EASE,
              }}
            />
          );
        })}

        {/* Hub → output */}
        <motion.line
          x1={hubX + hubW / 2 + 6}
          y1={CY}
          x2={outX - 16}
          y2={CY}
          stroke="var(--accent)"
          strokeWidth={2}
          initial={reduced ? { opacity: 0.8 } : { pathLength: 0, opacity: 0.8 }}
          animate={reduced ? { opacity: 0.8 } : { pathLength: 1 }}
          transition={{ duration: 0.7, delay: startDelay + 1.7, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 8px rgba(57,255,136,0.45))" }}
        />
        <motion.path
          d={`M ${outX - 26} ${CY - 7} L ${outX - 12} ${CY} L ${outX - 26} ${CY + 7}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 0.4, delay: startDelay + 2.3, ease: EASE }}
        />

        {/* Particles converging on the hub */}
        {!reduced &&
          sources.map((s, i) => {
            const y = rowTop + i * rowGap;
            return (
              <motion.circle
                key={`fp-${s}`}
                r={3}
                fill="var(--accent)"
                initial={{ cx: labelRight, cy: y, opacity: 0 }}
                animate={{
                  cx: [labelRight, labelRight + 140, hubX - hubW / 2 - 40, hubX - hubW / 2 - 6],
                  cy: [y, y, y + (CY - y) * 0.55, CY],
                  opacity: [0, 0.95, 0.95, 0],
                }}
                transition={{
                  duration: 2.6,
                  delay: startDelay + 2.4 + i * 0.34,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: "linear",
                }}
              />
            );
          })}
      </svg>

      {/* Source labels */}
      {sources.map((s, i) => {
        const y = rowTop + i * rowGap;
        return (
          <div
            key={`l-${s}`}
            style={{
              position: "absolute",
              left: 0,
              top: y - 18,
              height: 36,
              width: labelRight - 18,
            }}
          >
            <motion.div
              initial={reduced ? undefined : { opacity: 0, x: -14 }}
              animate={reduced ? undefined : { opacity: 1, x: 0 }}
              transition={t(DUR.quick, startDelay + i * 0.11)}
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
            <span
              className="t-body"
              style={{ color: ink.secondary, textAlign: "right", fontWeight: 500 }}
            >
              {s}
            </span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  flexShrink: 0,
                  boxShadow: "0 0 8px rgba(57,255,136,0.6)",
                }}
              />
            </motion.div>
          </div>
        );
      })}

      {/* Hub */}
      <div
        style={{
          position: "absolute",
          left: hubX - hubW / 2,
          top: CY - 52,
          width: hubW,
          height: 104,
        }}
      >
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.94 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={t(DUR.base, startDelay + 1.2)}
          style={{
            height: "100%",
            display: "grid",
            placeItems: "center",
            padding: "0 22px",
            borderRadius: 14,
            textAlign: "center",
            background: ink.tone === "dark" ? "rgba(255,255,255,0.05)" : "#fff",
            border: "1px solid rgba(57,255,136,0.42)",
            boxShadow:
              ink.tone === "dark"
                ? "0 0 34px rgba(57,255,136,0.14)"
                : "0 6px 30px rgba(0,0,0,0.07), 0 0 26px rgba(57,255,136,0.1)",
          }}
        >
          <div className="t-h3" style={{ color: ink.primary }}>
            {hub}
          </div>
        </motion.div>
      </div>

      {/* Output */}
      <div
        style={{
          position: "absolute",
          left: outX,
          top: CY - 44,
          height: 88,
          width: W - outX,
        }}
      >
        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: 14 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={t(DUR.base, startDelay + 2.2)}
          style={{ height: "100%", display: "flex", alignItems: "center" }}
        >
          <div className="t-h3" style={{ color: ink.primary, lineHeight: 1.15 }}>
            {output}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP RAIL — slide 07 (concept → produit) and slide 17 (vision → V2)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface RailStep {
  index?: string;
  label: string;
  state?: "done" | "current" | "next";
}

export function StepRail({
  steps,
  startDelay = 0.4,
  currentCaption,
  width = 1660,
}: {
  steps: readonly RailStep[];
  startDelay?: number;
  /** Emphasis line rendered under the `current` step. */
  currentCaption?: string;
  width?: number;
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  const H = 300;
  const BASE = 120;
  const labelW = 240;
  const first = labelW / 2;
  const last = width - labelW / 2;
  const gap = (last - first) / (steps.length - 1);
  const labelLeft = (x: number) =>
    Math.min(Math.max(x - labelW / 2, 0), width - labelW);

  return (
    <div style={{ position: "relative", width, height: H }}>
      <svg
        viewBox={`0 0 ${width} ${H}`}
        width={width}
        height={H}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        <motion.line
          x1={first}
          y1={BASE}
          x2={last}
          y2={BASE}
          stroke={ink.rule}
          strokeWidth={1}
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.5, delay: startDelay, ease: EASE }}
        />

        {steps.map((s, i) => {
          const x = first + i * gap;
          const isCurrent = s.state === "current";
          const done = s.state === "done";

          // Accent segment covering the completed span.
          const nextX = first + (i + 1) * gap;
          return (
            <g key={`s-${s.label}`}>
              {done && i < steps.length - 1 && (
                <motion.line
                  x1={x}
                  y1={BASE}
                  x2={nextX}
                  y2={BASE}
                  stroke="var(--accent)"
                  strokeWidth={1.6}
                  initial={reduced ? { opacity: 0.5 } : { pathLength: 0, opacity: 0.5 }}
                  animate={reduced ? { opacity: 0.5 } : { pathLength: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: startDelay + 0.5 + i * 0.16,
                    ease: EASE,
                  }}
                />
              )}
              <motion.circle
                cx={x}
                cy={BASE}
                r={isCurrent ? 11 : 5}
                fill={
                  isCurrent
                    ? "var(--accent)"
                    : done
                    ? "var(--accent)"
                    : ink.tone === "dark"
                    ? "#141414"
                    : "#fff"
                }
                stroke={isCurrent || done ? "var(--accent)" : ink.rule}
                strokeWidth={isCurrent ? 3 : 1.5}
                initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: startDelay + 0.35 + i * 0.16,
                  ease: EASE,
                }}
                style={{
                  transformOrigin: `${x}px ${BASE}px`,
                  filter: isCurrent
                    ? "drop-shadow(0 0 12px rgba(57,255,136,0.75))"
                    : undefined,
                }}
              />
              {isCurrent && !reduced && (
                <motion.circle
                  cx={x}
                  cy={BASE}
                  r={11}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 0.6, 0], scale: [1, 2.4, 3] }}
                  transition={{
                    duration: 2.4,
                    delay: startDelay + 1.4,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    ease: "easeOut",
                  }}
                  style={{ transformOrigin: `${x}px ${BASE}px` }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Labels — alternating above / below to keep long names readable */}
      {steps.map((s, i) => {
        const x = first + i * gap;
        const isCurrent = s.state === "current";
        const above = i % 2 === 0;

        return (
          <motion.div
            key={`l-${s.label}`}
            initial={reduced ? undefined : { opacity: 0, y: above ? 10 : -10 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={t(DUR.quick, startDelay + 0.45 + i * 0.16)}
            style={{
              position: "absolute",
              left: labelLeft(x),
              top: above ? 0 : BASE + 34,
              height: above ? BASE - 34 : undefined,
              width: labelW,
              display: "flex",
              flexDirection: "column",
              justifyContent: above ? "flex-end" : "flex-start",
              textAlign: "center",
            }}
          >
            {s.index && (
              <div
                className="t-index"
                style={{
                  color: isCurrent ? "var(--accent)" : ink.faint,
                  marginBottom: 6,
                }}
              >
                {s.index}
              </div>
            )}
            <div
              className="t-small"
              style={{
                color: isCurrent ? ink.primary : ink.secondary,
                fontWeight: isCurrent ? 800 : 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                lineHeight: 1.3,
              }}
            >
              {s.label}
            </div>
            {isCurrent && currentCaption && (
              <div
                className="t-eyebrow accent"
                style={{ marginTop: 9, whiteSpace: "nowrap" }}
              >
                {currentCaption}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHASE LADDER — slide 21
   ═══════════════════════════════════════════════════════════════════════════ */

export function PhaseLadder({
  phases,
  startDelay = 0.4,
}: {
  phases: readonly { index: string; label: string; state: string }[];
  startDelay?: number;
}) {
  const ink = useInk();

  const STATE_LABEL: Record<string, string> = {
    done: "✓",
    current: "En cours",
    next: "À venir",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${phases.length}, 1fr)`,
        gap: 2,
        width: "100%",
      }}
    >
      {phases.map((p, i) => {
        const isCurrent = p.state === "current";
        const isDone = p.state === "done";

        return (
          <Rise key={p.index} delay={startDelay + i * 0.11} y={20}>
            <div
              style={{
                position: "relative",
                padding: "34px 26px 30px",
                height: 300,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: isCurrent
                  ? ink.tone === "dark"
                    ? "rgba(57,255,136,0.07)"
                    : "rgba(57,255,136,0.055)"
                  : "transparent",
                borderTop: `2px solid ${
                  isDone || isCurrent ? "var(--accent)" : ink.rule
                }`,
                borderLeft: i === 0 ? "none" : `1px solid ${ink.rule}`,
              }}
            >
              <div>
                <div
                  className="t-micro"
                  style={{ color: ink.faint, marginBottom: 16 }}
                >
                  {p.index}
                </div>
                <div
                  className="t-h3"
                  style={{
                    color: isCurrent ? ink.primary : isDone ? ink.secondary : ink.muted,
                    lineHeight: 1.14,
                  }}
                >
                  {p.label}
                </div>
              </div>

              <div
                className="t-eyebrow"
                style={{
                  color: isCurrent
                    ? "var(--accent)"
                    : isDone
                    ? ink.muted
                    : ink.faint,
                }}
              >
                {isDone ? (
                  <span style={{ fontSize: 22, lineHeight: 1 }}>
                    {STATE_LABEL.done}
                  </span>
                ) : (
                  STATE_LABEL[p.state]
                )}
              </div>

              {isCurrent && (
                <span
                  className="accent-rule"
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    height: 2,
                  }}
                />
              )}
            </div>
          </Rise>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HORIZON ROADMAP — slide 24
   ═══════════════════════════════════════════════════════════════════════════ */

export function HorizonRoadmap({
  horizons,
  startDelay = 0.4,
}: {
  horizons: readonly { horizon: string; items: readonly string[] }[];
  startDelay?: number;
}) {
  const ink = useInk();
  const reduced = useDeckReducedMotion();

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Continuous rail behind the four horizons */}
      <div style={{ position: "relative", height: 1, marginBottom: 46 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: ink.rule,
          }}
        />
        <motion.div
          className="accent-rule"
          initial={reduced ? undefined : { scaleX: 0 }}
          animate={reduced ? undefined : { scaleX: 1 }}
          transition={{ duration: 1.6, delay: startDelay, ease: EASE }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "50%",
            height: 1,
            transformOrigin: "left center",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${horizons.length}, 1fr)`,
          gap: 56,
        }}
      >
        {horizons.map((h, i) => {
          const committed = i < 2;
          return (
            <Rise key={h.horizon} delay={startDelay + 0.2 + i * 0.14} y={22}>
              <div style={{ position: "relative" }}>
                {/* Node on the rail */}
                <span
                  style={{
                    position: "absolute",
                    top: -52,
                    left: 0,
                    width: committed ? 11 : 7,
                    height: committed ? 11 : 7,
                    borderRadius: "50%",
                    background: committed ? "var(--accent)" : "transparent",
                    border: committed
                      ? "none"
                      : `1.5px solid ${ink.faint}`,
                    boxShadow: committed
                      ? "0 0 12px rgba(57,255,136,0.6)"
                      : undefined,
                    transform: "translateY(-50%)",
                  }}
                />
                <div
                  className="t-h2"
                  style={{
                    color: committed ? ink.primary : ink.muted,
                    marginBottom: 26,
                  }}
                >
                  {h.horizon}
                </div>
                <ul style={{ listStyle: "none", display: "grid", gap: 13 }}>
                  {h.items.map((item) => (
                    <li
                      key={item}
                      className="t-body"
                      style={{
                        color: committed ? ink.secondary : ink.muted,
                        display: "flex",
                        alignItems: "baseline",
                        gap: 11,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 2,
                          background: committed ? "var(--accent)" : ink.faint,
                          flexShrink: 0,
                          transform: "translateY(-6px)",
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>
          );
        })}
      </div>
    </div>
  );
}
