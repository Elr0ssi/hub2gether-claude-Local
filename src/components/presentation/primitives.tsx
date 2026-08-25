"use client";

import { createContext, useContext, type ReactNode, type CSSProperties } from "react";
import { motion, type Transition } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   MOTION VOCABULARY
   One easing, three durations. Every deck animation is a fade plus a very
   short translate — no bounce, no overshoot, no rotation.
   ═══════════════════════════════════════════════════════════════════════════ */

export const EASE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  quick: 0.4,
  base: 0.6,
  slow: 0.9,
} as const;

export const t = (
  duration: number = DUR.base,
  delay: number = 0
): Transition => ({
  duration,
  delay,
  ease: EASE,
});

/**
 * Quantize a computed coordinate to 2 decimals.
 *
 * Math.cos/Math.sin are not required to be bit-identical across engines, and
 * Node and Chromium do disagree in the last digits — enough to make a
 * server-rendered SVG attribute differ from the client's and trip a hydration
 * mismatch. Every trig-derived value that reaches the DOM goes through this.
 */
export const q = (n: number): number => Math.round(n * 100) / 100;

/* ── Reduced-motion context ─────────────────────────────────────────────── */

const ReducedMotionContext = createContext(false);
export const ReducedMotionProvider = ReducedMotionContext.Provider;
export const useDeckReducedMotion = () => useContext(ReducedMotionContext);

/* ── Slide tone context (light | dark) ──────────────────────────────────── */

export type Tone = "light" | "dark";
const ToneContext = createContext<Tone>("light");
export const ToneProvider = ToneContext.Provider;
export const useTone = () => useContext(ToneContext);

/** Ink colours resolved against the current slide tone. */
export function useInk() {
  const tone = useTone();
  return tone === "dark"
    ? {
        primary: "var(--ink-inv)",
        secondary: "var(--ink-inv-2)",
        muted: "var(--ink-inv-3)",
        faint: "var(--ink-inv-4)",
        rule: "var(--rule-inv)",
        tone,
      }
    : {
        primary: "var(--ink)",
        secondary: "var(--ink-2)",
        muted: "var(--ink-3)",
        faint: "var(--ink-4)",
        rule: "var(--rule)",
        tone,
      };
}

/* ═══════════════════════════════════════════════════════════════════════════
   RISE — the deck's only entrance animation
   ═══════════════════════════════════════════════════════════════════════════ */

interface RiseProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  /** Vertical travel in stage px. Kept small on purpose. */
  y?: number;
  x?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "span" | "li" | "p" | "h1" | "h2" | "section";
}

export function Rise({
  children,
  delay = 0,
  duration = DUR.base,
  y = 18,
  x = 0,
  className,
  style,
}: RiseProps) {
  const reduced = useDeckReducedMotion();

  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={t(duration, delay)}
    >
      {children}
    </motion.div>
  );
}

