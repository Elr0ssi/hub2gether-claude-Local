"use client";

import { motion } from "framer-motion";
import { useDeckReducedMotion, useInk, EASE, DUR, t, q } from "../primitives";
import type {
  BenchmarkRow,
  TrajectoryPoint,
} from "@/data/presentation/presentationData";

/* ═══════════════════════════════════════════════════════════════════════════
   CHART PALETTE
   Validated with the dataviz validator against both slide surfaces.

     light (#FAFAFA) · #0D7A40 / #8A8A8A → lightness, CVD (ΔE 11.8 protan),
       normal-vision (ΔE 17.8) and 3:1 contrast all pass
     dark  (#0A0A0A) · #39FF88 / #8A8A8A → contrast and separation pass

   The product's raw #39FF88 is NOT used as a fill on light slides: at 1.27:1
   against #FAFAFA it disappears under projection. It stays what it is in the
   product — a glow and a hairline — while #0D7A40 (already the accent text
   colour in globals.css) carries the filled marks.

   Two marks only, and they encode emphasis rather than category: us versus the
   rest. Every bar is direct-labelled, so identity never rests on colour alone.
   These charts are projected, not browsed — there is no hover layer by design.
   ═══════════════════════════════════════════════════════════════════════════ */

function usePalette() {
  const ink = useInk();
  return {
    us: ink.tone === "dark" ? "#39FF88" : "#0D7A40",
    other: "#8A8A8A",
    ink,
  };
}

