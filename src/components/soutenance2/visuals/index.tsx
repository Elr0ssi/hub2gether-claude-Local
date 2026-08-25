"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DUR,
  EASE,
  Rise,
  q,
  t,
  useDeckReducedMotion,
  useInk,
} from "@/components/presentation/primitives";

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED
   ═══════════════════════════════════════════════════════════════════════════ */

const ACCENT = "#39FF88";
const ACCENT_INK = "#0D7A40";

/** Accent that reads on either ground: neon on dark, deep green on light. */
export function useAccent(): string {
  const ink = useInk();
  return ink.tone === "dark" ? ACCENT : ACCENT_INK;
}

/** A drawn line: reveals along its own length rather than fading in. */
function DrawPath({
  d,
  delay = 0,
  duration = 1.1,
  stroke,
  width = 1.4,
  opacity = 1,
  dashed,
}: {
  d: string;
  delay?: number;
  duration?: number;
  stroke: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
}) {
  const reduced = useDeckReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeLinecap="round"
      strokeDasharray={dashed ? "3 7" : undefined}
      initial={reduced ? undefined : { pathLength: 0 }}
      animate={reduced ? undefined : { pathLength: 1 }}
      transition={{ duration, delay, ease: EASE }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCATTER FIELD — slide 02
   Sources strewn around the reader: the work they are left to do.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ScatterField({
  labels,
  startDelay = 0,
  size = 620,
}: {
  labels: readonly string[];
  startDelay?: number;
  size?: number;
}) {
  const ink = useInk();
  const accent = useAccent();
  const c = size / 2;

  // Two rings, offset — irregular enough to read as scatter, regular enough
  // to stay legible at projection distance.
  const placed = labels.map((label, i) => {
    const ring = i % 2 === 0 ? 0.94 : 0.62;
    const angle = (i / labels.length) * Math.PI * 2 - Math.PI / 2 + (i % 2 ? 0.34 : 0);
    return {
      label,
      // Les pastilles sont centrées sur leur point : sur l'anneau extérieur,
      // la moitié d'un intitulé long dépassait du cadre et, le cadre touchant
      // déjà le bord de la colonne, sortait de l'écran. Le rayon horizontal
      // est resserré pour que la pastille entière tienne, la hauteur non.
      x: q(c + Math.cos(angle) * c * ring * 0.74),
      y: q(c + Math.sin(angle) * c * ring * 0.82),
    };
  });

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        {placed.map((p, i) => (
          <DrawPath
            key={i}
            d={`M ${p.x} ${p.y} L ${c} ${c}`}
            stroke={ink.rule}
            width={1}
            opacity={0.9}
            dashed
            delay={startDelay + 0.3 + i * 0.05}
            duration={0.8}
          />
        ))}
      </svg>

      {placed.map((p, i) => (
        <Rise
          key={p.label}
          delay={startDelay + 0.2 + i * 0.06}
          y={8}
          duration={DUR.quick}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              padding: "9px 16px",
              borderRadius: 100,
              border: `1px solid ${ink.rule}`,
              background: ink.tone === "dark" ? "rgba(255,255,255,0.04)" : "#fff",
              color: ink.muted,
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            {p.label}
          </span>
        </Rise>
      ))}

      {/* The reader, in the middle of it */}
      <Rise
        delay={startDelay}
        y={0}
        style={{
          position: "absolute",
          left: c,
          top: c,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: "50%",
            border: `2px solid ${accent}`,
            display: "grid",
            placeItems: "center",
            background: ink.tone === "dark" ? "#0B0B0B" : "#fff",
            color: ink.primary,
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Un
          <br />
          lecteur
        </div>
      </Rise>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPERIENCE CHAIN — slide 04
   Four gestures, one tool. Vertical, so it can sit beside a screenshot.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ExperienceChain({
  steps,
  startDelay = 0,
}: {
  steps: readonly { id: string; label: string; items: readonly string[] }[];
  startDelay?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <div style={{ display: "grid", gap: 0 }}>
      {steps.map((s, i) => (
        <div key={s.id}>
          <Rise delay={startDelay + i * 0.14} y={14}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: accent,
                  flexShrink: 0,
                  transform: "translateY(-3px)",
                }}
              />
              <div>
                <div
                  className="t-h3"
                  style={{ color: ink.primary, letterSpacing: "-0.03em" }}
                >
                  {s.label}
                </div>
                <div
                  className="t-small"
                  style={{ color: ink.muted, marginTop: 7 }}
                >
                  {s.items.join(" · ")}
                </div>
              </div>
            </div>
          </Rise>
          {i < steps.length - 1 && (
            <div style={{ paddingLeft: 4, height: 46 }}>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={t(DUR.base, startDelay + i * 0.14 + 0.12)}
                style={{
                  width: 1,
                  height: "100%",
                  background: ink.rule,
                  transformOrigin: "top center",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MARKET FUNNEL — slide 05
   Three nested widths, then the share we actually aim at.
   ═══════════════════════════════════════════════════════════════════════════ */

export function MarketFunnel({
  tiers,
  startDelay = 0,
  width = 720,
}: {
  tiers: readonly { id: string; value: string; label: string; note: string }[];
  startDelay?: number;
  width?: number;
}) {
  const ink = useInk();
  const accent = useAccent();
  const widths = [1, 0.78, 0.56];

  return (
    <div style={{ display: "grid", gap: 22, width }}>
      {tiers.map((tier, i) => (
        <Rise key={tier.id} delay={startDelay + i * 0.16} y={16}>
          <div
            style={{
              width: `${widths[i] * 100}%`,
              borderRadius: 18,
              border: `1px solid ${ink.rule}`,
              background:
                ink.tone === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
              padding: "22px 28px",
              display: "flex",
              alignItems: "baseline",
              gap: 24,
            }}
          >
            <span
              className="t-h2"
              style={{
                color: i === 2 ? accent : ink.primary,
                letterSpacing: "-0.04em",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {tier.value}
            </span>
            <span style={{ minWidth: 0 }}>
              <span
                className="t-body"
                style={{ color: ink.secondary, display: "block" }}
              >
                {tier.label}
              </span>
              <span
                className="t-small"
                style={{ color: ink.faint, display: "block", marginTop: 4 }}
              >
                {tier.note}
              </span>
            </span>
          </div>
        </Rise>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COVERAGE MATRIX — slide 06
   Four families against four dimensions. Nobody scores full everywhere.
   ═══════════════════════════════════════════════════════════════════════════ */

export function CoverageMatrix({
  axes,
  rows,
  startDelay = 0,
}: {
  axes: readonly string[];
  rows: readonly {
    id: string;
    label: string;
    examples: string;
    axes: readonly ("full" | "partial" | "none")[];
    us?: boolean;
  }[];
  startDelay?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  const dot = (state: "full" | "partial" | "none", us?: boolean) => {
    const colour = us ? accent : ink.secondary;
    if (state === "full") {
      return { background: colour, border: `2px solid ${colour}` };
    }
    if (state === "partial") {
      return {
        background: `linear-gradient(90deg, ${colour} 50%, transparent 50%)`,
        border: `2px solid ${colour}`,
      };
    }
    return { background: "transparent", border: `2px solid ${ink.rule}` };
  };

  return (
    <div style={{ display: "grid", gap: 0 }}>
      {/* Header */}
      <Rise delay={startDelay} y={8}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr repeat(${axes.length}, 132px)`,
            alignItems: "end",
            paddingBottom: 14,
            borderBottom: `1px solid ${ink.rule}`,
          }}
        >
          <span />
          {axes.map((a) => (
            <span
              key={a}
              className="t-micro"
              style={{ color: ink.muted, textAlign: "center" }}
            >
              {a}
            </span>
          ))}
        </div>
      </Rise>

      {rows.map((row, i) => (
        <Rise key={row.id} delay={startDelay + 0.1 + i * 0.1} y={12}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `1fr repeat(${axes.length}, 132px)`,
              alignItems: "center",
              padding: "20px 0",
              borderBottom: `1px solid ${ink.rule}`,
              background: row.us
                ? ink.tone === "dark"
                  ? "rgba(57,255,136,0.06)"
                  : "rgba(57,255,136,0.07)"
                : undefined,
              borderRadius: row.us ? 12 : undefined,
              paddingLeft: row.us ? 18 : 0,
              paddingRight: row.us ? 18 : 0,
            }}
          >
            <span>
              <span
                style={{
                  display: "block",
                  fontSize: 24,
                  fontWeight: row.us ? 800 : 700,
                  color: row.us ? accent : ink.primary,
                  letterSpacing: "-0.02em",
                }}
              >
                {row.label}
              </span>
              <span
                className="t-small"
                style={{ color: ink.faint, display: "block", marginTop: 5 }}
              >
                {row.examples}
              </span>
            </span>
            {row.axes.map((state, j) => (
              <span key={j} style={{ display: "grid", placeItems: "center" }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    ...dot(state, row.us),
                  }}
                />
              </span>
            ))}
          </div>
        </Rise>
      ))}

      <Rise delay={startDelay + 0.1 + rows.length * 0.1} y={8}>
        <div
          className="t-small"
          style={{ color: ink.faint, marginTop: 16, display: "flex", gap: 26 }}
        >
          <span>● couvert</span>
          <span>◐ partiel</span>
          <span>○ non couvert</span>
        </div>
      </Rise>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACQUISITION LOOP — slide 07
   A closed circle: the point is that it comes back.
   ═══════════════════════════════════════════════════════════════════════════ */

export function AcquisitionLoop({
  steps,
  startDelay = 0,
  size = 620,
}: {
  steps: readonly string[];
  startDelay?: number;
  size?: number;
}) {
  const ink = useInk();
  const accent = useAccent();
  const reduced = useDeckReducedMotion();
  const c = size / 2;
  const r = c - 96;

  const nodes = steps.map((label, i) => {
    const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
    return {
      label,
      angle,
      x: q(c + Math.cos(angle) * r),
      y: q(c + Math.sin(angle) * r),
    };
  });

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        <DrawPath
          d={`M ${q(c + r)} ${c} A ${r} ${r} 0 1 1 ${q(c + r - 0.01)} ${c}`}
          stroke={ink.rule}
          width={1.2}
          delay={startDelay}
          duration={1.6}
        />
        {/* A single travelling dot — the loop turning, once. */}
        {!reduced && (
          <motion.circle
            r={6}
            fill={accent}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 6,
              delay: startDelay + 1.2,
              times: [0, 0.05, 0.9, 1],
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          >
            <animateMotion
              dur="6s"
              begin={`${startDelay + 1.2}s`}
              repeatCount="indefinite"
              path={`M ${q(c + r)} ${c} A ${r} ${r} 0 1 1 ${q(c + r - 0.01)} ${c}`}
            />
          </motion.circle>
        )}
      </svg>

      {nodes.map((n, i) => (
        <Rise
          key={n.label}
          delay={startDelay + 0.5 + i * 0.09}
          y={8}
          duration={DUR.quick}
          style={{
            position: "absolute",
            left: n.x,
            top: n.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              padding: "10px 18px",
              borderRadius: 100,
              border: `1px solid ${i === 5 ? accent : ink.rule}`,
              background:
                i === 5
                  ? ink.tone === "dark"
                    ? "rgba(57,255,136,0.12)"
                    : "rgba(57,255,136,0.14)"
                  : ink.tone === "dark"
                  ? "#0B0B0B"
                  : "#fff",
              color: i === 5 ? accent : ink.secondary,
              fontSize: 18,
              fontWeight: i === 5 ? 800 : 600,
            }}
          >
            {n.label}
          </span>
        </Rise>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONVERGENCE — slide 09
   Two columns of real titles collapsing onto one hub, then one output.
   ═══════════════════════════════════════════════════════════════════════════ */

export function SourceConvergence({
  french,
  international,
  hub,
  output,
  startDelay = 0,
  width = 1380,
  height = 620,
}: {
  french: readonly string[];
  international: readonly string[];
  hub: string;
  output: string;
  startDelay?: number;
  width?: number;
  height?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  const all = [...french, ...international];
  const hubX = width * 0.56;
  const hubY = height / 2;
  const outX = width - 150;

  const rows = all.map((label, i) => {
    const y = q(48 + (i * (height - 96)) / (all.length - 1));
    return { label, y, isFr: i < french.length };
  });

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {rows.map((r, i) => (
          <DrawPath
            key={i}
            // Ends at the hub's centre rather than its edge: the disc is
            // opaque and paints over the tips, so the sheaf always meets it
            // cleanly whatever the container is scaled to.
            d={`M 300 ${r.y} C ${hubX * 0.62} ${r.y}, ${hubX * 0.78} ${hubY}, ${q(hubX)} ${hubY}`}
            stroke={r.isFr ? accent : ink.rule}
            width={1}
            opacity={r.isFr ? 0.5 : 0.85}
            delay={startDelay + 0.25 + i * 0.045}
            duration={1}
          />
        ))}
        <DrawPath
          d={`M ${q(hubX)} ${hubY} L ${outX - 122} ${hubY}`}
          stroke={accent}
          width={2}
          delay={startDelay + 1.5}
          duration={0.6}
        />
      </svg>

      {/* Sources */}
      {rows.map((r, i) => (
        <Rise
          key={r.label + i}
          delay={startDelay + i * 0.045}
          y={6}
          duration={DUR.quick}
          style={{ position: "absolute", left: 0, top: r.y, transform: "translateY(-50%)" }}
        >
          <span
            style={{
              display: "inline-block",
              width: 288,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "right",
              paddingRight: 16,
              color: r.isFr ? ink.secondary : ink.muted,
              fontSize: 19,
              fontWeight: r.isFr ? 700 : 500,
            }}
          >
            {r.label}
          </span>
        </Rise>
      ))}

      {/* Hub */}
      <Rise
        delay={startDelay + 1.1}
        y={0}
        style={{
          position: "absolute",
          left: hubX,
          top: hubY,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: "50%",
            border: `2px solid ${accent}`,
            background: ink.tone === "dark" ? "#0B0B0B" : "#fff",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: 22,
            color: ink.primary,
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
          }}
        >
          {hub}
        </div>
      </Rise>

      {/* Output */}
      <Rise
        delay={startDelay + 1.9}
        y={10}
        style={{
          position: "absolute",
          left: outX,
          top: hubY,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: 236,
            padding: "24px 22px",
            borderRadius: 16,
            border: `1px solid ${accent}`,
            background:
              ink.tone === "dark" ? "rgba(57,255,136,0.08)" : "rgba(57,255,136,0.1)",
            color: ink.primary,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            textAlign: "center",
          }}
        >
          {output}
        </div>
      </Rise>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARTICLE PIPELINE — slide 10
   Six stages, narrowing. The bars shorten as the material is reduced.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ArticlePipeline({
  steps,
  startDelay = 0,
}: {
  steps: readonly { index: string; label: string; items: readonly string[] }[];
  startDelay?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 26 }}>
      {steps.map((s, i) => {
        // Each stage carries less material than the one before it.
        const fill = 1 - i * 0.15;
        return (
          <Rise key={s.index} delay={startDelay + i * 0.13} y={18}>
            <div style={{ display: "grid", gap: 16 }}>
              {/* Material bar */}
              <div
                style={{
                  height: 6,
                  borderRadius: 100,
                  background: ink.tone === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: fill }}
                  transition={t(DUR.slow, startDelay + i * 0.13 + 0.15)}
                  style={{
                    height: "100%",
                    background: i === steps.length - 1 ? accent : ink.secondary,
                    transformOrigin: "left center",
                    opacity: i === steps.length - 1 ? 1 : 0.55,
                  }}
                />
              </div>

              {/* Two lines' worth of room whatever the label needs, so a
                  stage whose name wraps does not push its own list a line
                  below its neighbours'. */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  minHeight: 54,
                }}
              >
                <span
                  className="t-index"
                  style={{ color: accent, fontSize: 17, fontWeight: 800 }}
                >
                  {s.index}
                </span>
                <span
                  style={{
                    fontSize: 23,
                    fontWeight: 800,
                    color: ink.primary,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.15,
                  }}
                >
                  {s.label}
                </span>
              </div>

              <ul style={{ display: "grid", gap: 7, listStyle: "none", margin: 0, padding: 0 }}>
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="t-small"
                    style={{ color: ink.muted, lineHeight: 1.45 }}
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT SCREENSHOT FRAME
   A browser chrome around a placeholder. Swap the inner node for an <Image>
   when the capture exists — the frame keeps its dimensions, so nothing moves.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ProductScreenshotFrame({
  label,
  caption,
  url = "theessentialdata.com",
  width = "100%",
  height = 420,
  delay = 0,
  src,
  children,
}: {
  label: string;
  caption?: string;
  url?: string;
  width?: string | number;
  height?: number;
  delay?: number;
  /**
   * The capture, in `public/`. Drop the file at this path and it fills the
   * frame; until then the frame keeps the same size and says what it is
   * waiting for, so nothing on the slide moves when the image lands.
   */
  src?: string;
  children?: React.ReactNode;
}) {
  const ink = useInk();
  const [shown, setShown] = useState(false);

  return (
    <Rise delay={delay} y={18}>
      <div
        style={{
          width,
          borderRadius: 18,
          overflow: "hidden",
          border: `1px solid ${ink.rule}`,
          background: ink.tone === "dark" ? "#0B0B0B" : "#fff",
          boxShadow:
            ink.tone === "dark"
              ? "0 30px 80px rgba(0,0,0,0.55)"
              : "0 30px 80px rgba(10,20,15,0.1)",
        }}
      >
        {/* Chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 18px",
            borderBottom: `1px solid ${ink.rule}`,
            background: ink.tone === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: ink.rule,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 12,
              padding: "4px 14px",
              borderRadius: 100,
              border: `1px solid ${ink.rule}`,
              color: ink.faint,
              fontSize: 14,
            }}
          >
            {url}
          </span>
        </div>

        {/* Body — replace with the real capture */}
        <div
          style={{
            position: "relative",
            height,
            display: "grid",
            placeItems: "center",
            background:
              ink.tone === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
          }}
          role="img"
          aria-label={`Emplacement capture : ${label}`}
        >
          {src && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={label}
              onLoad={() => setShown(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                opacity: shown ? 1 : 0,
                transition: "opacity .45s",
              }}
            />
          )}

          {children ??
            (!shown && (
              <div style={{ textAlign: "center", padding: "0 40px" }}>
                <div className="t-micro" style={{ color: ink.muted }}>
                  {label}
                </div>
                {caption && (
                  <div style={{ fontSize: 13, color: ink.faint, marginTop: 8, letterSpacing: "0.06em" }}>
                    {caption}
                  </div>
                )}
                {src && (
                  <div style={{ fontSize: 12, color: ink.faint, marginTop: 12, opacity: 0.75 }}>
                    {src}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </Rise>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS TIMELINE — slide 12
   ═══════════════════════════════════════════════════════════════════════════ */

export function StatusTimeline({
  steps,
  startDelay = 0,
}: {
  steps: readonly { label: string; state: "done" | "current" | "next" }[];
  startDelay?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <div style={{ position: "relative", display: "grid", gap: 0 }}>
      {steps.map((s, i) => {
        const isCurrent = s.state === "current";
        const colour =
          s.state === "done" ? ink.secondary : isCurrent ? accent : ink.faint;
        return (
          <Rise key={s.label} delay={startDelay + i * 0.09} y={10} duration={DUR.quick}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, height: 62 }}>
              <span style={{ position: "relative", width: 16, display: "grid", placeItems: "center" }}>
                {i < steps.length - 1 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 16,
                      bottom: -46,
                      width: 1,
                      background: ink.rule,
                    }}
                  />
                )}
                <span
                  style={{
                    width: isCurrent ? 16 : 10,
                    height: isCurrent ? 16 : 10,
                    borderRadius: "50%",
                    background: s.state === "next" ? "transparent" : colour,
                    border: `2px solid ${colour}`,
                    zIndex: 1,
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: isCurrent ? 26 : 22,
                  fontWeight: isCurrent ? 800 : 600,
                  color: isCurrent ? ink.primary : colour,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.label}
              </span>
              {s.state === "done" && (
                <span style={{ color: accent, fontSize: 19, fontWeight: 800 }}>✓</span>
              )}
              {isCurrent && (
                <span
                  className="t-micro"
                  style={{
                    color: accent,
                    border: `1px solid ${accent}`,
                    borderRadius: 100,
                    padding: "5px 12px",
                  }}
                >
                  En cours
                </span>
              )}
            </div>
          </Rise>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REVENUE CURVE — slide 13
   One line, five years, the crossing marked.
   ═══════════════════════════════════════════════════════════════════════════ */

export function RevenueCurve({
  years,
  startDelay = 0,
  width = 900,
  height = 380,
}: {
  years: readonly { year: string; revenue: number; net: number | null }[];
  startDelay?: number;
  width?: number;
  height?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  const padX = 70;
  const padY = 44;
  const max = Math.max(...years.map((y) => y.revenue));
  const x = (i: number) => q(padX + (i * (width - padX * 2)) / (years.length - 1));
  const y = (v: number) => q(height - padY - (v / max) * (height - padY * 2));

  const path = years
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.revenue)}`)
    .join(" ");

  const areaPath = `${path} L ${x(years.length - 1)} ${height - padY} L ${x(0)} ${height - padY} Z`;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="s2-rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Baseline */}
        <line
          x1={padX}
          y1={height - padY}
          x2={width - padX}
          y2={height - padY}
          stroke={ink.rule}
          strokeWidth={1}
        />

        <motion.path
          d={areaPath}
          fill="url(#s2-rev-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(DUR.slow, startDelay + 0.9)}
        />
        <DrawPath d={path} stroke={accent} width={2.5} delay={startDelay} duration={1.5} />

        {years.map((p, i) => (
          <motion.circle
            key={p.year}
            cx={x(i)}
            cy={y(p.revenue)}
            r={6}
            fill={ink.tone === "dark" ? "#0B0B0B" : "#fff"}
            stroke={accent}
            strokeWidth={2.5}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={t(DUR.quick, startDelay + 0.4 + i * 0.22)}
          />
        ))}
      </svg>

      {/* Labels */}
      {years.map((p, i) => (
        <Rise
          key={p.year}
          delay={startDelay + 0.5 + i * 0.22}
          y={8}
          duration={DUR.quick}
          style={{
            position: "absolute",
            left: x(i),
            top: y(p.revenue) - 62,
            transform: "translateX(-50%)",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              fontSize: 21,
              fontWeight: 800,
              color: ink.primary,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {p.revenue.toLocaleString("fr-FR")} €
          </div>
        </Rise>
      ))}

      {years.map((p, i) => (
        <span
          key={`ax-${p.year}`}
          className="t-micro"
          style={{
            position: "absolute",
            left: x(i),
            top: height - padY + 16,
            transform: "translateX(-50%)",
            color: ink.muted,
            whiteSpace: "nowrap",
          }}
        >
          {p.year}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REPLICATION — slide 14
   One engine, three shells. The point is that the core is not rebuilt.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ReplicationDiagram({
  phases,
  startDelay = 0,
  width = 1180,
  height = 400,
}: {
  phases: readonly { index: string; label: string; scope: string; milestone: string | null }[];
  startDelay?: number;
  width?: number;
  height?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  const coreX = 220;
  const coreY = height / 2;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {phases.map((_, i) => {
          const targetY = q(74 + (i * (height - 148)) / (phases.length - 1));
          return (
            <DrawPath
              key={i}
              d={`M ${coreX + 116} ${coreY} C ${coreX + 260} ${coreY}, ${coreX + 300} ${targetY}, ${coreX + 420} ${targetY}`}
              stroke={i === 0 ? accent : ink.rule}
              width={i === 0 ? 2 : 1.2}
              opacity={i === 0 ? 1 : 0.9}
              delay={startDelay + 0.6 + i * 0.2}
              duration={0.9}
            />
          );
        })}
      </svg>

      {/* The engine */}
      <Rise
        delay={startDelay}
        y={0}
        style={{
          position: "absolute",
          left: coreX,
          top: coreY,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: 232,
            padding: "28px 24px",
            borderRadius: 18,
            border: `2px solid ${accent}`,
            background: ink.tone === "dark" ? "rgba(57,255,136,0.07)" : "rgba(57,255,136,0.09)",
            textAlign: "center",
          }}
        >
          <div className="t-micro" style={{ color: accent, marginBottom: 10 }}>
            Moteur central
          </div>
          <div
            style={{
              fontSize: 23,
              fontWeight: 800,
              color: ink.primary,
              letterSpacing: "-0.025em",
              lineHeight: 1.25,
            }}
          >
            Collecte
            <br />
            Recoupement
            <br />
            Restitution
          </div>
        </div>
      </Rise>

      {/* The shells it fills */}
      {phases.map((p, i) => {
        const top = q(74 + (i * (height - 148)) / (phases.length - 1));
        return (
          <Rise
            key={p.index}
            delay={startDelay + 0.9 + i * 0.2}
            y={12}
            style={{
              position: "absolute",
              left: coreX + 420,
              top,
              transform: "translateY(-50%)",
              width: width - coreX - 460,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 20,
                padding: "18px 24px",
                borderRadius: 14,
                border: `1px solid ${i === 0 ? accent : ink.rule}`,
                background:
                  i === 0
                    ? ink.tone === "dark"
                      ? "rgba(57,255,136,0.06)"
                      : "rgba(57,255,136,0.06)"
                    : "transparent",
              }}
            >
              <span className="t-index" style={{ color: accent, fontSize: 16 }}>
                {p.index}
              </span>
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: 25,
                    fontWeight: 800,
                    color: ink.primary,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {p.label}
                </span>
                <span className="t-small" style={{ color: ink.muted, display: "block", marginTop: 5 }}>
                  {p.scope}
                </span>
                {p.milestone && (
                  <span
                    className="t-micro"
                    style={{ color: accent, display: "block", marginTop: 8 }}
                  >
                    {p.milestone}
                  </span>
                )}
              </span>
            </div>
          </Rise>
        );
      })}
    </div>
  );
}