/** Fade only — for backdrops and large graphic layers. */
export function Fade({
  children,
  delay = 0,
  duration = DUR.slow,
  className,
  style,
}: Omit<RiseProps, "y" | "x">) {
  const reduced = useDeckReducedMotion();

  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={t(duration, delay)}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYOUT — slide frame + section header
   ═══════════════════════════════════════════════════════════════════════════ */

interface SlideBodyProps {
  children: ReactNode;
  /** Overrides the default 120px gutter. */
  padding?: string | number;
  style?: CSSProperties;
  center?: boolean;
}

/** Standard content well inside the 1920×1080 stage. */
export function SlideBody({ children, padding, style, center }: SlideBodyProps) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        padding: padding ?? "var(--gutter)",
        display: "flex",
        flexDirection: "column",
        justifyContent: center ? "center" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface EyebrowProps {
  /** Section number, e.g. "§ 04". Rendered in accent green. */
  index?: string;
  children: ReactNode;
  delay?: number;
}

/**
 * The product's signature section marker: accent-green numeral, then a muted
 * uppercase label. Scaled up for projection.
 */
export function Eyebrow({ index, children, delay = 0 }: EyebrowProps) {
  const ink = useInk();
  return (
    <Rise delay={delay} y={10} duration={DUR.quick}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {index && (
          <span className="t-eyebrow accent" style={{ whiteSpace: "nowrap" }}>
            {index}
          </span>
        )}
        {index && (
          <span
            style={{
              width: 26,
              height: 1,
              background: ink.faint,
              flexShrink: 0,
            }}
          />
        )}
        <span className="t-eyebrow" style={{ color: ink.muted }}>
          {children}
        </span>
      </div>
    </Rise>
  );
}

/** Thin horizontal rule used to separate the header from the composition. */
export function Rule({
  delay = 0,
  width = "100%",
  accentWidth = 0,
}: {
  delay?: number;
  width?: string | number;
  /** Length of the leading accent segment, in stage px. */
  accentWidth?: number;
}) {
  const ink = useInk();
  const reduced = useDeckReducedMotion();

  return (
    <div style={{ position: "relative", width, height: 1, overflow: "hidden" }}>
      <motion.div
        initial={reduced ? undefined : { scaleX: 0 }}
        animate={reduced ? undefined : { scaleX: 1 }}
        transition={t(DUR.slow, delay)}
        style={{
          height: 1,
          background: ink.rule,
          transformOrigin: "left center",
        }}
      />
      {accentWidth > 0 && (
        <motion.div
          initial={reduced ? undefined : { scaleX: 0 }}
          animate={reduced ? undefined : { scaleX: 1 }}
          transition={t(DUR.slow, delay + 0.1)}
          className="accent-rule"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: accentWidth,
            height: 1,
            transformOrigin: "left center",
          }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PLACEHOLDERS
   ═══════════════════════════════════════════════════════════════════════════ */

interface MediaPlaceholderProps {
  /** Shown inside the frame, e.g. "Screenshot — carte interactive". */
  label: string;
  width?: string | number;
  height?: string | number;
  /** Optional aspect hint displayed under the label. */
  ratio?: string;
  delay?: number;
  style?: CSSProperties;
}

/**
 * Replace with an <img>/<Image> when the real screenshot is available — the
 * frame keeps its dimensions, so the layout will not move.
 */
export function MediaPlaceholder({
  label,
  width = "100%",
  height = 320,
  ratio,
  delay = 0,
  style,
}: MediaPlaceholderProps) {
  const ink = useInk();
  const tone = ink.tone;

  return (
    <Rise delay={delay} y={16}>
      <div
        className="ted-media"
        data-tone={tone}
        style={{ width, height, ...style }}
        role="img"
        aria-label={`Emplacement image : ${label}`}
      >
        {/* Corner ticks */}
        <span
          className="ted-media-tick"
          style={{ top: 12, left: 12, borderTopWidth: 1, borderLeftWidth: 1 }}
        />
        <span
          className="ted-media-tick"
          style={{ top: 12, right: 12, borderTopWidth: 1, borderRightWidth: 1 }}
        />
        <span
          className="ted-media-tick"
          style={{ bottom: 12, left: 12, borderBottomWidth: 1, borderLeftWidth: 1 }}
        />
        <span
          className="ted-media-tick"
          style={{
            bottom: 12,
            right: 12,
            borderBottomWidth: 1,
            borderRightWidth: 1,
          }}
        />

        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <div
            className="t-micro"
            style={{ color: ink.muted, marginBottom: 7 }}
          >
            {label}
          </div>
          {ratio && (
            <div style={{ fontSize: 12, color: ink.faint, letterSpacing: "0.08em" }}>
              {ratio}
            </div>
          )}
        </div>
      </div>
    </Rise>
  );
}

/**
 * A figure that must not be invented. Renders a clearly marked slot until a
 * real value is supplied in presentationData.ts.
 */
export function DataPlaceholder({
  label,
  value,
  hint,
}: {
  label: string;
  value?: string | null;
  hint?: string;
}) {
  const ink = useInk();

  if (value) {
    return (
      <div>
        <div
          className="t-h3"
          style={{ color: ink.primary, fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </div>
        <div className="t-micro" style={{ color: ink.muted, marginTop: 6 }}>
          {label}
        </div>
      </div>
    );
  }

  return (
    <div>
      <span
        className="ted-data-slot"
        data-tone={ink.tone}
        title={hint ? `À remplir · ${hint}` : "À remplir"}
      >
        {"{DATA_TO_FILL}"}
      </span>
      <div className="t-micro" style={{ color: ink.muted, marginTop: 9 }}>
        {label}
      </div>
    </div>
  );
}