/** French-readable compact number: 12 400 → "12,4 K", 1 200 000 → "1,2 M". */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${(Math.round(v * 10) / 10).toString().replace(".", ",")} M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${(Math.round(v * 10) / 10).toString().replace(".", ",")} K`;
  }
  return String(n);
}

/* ═══════════════════════════════════════════════════════════════════════════
   BENCHMARK — horizontal bars, magnitude across identities
   ═══════════════════════════════════════════════════════════════════════════ */

export function BenchmarkBars({
  rows,
  unit,
  startDelay = 0.4,
  width = 1560,
}: {
  rows: readonly BenchmarkRow[];
  unit: string;
  startDelay?: number;
  width?: number;
}) {
  const { us, other, ink } = usePalette();
  const reduced = useDeckReducedMotion();

  const LABEL_W = 420;
  const VALUE_W = 190;
  const ROW_H = 74;
  const BAR_H = 22;

  const values = rows
    .map((r) => r.monthlyVisits)
    .filter((v): v is number => typeof v === "number");
  const max = values.length ? Math.max(...values) : 0;
  const anyData = values.length > 0;

  return (
    <div style={{ width }}>
      {/* Unit, stated once — never repeated on every bar */}
      <div
        className="t-micro"
        style={{
          color: ink.faint,
          marginBottom: 18,
          paddingLeft: LABEL_W + 24,
        }}
      >
        {unit}
      </div>

      {rows.map((row, i) => {
        const colour = row.isUs ? us : other;
        const has = typeof row.monthlyVisits === "number";
        const ratio = has && max > 0 ? (row.monthlyVisits as number) / max : 0;

        return (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: `${LABEL_W}px 1fr ${VALUE_W}px`,
              alignItems: "center",
              height: ROW_H,
              gap: 24,
              borderTop: i === 0 ? "none" : `1px solid ${ink.rule}`,
            }}
          >
            {/* Identity */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, x: -12 }}
              animate={reduced ? undefined : { opacity: 1, x: 0 }}
              transition={t(DUR.quick, startDelay + i * 0.1)}
              className="t-lead"
              style={{
                color: row.isUs ? ink.primary : ink.secondary,
                fontWeight: row.isUs ? 800 : 500,
                textAlign: "right",
              }}
            >
              {row.name}
            </motion.div>

            {/* Track */}
            <div style={{ position: "relative", height: BAR_H }}>
              {has ? (
                <motion.div
                  initial={reduced ? undefined : { scaleX: 0 }}
                  animate={reduced ? undefined : { scaleX: 1 }}
                  transition={{
                    duration: 1,
                    delay: startDelay + 0.2 + i * 0.1,
                    ease: EASE,
                  }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: BAR_H,
                    // Rounded data-end only; the baseline end stays square.
                    // Percentage of the track column: the bar can never run
                    // past its own cell and collide with the value label.
                    width: `max(${q(ratio * 100)}%, 4px)`,
                    background: colour,
                    borderRadius: "0 4px 4px 0",
                    transformOrigin: "left center",
                    boxShadow: row.isUs
                      ? "0 0 18px rgba(57,255,136,0.28)"
                      : undefined,
                  }}
                />
              ) : (
                // Empty state: a track with no claim attached to it.
                <motion.div
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={reduced ? undefined : { opacity: 1 }}
                  transition={t(DUR.quick, startDelay + 0.2 + i * 0.1)}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: BAR_H / 2 - 1,
                    height: 2,
                    width: "100%",
                    background: `repeating-linear-gradient(90deg, ${
                      row.isUs ? colour : ink.rule
                    } 0 8px, transparent 8px 16px)`,
                    opacity: row.isUs ? 0.75 : 1,
                  }}
                />
              )}
            </div>

            {/* Direct label — the relief that makes the neutral bar legible */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={t(DUR.quick, startDelay + 0.5 + i * 0.1)}
            >
              {has ? (
                <span
                  className="t-h3"
                  style={{
                    color: row.isUs ? ink.primary : ink.secondary,
                    fontSize: 28,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatCompact(row.monthlyVisits as number)}
                </span>
              ) : (
                <span className="ted-data-slot" data-tone={ink.tone}>
                  {"{DATA_TO_FILL}"}
                </span>
              )}
            </motion.div>
          </div>
        );
      })}

      {!anyData && (
        <div
          className="t-micro"
          style={{ color: ink.faint, marginTop: 22, paddingLeft: LABEL_W + 24 }}
        >
          Renseigner BENCHMARK.rows[].monthlyVisits — les barres se tracent seules
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRAJECTORY — one series over time, milestones direct-laboured
   ═══════════════════════════════════════════════════════════════════════════ */

export function TrajectoryChart({
  points,
  unit,
  startDelay = 0.4,
  width = 1560,
  height = 380,
}: {
  points: readonly TrajectoryPoint[];
  unit: string;
  startDelay?: number;
  width?: number;
  height?: number;
}) {
  const { us, ink } = usePalette();
  const reduced = useDeckReducedMotion();

  const PAD_L = 40;
  const PAD_R = 40;
  const PAD_T = 56;
  const PAD_B = 78;

  const plotW = width - PAD_L - PAD_R;
  const plotH = height - PAD_T - PAD_B;

  const values = points
    .map((p) => p.value)
    .filter((v): v is number => typeof v === "number");
  const hasData = values.length >= 2;
  const max = values.length ? Math.max(...values) : 1;

  const x = (i: number) =>
    q(PAD_L + (plotW * i) / Math.max(points.length - 1, 1));
  // With no data the curve is drawn as an indicative ramp, clearly dashed and
  // labelled as such — it asserts a direction, never a number.
  const y = (p: TrajectoryPoint, i: number) => {
    if (typeof p.value === "number" && max > 0) {
      return q(PAD_T + plotH - (p.value / max) * plotH);
    }
    const ramp = points.length > 1 ? i / (points.length - 1) : 0;
    return q(PAD_T + plotH - ramp * plotH * 0.82);
  };

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p, i)}`)
    .join(" ");

  const areaPath = `${path} L ${x(points.length - 1)} ${PAD_T + plotH} L ${x(
    0
  )} ${PAD_T + plotH} Z`;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Baseline only — no grid competing with the curve */}
        <line
          x1={PAD_L}
          y1={PAD_T + plotH}
          x2={width - PAD_R}
          y2={PAD_T + plotH}
          stroke={ink.rule}
          strokeWidth={1}
        />

        {hasData && (
          <motion.path
            d={areaPath}
            fill={us}
            initial={reduced ? { opacity: 0.08 } : { opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 1.2, delay: startDelay + 0.8, ease: EASE }}
          />
        )}

        <motion.path
          d={path}
          fill="none"
          stroke={us}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={hasData ? undefined : "7 9"}
          initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 1 }}
          animate={reduced ? { opacity: 1 } : { pathLength: 1 }}
          transition={{ duration: 1.8, delay: startDelay, ease: EASE }}
        />

        {points.map((p, i) => (
          <motion.circle
            key={p.label}
            cx={x(i)}
            cy={y(p, i)}
            r={p.state === "actual" ? 8 : 6}
            fill={p.state === "actual" ? us : ink.tone === "dark" ? "#0a0a0a" : "#fff"}
            stroke={us}
            strokeWidth={2.5}
            initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{
              duration: 0.45,
              delay: startDelay + 0.6 + i * 0.16,
              ease: EASE,
            }}
            style={{ transformOrigin: `${x(i)}px ${y(p, i)}px` }}
          />
        ))}
      </svg>

      {/* Unit, once */}
      <div
        className="t-micro"
        style={{ position: "absolute", left: PAD_L, top: 0, color: ink.faint }}
      >
        {unit}
      </div>

      {/* Milestone labels + values */}
      {points.map((p, i) => {
        const has = typeof p.value === "number";
        const cx = x(i);
        return (
          <div
            key={`l-${p.label}`}
            style={{
              position: "absolute",
              left: cx - 130,
              top: PAD_T + plotH + 22,
              width: 260,
              textAlign: "center",
            }}
          >
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={t(DUR.quick, startDelay + 0.7 + i * 0.16)}
            >
              <div
                className="t-micro"
                style={{
                  color: p.state === "actual" ? ink.secondary : ink.faint,
                  marginBottom: 9,
                }}
              >
                {p.label}
              </div>
              {has ? (
                <div
                  className="t-h3"
                  style={{
                    color: ink.primary,
                    fontSize: 30,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatCompact(p.value as number)}
                </div>
              ) : (
                <span className="ted-data-slot" data-tone={ink.tone}>
                  {"{DATA_TO_FILL}"}
                </span>
              )}
            </motion.div>
          </div>
        );
      })}

      {!hasData && (
        <div
          className="t-micro"
          style={{
            position: "absolute",
            right: PAD_R,
            top: 0,
            color: ink.faint,
          }}
        >
          Courbe indicative — renseigner TRAJECTORY.points[].value
        </div>
      )}
    </div>
  );
}
