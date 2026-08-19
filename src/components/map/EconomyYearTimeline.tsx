"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Globe } from "lucide-react";

interface EconomyYearTimelineProps {
  min: number;
  max: number;
  /** Years the dataset actually covers — they carry the large marks. */
  dataYears: number[];
  /** Year the reader has picked (any year in range). */
  value: number;
  /** Year whose figures are on screen — the nearest covered year. */
  dataYear: number;
  onChange: (year: number) => void;
  countryCount: number;
  liveMode: boolean;
  onLive: () => void;
}

/**
 * Year rail: one mark per year between `min` and `max`, the covered years
 * raised and labelled, the selection carried by a ring that glides from one
 * mark to the next.
 *
 * The whole rail is a slider: click a mark, drag across it, or use the arrow
 * keys. Years the dataset does not cover stay selectable and fall back to the
 * nearest covered year, which the caption names rather than hides.
 */
export function EconomyYearTimeline({
  min,
  max,
  dataYears,
  value,
  dataYear,
  onChange,
  countryCount,
  liveMode,
  onLive,
}: EconomyYearTimelineProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [railWidth, setRailWidth] = useState(0);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const measure = () => setRailWidth(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const reduced = useReducedMotion();

  const years = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const span = max - min;

  // Labels: the endpoints, the selection, every decade and every covered year
  // — but never two close enough to collide. The spacing has to be measured,
  // not assumed: two years is comfortable on a desktop rail and overlapping
  // mush on a phone, where the same span is a fifth of the width.
  const MIN_LABEL_GAP = useMemo(() => {
    if (!railWidth) return 2;
    const perYear = railWidth / Math.max(1, max - min);
    return Math.max(2, Math.ceil(46 / perYear));
  }, [railWidth, min, max]);
  const labelled = useMemo(() => {
    const kept: number[] = [];
    const take = (y: number) => {
      if (y < min || y > max) return;
      if (kept.some((k) => Math.abs(k - y) < MIN_LABEL_GAP)) return;
      kept.push(y);
    };
    take(value);
    take(min);
    take(max);
    for (let y = min; y <= max; y++) if (y % 10 === 0) take(y);
    return new Set(kept);
  }, [min, max, value, MIN_LABEL_GAP]);

  /** Decades and the endpoints — the ruler the eye counts along. */
  const isDecade = useCallback(
    (y: number) => y % 10 === 0 || y === min || y === max,
    [min, max]
  );

  const yearAtClientX = useCallback(
    (clientX: number) => {
      const el = railRef.current;
      if (!el) return value;
      const r = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      return min + Math.round(ratio * span);
    },
    [min, span, value]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setScrubbing(true);
      onChange(yearAtClientX(e.clientX));
    },
    [onChange, yearAtClientX]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!scrubbing) return;
      const next = yearAtClientX(e.clientX);
      if (next !== value) onChange(next);
    },
    [scrubbing, value, onChange, yearAtClientX]
  );

  const endScrub = useCallback(() => setScrubbing(false), []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next: number | null = null;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - 1;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + 1;
      if (e.key === "PageDown") next = value - 5;
      if (e.key === "PageUp") next = value + 5;
      if (e.key === "Home") next = min;
      if (e.key === "End") next = max;
      if (next === null) return;
      e.preventDefault();
      onChange(Math.min(max, Math.max(min, next)));
    },
    [value, min, max, onChange]
  );

  const glide = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.6 };

  return (
    <div
      className="px-5 py-2.5 border-b flex flex-col gap-2"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 26, height: 26, background: "rgba(57,255,136,0.14)" }}
        >
          <CalendarDays size={13} style={{ color: "#0D7A40" }} />
        </span>
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-xs font-bold" style={{ color: "var(--ink)" }}>
            Sélection année
          </span>
          <span className="text-sm font-extrabold tabular-nums" style={{ color: "#0D7A40" }}>
            {liveMode ? "En direct" : value}
          </span>
          {!liveMode && dataYear !== value && (
            <span className="text-xs whitespace-nowrap" style={{ color: "var(--ink-4)" }}>
              données {dataYear}
            </span>
          )}
        </div>
        <span
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold shrink-0"
          style={{ color: "var(--ink-2)" }}
        >
          <Globe size={13} style={{ color: "var(--ink-4)" }} />
          <span className="tabular-nums">{countryCount}</span> pays
        </span>
      </div>

      {/* Rail */}
      <div
        className="flex items-stretch gap-4 rounded-xl px-4 py-2"
        style={{ border: "1px solid var(--border)", background: "var(--surface)", width: "100%" }}
      >
        {/* The track is inset from the box so the 2000 and 2025 labels, which
            are centred on their marks, are not clipped by the border. */}
        <div className="relative flex-1" style={{ height: 42, minWidth: 0 }}>
        <div
          ref={railRef}
          role="slider"
          tabIndex={0}
          aria-label="Année"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={String(value)}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endScrub}
          onPointerCancel={endScrub}
          className="absolute select-none"
          style={{
            left: 20,
            right: 20,
            top: 0,
            bottom: 0,
            cursor: scrubbing ? "grabbing" : "pointer",
            touchAction: "none",
          }}
        >
          {/* Labels */}
          <div className="absolute inset-x-0 top-0" style={{ height: 15 }}>
            {years.filter((y) => labelled.has(y)).map((y) => {
              const pct = ((y - min) / span) * 100;
              const active = y === value && !liveMode;
              return (
                <span
                  key={`label-${y}`}
                  className="absolute tabular-nums"
                  style={{
                    left: `${pct}%`,
                    transform: "translateX(-50%)",
                    fontSize: "0.66rem",
                    fontWeight: active ? 700 : 600,
                    color: active ? "#0D7A40" : "var(--ink-3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {y}
                </span>
              );
            })}
          </div>

          {/* Tick stems under the labelled years */}
          <div className="absolute inset-x-0" style={{ top: 16, height: 6 }}>
            {years.filter((y) => labelled.has(y)).map((y) => (
              <span
                key={`stem-${y}`}
                className="absolute"
                style={{
                  left: `${((y - min) / span) * 100}%`,
                  transform: "translateX(-50%)",
                  width: 1,
                  height: 6,
                  background: y === value && !liveMode ? "#0D7A40" : "var(--border)",
                }}
              />
            ))}
          </div>

          {/* Marks, on a baseline that runs the length of the rail */}
          <div className="absolute inset-x-0" style={{ top: 30 }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: -1,
                height: 1,
                background: "var(--border)",
              }}
            />
            {years.map((y) => {
              const pct = ((y - min) / span) * 100;
              const covered = dataYears.includes(y);
              const decade = isDecade(y);
              const active = y === value && !liveMode;
              // Decades are the ruler. Covered years are called out by colour
              // rather than size, so the reader can see at a glance where the
              // dataset actually has figures without losing the count of ten.
              // The selection always carries a full mark, so the ring never
              // closes around an empty spot.
              const size = decade || active ? 10 : covered ? 7 : 4;
              return (
                <span
                  key={`mark-${y}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${pct}%`,
                    transform: "translate(-50%, -50%)",
                    width: size,
                    height: size,
                    background: active
                      ? "#0D7A40"
                      : covered
                      ? "#166534"
                      : decade
                      ? "var(--ink-4)"
                      : "var(--border)",
                    transition: "background 0.2s",
                  }}
                />
              );
            })}

            {/* Selection ring — glides between marks */}
            {!liveMode && (
              <motion.span
                className="absolute rounded-full pointer-events-none"
                animate={{ left: `${((value - min) / span) * 100}%` }}
                transition={glide}
                style={{
                  transform: "translate(-50%, -50%)",
                  width: 20,
                  height: 20,
                  border: "2px solid rgba(13,122,64,0.45)",
                  background: "rgba(57,255,136,0.10)",
                }}
              />
            )}
          </div>
        </div>
        </div>

        <span aria-hidden="true" style={{ width: 1, background: "var(--border)" }} />

        {/* Live */}
        <button
          onClick={onLive}
          className="flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 self-center"
          title="Prorata des données depuis le 1er janvier — PIB au jour actuel"
          style={
            liveMode
              ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
              : { background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)" }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              background: liveMode ? "#39FF88" : "var(--ink-4)",
              boxShadow: liveMode ? "0 0 6px rgba(57,255,136,0.8)" : "none",
              animation: liveMode ? "pulse-glow 2s ease-in-out infinite" : "none",
            }}
          />
          En direct
        </button>
      </div>
    </div>
  );
}
