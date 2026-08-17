"use client";

import { motion } from "framer-motion";
import { useDeckReducedMotion, useInk, EASE, DUR, t, q, Rise } from "../primitives";

/* ═══════════════════════════════════════════════════════════════════════════
   CHART PALETTE — validated, not eyeballed
   (scripts/validate_palette.js, run against both slide surfaces)

     light (#FAFAFA) · #0D7A40 / #8A8A8A → lightness, CVD (ΔE 11.8 protan),
       normal-vision (ΔE 17.8) and 3:1 contrast all pass
     dark  (#0A0A0A) · #39FF88 / #8A8A8A → contrast and separation pass

   The product's raw #39FF88 is NOT a fill on light slides: at 1.27:1 against
   #FAFAFA it disappears under projection. It stays what it is in the product —
   a glow and a hairline — while #0D7A40 (already the accent text colour in
   globals.css) carries the filled marks.

   The revenue mix uses a SEQUENTIAL green ramp rather than three categorical
   hues: the channels are ordered by contribution, so magnitude is the job. A
   3-hue categorical set could not clear CVD adjacency against the neutral
   here; a single-hue ramp sidesteps it, and every segment is direct-labelled.

   These charts are projected, not browsed — there is no hover layer by design.
   ═══════════════════════════════════════════════════════════════════════════ */

function usePalette() {
  const ink = useInk();
  return {
    us: ink.tone === "dark" ? "#39FF88" : "#0D7A40",
    other: "#8A8A8A",
    /** Sequential ramp, dark → light, for ordered magnitude segments. */
    ramp:
      ink.tone === "dark"
        ? ["#39FF88", "#1FBF66", "#127A44"]
        : ["#0A5C31", "#0D7A40", "#2E9E68"],
    ink,
  };
}

const NBSP = "\u00A0"; // no-break space — French numeric separator

export function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const v = Math.round((n / 1_000_000) * 10) / 10;
    return `${String(v).replace(".", ",")}${NBSP}M`;
  }
  if (n >= 1_000) {
    const v = Math.round((n / 1_000) * 10) / 10;
    return `${String(v).replace(".", ",")}${NBSP}K`;
  }
  return String(n);
}

export function formatEuro(n: number): string {
  return `${n.toLocaleString("fr-FR").replace(/ /g, NBSP)}${NBSP}€`;
}

