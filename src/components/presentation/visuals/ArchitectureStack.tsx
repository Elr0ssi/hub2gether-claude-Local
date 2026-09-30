"use client";

import { motion } from "framer-motion";
import { useDeckReducedMotion, useInk, EASE, DUR, t } from "../primitives";

/**
 * SLIDE 15 — target architecture.
 *
 * Six layers read top-to-bottom as a system map: a lit spine on the left, each
 * layer a row hanging off it, its components as inline chips. Data descends the
 * spine continuously so the stack reads as live infrastructure.
 */

interface Layer {
  index: string;
  title: string;
  items: readonly string[];
}

export function ArchitectureStack({
  layers,
  startDelay = 0.4,
  /** Titles drawn with accent emphasis. */
  emphasise = [],
}: {
  layers: readonly Layer[];
  startDelay?: number;
  emphasise?: readonly string[];
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  const ROW_H = 134;
  const SPINE_X = 26;
  const totalH = ROW_H * layers.length;

  return (
    <div style={{ position: "relative", width: "100%", height: totalH }}>
      {/* Spine */}
      <svg
        viewBox={`0 0 ${60} ${totalH}`}
        width={60}
        height={totalH}
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <motion.line
          x1={SPINE_X}
          y1={ROW_H / 2}
          x2={SPINE_X}
          y2={totalH - ROW_H / 2}
          stroke={ink.rule}
          strokeWidth={1}
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.5, delay: startDelay, ease: EASE }}
        />
        <motion.line
          x1={SPINE_X}
          y1={ROW_H / 2}
          x2={SPINE_X}
          y2={totalH - ROW_H / 2}
          stroke="var(--accent)"
          strokeWidth={1.6}
          initial={reduced ? { opacity: 0.4 } : { pathLength: 0, opacity: 0.4 }}
          animate={reduced ? { opacity: 0.4 } : { pathLength: 1 }}
          transition={{ duration: 2.2, delay: startDelay + 0.4, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 8px rgba(57,255,136,0.4))" }}
        />

        {/* Descending data points */}
        {!reduced &&
          [0, 1].map((k) => (
            <motion.circle
              key={`d-${k}`}
              cx={SPINE_X}
              r={3.6}
              fill="var(--accent)"
              initial={{ cy: ROW_H / 2, opacity: 0 }}
              animate={{
                cy: [
                  ROW_H / 2,
                  ROW_H / 2 + (totalH - ROW_H) * 0.15,
                  ROW_H / 2 + (totalH - ROW_H) * 0.85,
                  totalH - ROW_H / 2,
                ],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4.6,
                delay: startDelay + 2.2 + k * 2.1,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: "linear",
              }}
              style={{ filter: "drop-shadow(0 0 8px rgba(57,255,136,0.9))" }}
            />
          ))}
      </svg>

      {/* Layers */}
      {layers.map((layer, i) => {
        const strong = emphasise.includes(layer.title);
        return (
          <motion.div
            key={layer.index}
            initial={reduced ? undefined : { opacity: 0, x: 22 }}
            animate={reduced ? undefined : { opacity: 1, x: 0 }}
            transition={t(DUR.base, startDelay + 0.5 + i * 0.13)}
            style={{
              position: "absolute",
              left: 0,
              top: i * ROW_H,
              width: "100%",
              height: ROW_H,
              display: "grid",
              gridTemplateColumns: "60px 118px 300px 1fr",
              alignItems: "center",
              gap: 0,
              borderTop: `1px solid ${ink.rule}`,
              background: strong
                ? ink.tone === "dark"
                  ? "rgba(57,255,136,0.045)"
                  : "rgba(57,255,136,0.035)"
                : "transparent",
            }}
          >
            {/* Node on the spine */}
            <div style={{ position: "relative", height: "100%" }}>
              <span
                style={{
                  position: "absolute",
                  left: SPINE_X,
                  top: "50%",
                  width: strong ? 13 : 8,
                  height: strong ? 13 : 8,
                  borderRadius: "50%",
                  background: strong
                    ? "var(--accent)"
                    : ink.tone === "dark"
                    ? "#0f0f0f"
                    : "#fff",
                  border: `1.8px solid var(--accent)`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: strong
                    ? "0 0 14px rgba(57,255,136,0.7)"
                    : undefined,
                }}
              />
            </div>

            {/* Layer number */}
            <div
              className="t-micro"
              style={{ color: strong ? "var(--accent)" : ink.faint }}
            >
              Layer {layer.index}
            </div>

            {/* Layer title */}
            <div
              className="t-h3"
              style={{
                color: ink.primary,
                fontWeight: strong ? 900 : 800,
              }}
            >
              {layer.title}
            </div>

            {/* Components */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "9px 10px",
                paddingLeft: 12,
              }}
            >
              {layer.items.map((item, j) => (
                <motion.span
                  key={item}
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={reduced ? undefined : { opacity: 1 }}
                  transition={t(
                    DUR.quick,
                    startDelay + 0.7 + i * 0.13 + j * 0.05
                  )}
                  className="t-small"
                  style={{
                    padding: "7px 15px",
                    borderRadius: 8,
                    border: `1px solid ${ink.rule}`,
                    background:
                      ink.tone === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "#fff",
                    color: ink.secondary,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
