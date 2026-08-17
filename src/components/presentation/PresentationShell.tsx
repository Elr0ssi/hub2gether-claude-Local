"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { SLIDES, TOTAL_MINUTES } from "@/data/presentation/presentationData";
import { usePresentation } from "./usePresentation";
import { ReducedMotionProvider, ToneProvider, EASE } from "./primitives";
import { SLIDE_VIEWS } from "./slides";
import "./presentation.css";

const STAGE_W = 1920;
const STAGE_H = 1080;
const RAIL_W = 400;

interface PresentationShellProps {
  /** 1-based slide from `?slide=`. */
  initialSlide?: number;
  /** `?presenter=true` — notes, timer and next-slide rail. */
  presenter?: boolean;
}

export function PresentationShell({
  initialSlide,
  presenter = false,
}: PresentationShellProps) {
  const {
    index,
    direction,
    next,
    prev,
    goTo,
    isFirst,
    isLast,
    fullscreen,
    toggleFullscreen,
    overviewOpen,
    setOverviewOpen,
  } = usePresentation(initialSlide);

  const prefersReduced = useReducedMotion();
  const reduced = Boolean(prefersReduced);

  const slide = SLIDES[index];
  const tone = slide.tone ?? "light";
  const View = SLIDE_VIEWS[slide.id];

  /* ── Stage scaling: fit 1920×1080 into whatever the projector gives us ── */
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const { width, height } = frame.getBoundingClientRect();
      if (!width || !height) return;
      setScale(Math.min(width / STAGE_W, height / STAGE_H));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [presenter]);

  /* ── Click / tap to advance ───────────────────────────────────────────── */
  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      // Never steal a click meant for a link, a button or the overview.
      if (
        e.target instanceof Element &&
        e.target.closest("a, button, [data-no-advance]")
      ) {
        return;
      }
      if (overviewOpen) return;
      next();
    },
    [next, overviewOpen]
  );

  /* ── Swipe ────────────────────────────────────────────────────────────── */
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      const t0 = e.touches[0];
      touchStart.current = { x: t0.clientX, y: t0.clientY };
    };
    const onEnd = (e: TouchEvent) => {
      const start = touchStart.current;
      if (!start) return;
      const t0 = e.changedTouches[0];
      const dx = t0.clientX - start.x;
      const dy = t0.clientY - start.y;
      touchStart.current = null;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
      if (dx < 0) next();
      else prev();
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  /* ── Slide transition ─────────────────────────────────────────────────── */
  const variants = useMemo(
    () => ({
      enter: (dir: number) => ({
        opacity: 0,
        x: reduced ? 0 : dir > 0 ? 44 : -44,
      }),
      center: { opacity: 1, x: 0 },
      exit: (dir: number) => ({
        opacity: 0,
        x: reduced ? 0 : dir > 0 ? -28 : 28,
      }),
    }),
    [reduced]
  );

  const progress = (index + 1) / SLIDES.length;
  const chromeClass =
    tone === "dark" ? "ted-ctrl ted-ctrl-on-dark" : "ted-ctrl ted-ctrl-on-light";

  return (
    <ReducedMotionProvider value={reduced}>
      <div
        className="ted-deck ted-deck-root"
        style={{ background: tone === "dark" ? "#050505" : "#111111" }}
      >
        {/* ── Stage ──────────────────────────────────────────────────────── */}
        <div
          ref={frameRef}
          className="ted-stage-frame"
          onPointerUp={onPointerUp}
          style={{ right: presenter ? RAIL_W : 0 }}
        >
          <div
            className="ted-stage"
            style={{
              transform: `scale(${scale})`,
              background: tone === "dark" ? "var(--slide-dark)" : "var(--slide-light)",
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  opacity: { duration: reduced ? 0.001 : 0.55, ease: EASE },
                  x: { duration: reduced ? 0.001 : 0.7, ease: EASE },
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    tone === "dark" ? "var(--slide-dark)" : "var(--slide-light)",
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} sur ${SLIDES.length} — ${slide.label}`}
              >
                <ToneProvider value={tone}>
                  {View ? <View /> : null}
                </ToneProvider>
              </motion.div>
            </AnimatePresence>

            {/* Slide number — deliberately almost invisible */}
            <div
              className="t-index"
              style={{
                position: "absolute",
                left: 44,
                bottom: 34,
                zIndex: 40,
                color: tone === "dark" ? "var(--ink-inv-4)" : "var(--ink-5)",
                pointerEvents: "none",
              }}
            >
              {String(index + 1).padStart(2, "0")}
              <span style={{ opacity: 0.5 }}> / {SLIDES.length}</span>
            </div>

            {/* Progress */}
            <div
              className="ted-chrome ted-chrome-progress"
              style={{
                background:
                  tone === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
              }}
            >
              <motion.div
                animate={{ scaleX: progress }}
                initial={false}
                transition={{ duration: reduced ? 0.001 : 0.6, ease: EASE }}
                style={{
                  height: "100%",
                  width: "100%",
                  background: "var(--accent)",
                  transformOrigin: "left center",
                  boxShadow: "0 0 10px rgba(57,255,136,0.55)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Controls ───────────────────────────────────────────────────── */}
        <div
          className="ted-controls"
          data-no-advance
          style={{ right: presenter ? RAIL_W + 28 : 28 }}
        >
          <button
            type="button"
            className={chromeClass}
            onClick={() => setOverviewOpen(true)}
            aria-label="Ouvrir le sommaire"
            title="Sommaire (O)"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            className={chromeClass}
            onClick={prev}
            disabled={isFirst}
            aria-label="Slide précédente"
            title="Précédente (←)"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={chromeClass}
            onClick={next}
            disabled={isLast}
            aria-label="Slide suivante"
            title="Suivante (→)"
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            className={chromeClass}
            onClick={toggleFullscreen}
            aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
            title="Plein écran (F)"
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>

        {/* ── Presenter rail ─────────────────────────────────────────────── */}
        {presenter && (
          <PresenterRail index={index} onJump={goTo} />
        )}

        {/* ── Overview ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {overviewOpen && (
            <Overview
              index={index}
              onSelect={(i) => {
                goTo(i);
                setOverviewOpen(false);
              }}
              onClose={() => setOverviewOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </ReducedMotionProvider>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRESENTER RAIL
   ═══════════════════════════════════════════════════════════════════════════ */

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function PresenterRail({
  index,
  onJump,
}: {
  index: number;
  onJump: (i: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const slide = SLIDES[index];
  const nextSlide = SLIDES[index + 1];

  // Indicative budget up to and including the current slide.
  const budget = SLIDES.slice(0, index + 1).reduce((n, s) => n + s.minutes, 0);
  const behind = elapsed / 60 > budget;

  return (
    <aside className="ted-presenter-rail" data-no-advance aria-label="Mode présentateur">
      {/* Clock */}
      <div>
        <div className="t-micro" style={{ color: "var(--ink-inv-4)" }}>
          Temps écoulé
        </div>
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: behind ? "#FF8A5B" : "#fff",
            marginTop: 6,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatClock(elapsed)}
        </div>
        <div
          className="t-small"
          style={{ color: "var(--ink-inv-3)", marginTop: 4 }}
        >
          Repère : {budget.toFixed(1)} min · cible totale {TOTAL_MINUTES.toFixed(0)} min
        </div>
      </div>

      {/* Current slide */}
      <div className="ted-presenter-block">
        <div className="t-micro accent">
          Slide {String(index + 1).padStart(2, "0")} · Partie {slide.part}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            marginTop: 9,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {slide.label}
        </div>
        <div
          className="t-small"
          style={{ color: "var(--ink-inv-3)", marginTop: 4 }}
        >
          {slide.minutes} min indicatives
        </div>
      </div>

      {/* Speaker notes */}
      <div className="ted-presenter-block" style={{ flex: 1 }}>
        <div className="t-micro" style={{ color: "var(--ink-inv-4)", marginBottom: 11 }}>
          Notes orales
        </div>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.62,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {slide.speakerNotes}
        </p>
      </div>

      {/* Next up */}
      <div className="ted-presenter-block">
        <div className="t-micro" style={{ color: "var(--ink-inv-4)", marginBottom: 9 }}>
          Ensuite
        </div>
        {nextSlide ? (
          <button
            type="button"
            onClick={() => onJump(index + 1)}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            <span className="t-index" style={{ color: "var(--accent)" }}>
              {String(index + 2).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              {nextSlide.label}
            </span>
          </button>
        ) : (
          <span className="t-small" style={{ color: "var(--ink-inv-3)" }}>
            Fin de la présentation
          </span>
        )}
      </div>

      <div
        className="t-small"
        style={{ color: "var(--ink-inv-4)", fontSize: 13, lineHeight: 1.6 }}
      >
        → / Space suivant · ← précédent · F plein écran · O sommaire
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW — hidden by default, opened with "O"
   ═══════════════════════════════════════════════════════════════════════════ */

function Overview({
  index,
  onSelect,
  onClose,
}: {
  index: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  const partI = SLIDES.map((s, i) => ({ s, i })).filter(({ s }) => s.part === "I");
  const partII = SLIDES.map((s, i) => ({ s, i })).filter(
    ({ s }) => s.part !== "I"
  );

  return (
    <motion.div
      className="ted-overview"
      data-no-advance
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label="Sommaire de la présentation"
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 34,
        }}
      >
        <div>
          <div className="t-eyebrow accent">The Essential Data</div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#fff",
              marginTop: 9,
              letterSpacing: "-0.025em",
            }}
          >
            Sommaire
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ted-ctrl ted-ctrl-on-dark"
          style={{ opacity: 1 }}
          aria-label="Fermer le sommaire"
        >
          ✕
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 46 }}>
        {[
          { title: "Partie I — Pitch entrepreneurial", rows: partI },
          { title: "Partie II — Approfondissement", rows: partII },
        ].map((col) => (
          <div key={col.title}>
            <div
              className="t-micro"
              style={{ color: "rgba(255,255,255,0.38)", marginBottom: 15 }}
            >
              {col.title}
            </div>
            <div style={{ display: "grid", gap: 2 }}>
              {col.rows.map(({ s, i }) => (
                <button
                  key={s.id}
                  type="button"
                  className="ted-overview-item"
                  data-active={i === index}
                  onClick={() => onSelect(i)}
                >
                  <span
                    className="t-index"
                    style={{
                      color: i === index ? "var(--accent)" : "rgba(255,255,255,0.3)",
                      minWidth: 26,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 600 }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
