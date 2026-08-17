"use client";

import { motion } from "framer-motion";
import { useDeckReducedMotion, useInk, EASE, DUR, t, Rise } from "../primitives";

/**
 * SLIDE 18 — the automation paradox.
 *
 * A balance whose two pans are fed by the same cause: the gains of automation
 * and its risks. The apparatus settles from tilted into level, and the fulcrum
 * — the thing that holds the equilibrium — is labelled Trust.
 */

const W = 1560;
const H = 470;

const PIVOT_X = W / 2;
const BEAM_Y = 122;
const ARM = 470;
const PAN_DROP = 74;
const PAN_HALF = 92;

export function BalanceTension({
  gains,
  risks,
  fulcrum,
  startDelay = 0.4,
}: {
  gains: { label: string; items: readonly string[] };
  risks: { label: string; items: readonly string[] };
  fulcrum: string;
  startDelay?: number;
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  const leftX = PIVOT_X - ARM;
  const rightX = PIVOT_X + ARM;
  const panY = BEAM_Y + PAN_DROP;

  const pan = (x: number) =>
    `M ${x - PAN_HALF} ${panY} L ${x + PAN_HALF} ${panY}`;

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Column + fulcrum */}
        <motion.path
          d={`M ${PIVOT_X - 46} ${BEAM_Y + 168} L ${PIVOT_X} ${BEAM_Y + 16} L ${
            PIVOT_X + 46
          } ${BEAM_Y + 168} Z`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.6}
          initial={reduced ? { opacity: 0.6 } : { pathLength: 0, opacity: 0.6 }}
          animate={reduced ? { opacity: 0.6 } : { pathLength: 1 }}
          transition={{ duration: 1.1, delay: startDelay + 0.2, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 12px rgba(57,255,136,0.32))" }}
        />
        <motion.line
          x1={PIVOT_X - 80}
          y1={BEAM_Y + 168}
          x2={PIVOT_X + 80}
          y2={BEAM_Y + 168}
          stroke={ink.rule}
          strokeWidth={1}
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: 1 }}
          transition={{ duration: 0.7, delay: startDelay + 0.6, ease: EASE }}
        />

        {/* Beam assembly — settles into balance */}
        <motion.g
          initial={reduced ? undefined : { rotate: -3.4 }}
          animate={reduced ? undefined : { rotate: 0 }}
          transition={{ duration: 2.2, delay: startDelay + 0.9, ease: EASE }}
          style={{ transformOrigin: `${PIVOT_X}px ${BEAM_Y}px` }}
        >
          {/* Beam */}
          <motion.line
            x1={leftX}
            y1={BEAM_Y}
            x2={rightX}
            y2={BEAM_Y}
            stroke={ink.primary}
            strokeWidth={2}
            strokeLinecap="round"
            initial={reduced ? undefined : { pathLength: 0 }}
            animate={reduced ? undefined : { pathLength: 1 }}
            transition={{ duration: 1.2, delay: startDelay + 0.4, ease: EASE }}
          />

          {/* Hangers + pans */}
          {[leftX, rightX].map((x, i) => (
            <g key={`pan-${i}`}>
              <motion.line
                x1={x}
                y1={BEAM_Y}
                x2={x - PAN_HALF}
                y2={panY}
                stroke={ink.rule}
                strokeWidth={1}
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: startDelay + 1 + i * 0.1,
                  ease: EASE,
                }}
              />
              <motion.line
                x1={x}
                y1={BEAM_Y}
                x2={x + PAN_HALF}
                y2={panY}
                stroke={ink.rule}
                strokeWidth={1}
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: startDelay + 1 + i * 0.1,
                  ease: EASE,
                }}
              />
              <motion.path
                d={pan(x)}
                fill="none"
                stroke={i === 0 ? "var(--accent)" : ink.primary}
                strokeWidth={2.4}
                strokeLinecap="round"
                initial={reduced ? undefined : { pathLength: 0 }}
                animate={reduced ? undefined : { pathLength: 1 }}
                transition={{
                  duration: 0.6,
                  delay: startDelay + 1.15 + i * 0.1,
                  ease: EASE,
                }}
              />
              {/* Pivot pin */}
              <circle cx={x} cy={BEAM_Y} r={3.5} fill={ink.primary} />
            </g>
          ))}

          {/* Central pin */}
          <circle
            cx={PIVOT_X}
            cy={BEAM_Y}
            r={7}
            fill="var(--accent)"
            style={{ filter: "drop-shadow(0 0 12px rgba(57,255,136,0.8))" }}
          />
        </motion.g>
      </svg>

      {/* Pan labels */}
      {[
        { side: gains, x: leftX, accent: true },
        { side: risks, x: rightX, accent: false },
      ].map(({ side, x, accent }, i) => (
        // Static wrapper carries the horizontal centring: framer-motion owns
        // `transform` on the element it animates.
        <div
          key={side.label}
          style={{
            position: "absolute",
            left: x - 230,
            top: panY + 26,
            width: 460,
          }}
        >
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={t(DUR.base, startDelay + 2.4 + i * 0.18)}
          style={{ width: "100%", textAlign: "center" }}
        >
          <div
            className="t-h3"
            style={{
              color: accent ? "var(--accent)" : ink.primary,
              marginBottom: 18,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            {side.label}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "9px 10px",
              justifyContent: "center",
            }}
          >
            {side.items.map((item, j) => (
              <motion.span
                key={item}
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={t(DUR.quick, startDelay + 2.6 + i * 0.18 + j * 0.06)}
                className="t-small"
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  border: `1px solid ${ink.rule}`,
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
        </div>
      ))}

      {/* Fulcrum label */}
      <div
        style={{
          position: "absolute",
          left: PIVOT_X - 220,
          top: BEAM_Y + 196,
          width: 440,
        }}
      >
        <Rise delay={startDelay + 1.9} y={10}>
          <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <div
            className="t-h2 accent"
            style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}
          >
            {fulcrum}
          </div>
            <div className="t-micro" style={{ color: ink.faint, marginTop: 10 }}>
              Point d&apos;équilibre
            </div>
          </div>
        </Rise>
      </div>
    </div>
  );
}