/** Growth multiple between two milestones, e.g. "×5,4". */
function multiple(from: number, to: number): string {
  if (from <= 0) return "";
  const m = to / from;
  const rounded = m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
  const text =
    rounded >= 1000
      ? rounded.toLocaleString("fr-FR").replace(/\u202F|\u00A0| /g, NBSP)
      : String(rounded).replace(".", ",");
  return `×${text}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEMO BADGE — impossible to present fictional figures by accident
   ═══════════════════════════════════════════════════════════════════════════ */

export function DemoBadge({ delay = 0.2 }: { delay?: number }) {
  const ink = useInk();
  return (
    <Rise delay={delay} y={8}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          padding: "7px 14px",
          borderRadius: 100,
          border: "1px dashed rgba(255,138,91,0.55)",
          background: "rgba(255,138,91,0.09)",
          color: ink.tone === "dark" ? "#FFB694" : "#B4491C",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#FF8A5B",
            flexShrink: 0,
          }}
        />
        Données de démonstration
      </span>
    </Rise>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPARKLINE — supports a hero number, never stands alone
   ═══════════════════════════════════════════════════════════════════════════ */

export function Sparkline({
  series,
  width = 460,
  height = 96,
  delay = 0.6,
}: {
  series: readonly number[];
  width?: number;
  height?: number;
  delay?: number;
}) {
  const { us, ink } = usePalette();
  const reduced = useDeckReducedMotion();

  if (series.length < 2) return null;

  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const px = (i: number) => q((width * i) / (series.length - 1));
  const py = (v: number) => q(height - 6 - ((v - min) / span) * (height - 16));

  const line = series.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`).join(" ");
  const area = `${line} L ${px(series.length - 1)} ${height} L 0 ${height} Z`;
  const lastX = px(series.length - 1);
  const lastY = py(series[series.length - 1]);

  return (
    <svg width={width} height={height} aria-hidden="true" style={{ display: "block" }}>
      <motion.path
        d={area}
        fill={us}
        initial={reduced ? { opacity: 0.1 } : { opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: delay + 0.5, ease: EASE }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={us}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? undefined : { pathLength: 0 }}
        animate={reduced ? undefined : { pathLength: 1 }}
        transition={{ duration: 1.4, delay, ease: EASE }}
      />
      <motion.circle
        cx={lastX}
        cy={lastY}
        r={5}
        fill={us}
        stroke={ink.tone === "dark" ? "#0a0a0a" : "#fafafa"}
        strokeWidth={2}
        initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: delay + 1.2, ease: EASE }}
        style={{ transformOrigin: `${lastX}px ${lastY}px` }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BENCHMARK — the comparables, then us, with the gap named
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ResolvedBenchmarkRow {
  name: string;
  value: number | null;
  isUs?: boolean;
}

export function BenchmarkBars({
  rows,
  unit,
  startDelay = 0.4,
  width = 1560,
}: {
  rows: readonly ResolvedBenchmarkRow[];
  unit: string;
  startDelay?: number;
  width?: number;
}) {
  const { us, other, ink } = usePalette();
  const reduced = useDeckReducedMotion();

  const LABEL_W = 400;
  const VALUE_W = 200;
  const ROW_H = 66;
  const BAR_H = 20;

  const competitors = rows.filter((r) => !r.isUs);
  const mine = rows.find((r) => r.isUs);

  const values = rows.map((r) => r.value).filter((v): v is number => v !== null);
  const max = values.length ? Math.max(...values) : 0;
  const leader = competitors.reduce<number | null>(
    (acc, r) => (r.value !== null && (acc === null || r.value > acc) ? r.value : acc),
    null
  );

  const cols = `${LABEL_W}px 1fr ${VALUE_W}px`;

  const row = (r: ResolvedBenchmarkRow, i: number, emphasised: boolean) => {
    const has = r.value !== null;
    const ratio = has && max > 0 ? (r.value as number) / max : 0;

    return (
      <div
        key={r.name}
        style={{
          display: "grid",
          gridTemplateColumns: cols,
          alignItems: "center",
          height: emphasised ? 96 : ROW_H,
          gap: 24,
        }}
      >
        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: -12 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={t(DUR.quick, startDelay + i * 0.09)}
          className={emphasised ? "t-h3" : "t-lead"}
          style={{
            color: emphasised ? ink.primary : ink.secondary,
            fontWeight: emphasised ? 900 : 500,
            fontSize: emphasised ? 30 : undefined,
            textAlign: "right",
          }}
        >
          {r.name}
        </motion.div>

        <div style={{ position: "relative", height: emphasised ? BAR_H + 6 : BAR_H }}>
          {has ? (
            <motion.div
              initial={reduced ? undefined : { scaleX: 0 }}
              animate={reduced ? undefined : { scaleX: 1 }}
              transition={{
                duration: 1,
                delay: startDelay + 0.2 + i * 0.09,
                ease: EASE,
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: emphasised ? BAR_H + 6 : BAR_H,
                // A percentage of its own column, so a bar can never run past
                // its cell into the value label. The floor keeps our own bar
                // visible even at three orders of magnitude below the leader —
                // the honest scale is kept, the row stays readable.
                width: `max(${q(ratio * 100)}%, ${emphasised ? 10 : 3}px)`,
                background: emphasised ? us : other,
                borderRadius: "0 4px 4px 0",
                transformOrigin: "left center",
                boxShadow: emphasised
                  ? "0 0 22px rgba(57,255,136,0.35)"
                  : undefined,
              }}
            />
          ) : (
            <motion.div
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={t(DUR.quick, startDelay + 0.2 + i * 0.09)}
              style={{
                position: "absolute",
                left: 0,
                top: BAR_H / 2 - 1,
                height: 2,
                width: "100%",
                background: `repeating-linear-gradient(90deg, ${
                  emphasised ? us : ink.rule
                } 0 8px, transparent 8px 16px)`,
              }}
            />
          )}
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={t(DUR.quick, startDelay + 0.45 + i * 0.09)}
        >
          {has ? (
            <span
              className="t-h3"
              style={{
                color: emphasised ? ink.primary : ink.secondary,
                fontSize: emphasised ? 40 : 26,
                fontWeight: emphasised ? 900 : 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatCompact(r.value as number)}
            </span>
          ) : (
            <span className="ted-data-slot" data-tone={ink.tone}>
              {"{DATA_TO_FILL}"}
            </span>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div style={{ width }}>
      <div
        className="t-micro"
        style={{ color: ink.faint, marginBottom: 16, paddingLeft: LABEL_W + 24 }}
      >
        {unit}
      </div>

      {competitors.map((r, i) => row(r, i, false))}

      {/* Us, below the rule and given the weight the argument needs */}
      {mine && (
        <div style={{ marginTop: 18, paddingTop: 22, borderTop: `1px solid ${ink.rule}` }}>
          {row(mine, competitors.length, true)}

          {mine.value !== null && leader !== null && (
            <motion.div
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={t(DUR.base, startDelay + 1.4)}
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                gap: 24,
                marginTop: 4,
              }}
            >
              <div />
              <div
                style={{ display: "flex", alignItems: "baseline", gap: 14 }}
              >
                <span
                  className="t-h3"
                  style={{
                    color: ink.tone === "dark" ? "#39FF88" : "#0D7A40",
                    fontSize: 26,
                    fontWeight: 900,
                  }}
                >
                  {multiple(mine.value, leader)}
                </span>
                <span className="t-body" style={{ color: ink.muted }}>
                  {"l’audience du leader — l’écart est la marge de progression, pas le verdict"}
                </span>
              </div>
              <div />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRAJECTORY — one series, milestones and the multiple between them
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ResolvedPoint {
  label: string;
  value: number | null;
  state: "actual" | "target";
}

export function TrajectoryChart({
  points,
  unit,
  startDelay = 0.4,
  width = 1560,
  height = 400,
}: {
  points: readonly ResolvedPoint[];
  unit: string;
  startDelay?: number;
  width?: number;
  height?: number;
}) {
  const { us, ink } = usePalette();
  const reduced = useDeckReducedMotion();

  const PAD_L = 30;
  const PAD_R = 30;
  const PAD_T = 66;
  const PAD_B = 96;

  const plotW = width - PAD_L - PAD_R;
  const plotH = height - PAD_T - PAD_B;

  const values = points.map((p) => p.value).filter((v): v is number => v !== null);
  const hasData = values.length >= 2;
  const max = values.length ? Math.max(...values) : 1;

  const x = (i: number) => q(PAD_L + (plotW * i) / Math.max(points.length - 1, 1));
  const y = (p: ResolvedPoint, i: number) => {
    if (p.value !== null && max > 0) return q(PAD_T + plotH - (p.value / max) * plotH);
    const ramp = points.length > 1 ? i / (points.length - 1) : 0;
    return q(PAD_T + plotH - ramp * plotH * 0.82);
  };

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p, i)}`).join(" ");
  const area = `${line} L ${x(points.length - 1)} ${PAD_T + plotH} L ${x(0)} ${
    PAD_T + plotH
  } Z`;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="ted-traj" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={us} stopOpacity="0.22" />
            <stop offset="100%" stopColor={us} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Milestone guides — recessive, one per point */}
        {points.map((p, i) => (
          <line
            key={`g-${p.label}`}
            x1={x(i)}
            y1={PAD_T - 10}
            x2={x(i)}
            y2={PAD_T + plotH}
            stroke={ink.rule}
            strokeWidth={1}
          />
        ))}

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
            d={area}
            fill="url(#ted-traj)"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: startDelay + 0.8, ease: EASE }}
          />
        )}

        <motion.path
          d={line}
          fill="none"
          stroke={us}
          strokeWidth={2.5}
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
            r={p.state === "actual" ? 9 : 7}
            fill={p.state === "actual" ? us : ink.tone === "dark" ? "#0a0a0a" : "#fafafa"}
            stroke={us}
            strokeWidth={2.5}
            initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{
              duration: 0.45,
              delay: startDelay + 0.6 + i * 0.16,
              ease: EASE,
            }}
            style={{
              transformOrigin: `${x(i)}px ${y(p, i)}px`,
              filter:
                p.state === "actual"
                  ? "drop-shadow(0 0 10px rgba(57,255,136,0.5))"
                  : undefined,
            }}
          />
        ))}
      </svg>

      <div
        className="t-micro"
        style={{ position: "absolute", left: PAD_L, top: 0, color: ink.faint }}
      >
        {unit}
      </div>

      {/* Growth multiple on each segment */}
      {hasData &&
        points.slice(0, -1).map((p, i) => {
          const nextP = points[i + 1];
          if (p.value === null || nextP.value === null) return null;
          const midX = (x(i) + x(i + 1)) / 2;
          const midY = (y(p, i) + y(nextP, i + 1)) / 2;
          return (
            <motion.div
              key={`m-${p.label}`}
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={t(DUR.quick, startDelay + 1.3 + i * 0.14)}
              style={{
                position: "absolute",
                left: midX - 60,
                top: midY - 46,
                width: 120,
                textAlign: "center",
              }}
            >
              <span
                className="t-index"
                style={{
                  color: ink.tone === "dark" ? "#39FF88" : "#0D7A40",
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                {multiple(p.value, nextP.value)}
              </span>
            </motion.div>
          );
        })}

      {/* Milestone labels */}
      {points.map((p, i) => (
        <div
          key={`l-${p.label}`}
          style={{
            position: "absolute",
            left: x(i) - 140,
            top: PAD_T + plotH + 24,
            width: 280,
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
                marginBottom: 10,
              }}
            >
              {p.label}
            </div>
            {p.value !== null ? (
              <div
                className="t-h3"
                style={{
                  color: p.state === "actual" ? ink.primary : ink.secondary,
                  fontSize: 34,
                  fontWeight: p.state === "actual" ? 900 : 800,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatCompact(p.value)}
              </div>
            ) : (
              <span className="ted-data-slot" data-tone={ink.tone}>
                {"{DATA_TO_FILL}"}
              </span>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REVENUE MIX — one stacked bar, sequential ramp, every segment labelled
   ═══════════════════════════════════════════════════════════════════════════ */

export interface MixSegment {
  label: string;
  value: number | null;
}

export function RevenueMix({
  segments,
  startDelay = 0.4,
  width = 1560,
}: {
  segments: readonly MixSegment[];
  startDelay?: number;
  width?: number;
}) {
  const { ramp, ink } = usePalette();
  const reduced = useDeckReducedMotion();

  const values = segments.map((s) => s.value ?? 0);
  const total = values.reduce((a, b) => a + b, 0);
  const hasData = total > 0;

  // Rank by value so the darkest step lands on the largest contributor: a
  // sequential ramp assigned by array position would imply an order that the
  // narrative sequence (site → social → partnerships) does not carry.
  const rankOf = new Map<number, number>();
  segments
    .map((s, i) => ({ i, v: s.value ?? 0 }))
    .sort((a, b) => b.v - a.v)
    .forEach((entry, rank) => rankOf.set(entry.i, rank));

  const BAR_H = 76;

  return (
    <div style={{ width }}>
      {/* The bar */}
      <div
        style={{
          display: "flex",
          gap: 2, // 2px surface gap between segments
          height: BAR_H,
          width: "100%",
        }}
      >
        {segments.map((seg, i) => {
          const share = hasData ? (seg.value ?? 0) / total : 1 / segments.length;
          return (
            <motion.div
              key={seg.label}
              initial={reduced ? undefined : { opacity: 0, scaleY: 0.4 }}
              animate={reduced ? undefined : { opacity: 1, scaleY: 1 }}
              transition={{
                duration: 0.7,
                delay: startDelay + i * 0.14,
                ease: EASE,
              }}
              style={{
                flex: `${share} 1 0`,
                background: hasData
                  ? ramp[(rankOf.get(i) ?? i) % ramp.length]
                  : "transparent",
                border: hasData ? "none" : `1px dashed ${ink.rule}`,
                borderRadius:
                  i === 0
                    ? "4px 0 0 4px"
                    : i === segments.length - 1
                    ? "0 4px 4px 0"
                    : 0,
                transformOrigin: "center bottom",
              }}
            />
          );
        })}
      </div>

      {/* Direct labels under their own segment */}
      <div style={{ display: "flex", gap: 2, marginTop: 22 }}>
        {segments.map((seg, i) => {
          const share = hasData ? (seg.value ?? 0) / total : 1 / segments.length;
          return (
            <motion.div
              key={`l-${seg.label}`}
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={t(DUR.quick, startDelay + 0.4 + i * 0.14)}
              style={{ flex: `${share} 1 0`, minWidth: 0, paddingRight: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: ramp[(rankOf.get(i) ?? i) % ramp.length],
                    flexShrink: 0,
                  }}
                />
                <span
                  className="t-micro"
                  style={{ color: ink.muted, whiteSpace: "nowrap" }}
                >
                  {seg.label}
                </span>
              </div>
              {seg.value !== null ? (
                <>
                  <div
                    className="t-h3"
                    style={{
                      color: ink.primary,
                      fontSize: 32,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatEuro(seg.value)}
                  </div>
                  <div
                    className="t-small"
                    style={{ color: ink.faint, marginTop: 4 }}
                  >
                    {Math.round(share * 100)}
                    {NBSP}% du total
                  </div>
                </>
              ) : (
                <span className="ted-data-slot" data-tone={ink.tone}>
                  {"{DATA_TO_FILL}"}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
