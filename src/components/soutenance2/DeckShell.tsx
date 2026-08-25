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
  BookMarked,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import {
  ACT_LABELS,
  S2_ANNEXES,
  S2_SLIDES,
  S2_TOTAL_SECONDS,
  type Act,
} from "@/data/soutenance2/soutenance2Data";
import { SlideStepProvider, useDeck } from "./useDeck";
import { S2_VIEWS } from "./slides";
import { ANNEX_VIEWS } from "./annexes";
import {
  EASE,
  ReducedMotionProvider,
  ToneProvider,
} from "@/components/presentation/primitives";
// The V1 stylesheet is reused as-is — same stage, same type scale, same
// chrome. It is imported, never edited: V1 must keep behaving exactly as it
// does today.
import "@/components/presentation/presentation.css";

/** States held by the slide at `index` — see `Slide2.steps`. */
const stepsAt = (index: number) => S2_SLIDES[index]?.steps ?? 1;

const STAGE_W = 1920;
const STAGE_H = 1080;
const RAIL_W = 400;

interface DeckShellProps {
  /** 1-based slide from `?slide=`. */
  initialSlide?: number;
  /** `?presenter=true` — notes, timer, next slide and annex access. */
  presenter?: boolean;
}

export function DeckShell({ initialSlide, presenter = false }: DeckShellProps) {
  const deck = useDeck(S2_SLIDES.length, S2_ANNEXES.length, initialSlide, stepsAt);
  const {
    index,
    step,
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
    annexIndex,
    openAnnex,
    closeAnnex,
  } = deck;

  const prefersReduced = useReducedMotion();
  const reduced = Boolean(prefersReduced);

  const slide = S2_SLIDES[index];
  const tone = slide.tone ?? "light";
  const View = S2_VIEWS[slide.id];
  const overlayOpen = overviewOpen || annexIndex !== null;

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
      if (e.target instanceof Element && e.target.closest("a, button, [data-no-advance]")) {
        return;
      }
      if (overlayOpen) return;
      next();
    },
    [next, overlayOpen]
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
      enter: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir > 0 ? 44 : -44 }),
      center: { opacity: 1, x: 0 },
      exit: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir > 0 ? -28 : 28 }),
    }),
    [reduced]
  );

  const progress = (index + 1) / S2_SLIDES.length;
  const chromeClass =
    tone === "dark" ? "ted-ctrl ted-ctrl-on-dark" : "ted-ctrl ted-ctrl-on-light";

  return (
    <ReducedMotionProvider value={reduced}>
      <div
        className="ted-deck ted-deck-root"
        /* Le pourtour prend la couleur de la slide. Il était noir quelle que
           soit la slide : sur une slide claire, le cadre se voyait comme deux
           bandes noires sur les côtés, et la projection n'occupait plus
           l'écran. Même fond de part et d'autre, la limite disparaît. */
        style={{ background: tone === "dark" ? "var(--slide-dark)" : "var(--slide-light)" }}
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
                  background: tone === "dark" ? "var(--slide-dark)" : "var(--slide-light)",
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} sur ${S2_SLIDES.length} · ${slide.label}`}
              >
                <ToneProvider value={tone}>
                  <SlideStepProvider value={step}>{View ? <View /> : null}</SlideStepProvider>
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
              <span style={{ opacity: 0.5 }}> / {S2_SLIDES.length}</span>
            </div>

            {/* Progress */}
            <div
              className="ted-chrome ted-chrome-progress"
              style={{
                background: tone === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
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
        {/* Les commandes s'effacent en plein écran : elles n'ont plus à être là
            quand la slide est projetée. Elles réapparaissent au passage de la
            souris, si bien qu'elles restent atteignables sans jamais s'inviter
            dans le champ pendant qu'on parle. Le clavier, lui, ne change pas. */}
        <div
          className={`ted-controls${fullscreen ? " ted-controls-hidden" : ""}`}
          data-no-advance
          style={{ right: presenter ? RAIL_W + 28 : 28 }}
        >
          <button
            type="button"
            className={chromeClass}
            onClick={() => {
              closeAnnex();
              setOverviewOpen(true);
            }}
            aria-label="Ouvrir le sommaire"
            title="Sommaire (O)"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            className={chromeClass}
            onClick={() => {
              setOverviewOpen(false);
              openAnnex(0);
            }}
            aria-label="Ouvrir les annexes"
            title="Annexes (A)"
          >
            <BookMarked size={16} />
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
        {presenter && <PresenterRail index={index} onJump={goTo} onAnnex={openAnnex} />}

        {/* ── Overlays ───────────────────────────────────────────────────── */}
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
          {annexIndex !== null && (
            <AnnexOverlay index={annexIndex} onSelect={openAnnex} onClose={closeAnnex} />
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
  onAnnex,
}: {
  index: number;
  onJump: (i: number) => void;
  onAnnex: (i: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const slide = S2_SLIDES[index];
  const nextSlide = S2_SLIDES[index + 1];

  // Indicative budget up to and including the current slide.
  const budget = S2_SLIDES.slice(0, index + 1).reduce((n, s) => n + s.seconds, 0);
  const behind = elapsed > budget;

  return (
    <aside className="ted-presenter-rail" data-no-advance aria-label="Mode présentateur">
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
        <div className="t-small" style={{ color: "var(--ink-inv-3)", marginTop: 4 }}>
          Repère : {formatClock(budget)} · cible totale {formatClock(S2_TOTAL_SECONDS)}
        </div>
      </div>

      <div className="ted-presenter-block">
        <div className="t-micro accent">
          Slide {String(index + 1).padStart(2, "0")} · {ACT_LABELS[slide.act]}
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
        <div className="t-small" style={{ color: "var(--ink-inv-3)", marginTop: 4 }}>
          {formatClock(slide.seconds)} indicatives
        </div>
      </div>

      <div className="ted-presenter-block" style={{ flex: 1 }}>
        <div className="t-micro" style={{ color: "var(--ink-inv-4)", marginBottom: 11 }}>
          Notes orales
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.62, color: "rgba(255,255,255,0.82)" }}>
          {slide.speakerNotes}
        </p>
      </div>

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
            <span style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.78)" }}>
              {nextSlide.label}
            </span>
          </button>
        ) : (
          <span className="t-small" style={{ color: "var(--ink-inv-3)" }}>
            Fin de la présentation
          </span>
        )}
      </div>

      <div className="ted-presenter-block">
        <div className="t-micro" style={{ color: "var(--ink-inv-4)", marginBottom: 9 }}>
          Annexes
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {S2_ANNEXES.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onAnnex(i)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100,
                padding: "6px 12px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.8)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {a.index} · {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="t-small" style={{ color: "var(--ink-inv-4)", fontSize: 13, lineHeight: 1.6 }}>
        → / Space suivant · ← précédent · F plein écran · O sommaire · A annexes
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW — "O"
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
  const indexed = S2_SLIDES.map((s, i) => ({ s, i }));
  const columns: { title: string; rows: typeof indexed }[] = (
    ["pitch", "pivot", "depth"] as Act[]
  ).map((act) => ({
    title: ACT_LABELS[act],
    rows: indexed.filter(({ s }) => s.act === act),
  }));

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
          <div className="t-eyebrow accent">The Essential Data · Soutenance 2</div>
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
          <X size={16} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px 1fr", gap: 40 }}>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="t-micro" style={{ color: "rgba(255,255,255,0.38)", marginBottom: 15 }}>
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

      <div
        className="t-small"
        style={{ color: "rgba(255,255,255,0.4)", marginTop: 36 }}
      >
        Annexes : touche A
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANNEXES — "A". Outside the fifteen, on purpose.
   ═══════════════════════════════════════════════════════════════════════════ */

function AnnexOverlay({
  index,
  onSelect,
  onClose,
}: {
  index: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  const annex = S2_ANNEXES[index];
  const View = ANNEX_VIEWS[annex.id];

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
      aria-label="Annexes"
      style={{ overflowY: "auto" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 26,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {S2_ANNEXES.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(i)}
              style={{
                background: i === index ? "rgba(57,255,136,0.14)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${i === index ? "rgba(57,255,136,0.45)" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 100,
                padding: "8px 16px",
                cursor: "pointer",
                color: i === index ? "#39FF88" : "rgba(255,255,255,0.72)",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {a.index} · {a.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ted-ctrl ted-ctrl-on-dark"
          style={{ opacity: 1 }}
          aria-label="Fermer les annexes"
        >
          <X size={16} />
        </button>
      </div>

      {/* Annexes render on the deck's dark ground, using the same ink scale. */}
      <div
        style={{
          background: "var(--slide-dark)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "34px 40px 40px",
        }}
      >
        <ToneProvider value="dark">{View ? <View /> : null}</ToneProvider>
      </div>
    </motion.div>
  );
}
