"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Deck controller for Soutenance 2.
 *
 * A fork of the V1 `usePresentation` rather than a shared hook: V1 binds its
 * slide list at module scope, and V2 must be able to evolve — different slide
 * count, an annex layer, its own keys — without a single edit reaching the
 * deck that is already rehearsed.
 *
 * Keys: → / ↓ / Space / n next · ← / ↑ / p previous · Home / End ·
 * F fullscreen · O summary · A annexes · Esc close overlay.
 */
/* ── Step within the current slide ──────────────────────────────────────────
   A slide can hold several states — one scene that transforms rather than
   several slides that replace each other. The step is published through a
   context so a slide reads it without every slide having to take a prop. */
const SlideStepContext = createContext(0);
export const SlideStepProvider = SlideStepContext.Provider;
export const useSlideStep = () => useContext(SlideStepContext);

export interface DeckController {
  index: number;
  /** State within the current slide; 0 for every single-state slide. */
  step: number;
  /** +1 forward, -1 backward — drives the direction of the slide transition. */
  direction: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
  fullscreen: boolean;
  toggleFullscreen: () => void;
  overviewOpen: boolean;
  setOverviewOpen: (open: boolean) => void;
  /** Index into the annex list, or null when no annex is open. */
  annexIndex: number | null;
  openAnnex: (i: number) => void;
  closeAnnex: () => void;
}

export function useDeck(
  total: number,
  annexCount: number,
  initialSlide?: number,
  /** States held by the slide at `index`. Defaults to one. */
  stepsAt: (index: number) => number = () => 1
): DeckController {
  const last = Math.max(0, total - 1);

  const clamp = useCallback(
    (n: number) => (Number.isNaN(n) ? 0 : Math.min(Math.max(n, 0), last)),
    [last]
  );

  const [index, setIndex] = useState(() =>
    typeof initialSlide === "number" ? Math.min(Math.max(initialSlide - 1, 0), last) : 0
  );
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [annexIndex, setAnnexIndex] = useState<number | null>(null);

  // Refs so the keyboard handler never needs to be re-bound.
  const indexRef = useRef(index);
  indexRef.current = index;
  const stepRef = useRef(step);
  stepRef.current = step;
  const stepsRef = useRef(stepsAt);
  stepsRef.current = stepsAt;
  const overlayRef = useRef(false);
  overlayRef.current = overviewOpen || annexIndex !== null;
  const annexRef = useRef(annexIndex);
  annexRef.current = annexIndex;

  const goTo = useCallback(
    (target: number) => {
      const c = clamp(target);
      setDirection(c >= indexRef.current ? 1 : -1);
      setIndex(c);
      setStep(0);
    },
    [clamp]
  );

  // Forward walks the current slide's states before it walks to the next
  // slide, so one scene can hold a sequence without splitting into several.
  const next = useCallback(() => {
    const i = indexRef.current;
    if (stepRef.current < stepsRef.current(i) - 1) {
      setStep((n) => n + 1);
      return;
    }
    if (i >= last) return;
    setDirection(1);
    setIndex(i + 1);
    setStep(0);
  }, [last]);

  // Backward is its mirror: stepping out of a slide lands on the last state
  // of the one before, which is where the presenter left it.
  const prev = useCallback(() => {
    const i = indexRef.current;
    if (stepRef.current > 0) {
      setStep((n) => n - 1);
      return;
    }
    if (i <= 0) return;
    setDirection(-1);
    setIndex(i - 1);
    setStep(Math.max(0, stepsRef.current(i - 1) - 1));
  }, []);

  const openAnnex = useCallback(
    (i: number) => setAnnexIndex(Math.min(Math.max(i, 0), Math.max(0, annexCount - 1))),
    [annexCount]
  );
  const closeAnnex = useCallback(() => setAnnexIndex(null), []);

  /* ── Deep-link sync: `?slide=N` follows navigation ────────────────────── */
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("slide", String(index + 1));
    // replaceState keeps the deck out of the browser's history stack, so the
    // back button leaves the presentation instead of stepping through slides.
    window.history.replaceState(null, "", url.toString());
  }, [index]);

  /* ── Keyboard ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Spacebar":
        case "n":
          e.preventDefault();
          if (overlayRef.current) {
            if (annexRef.current !== null) {
              setAnnexIndex((i) => (i === null ? null : Math.min(i + 1, annexCount - 1)));
            }
            return;
          }
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "p":
          e.preventDefault();
          if (overlayRef.current) {
            if (annexRef.current !== null) {
              setAnnexIndex((i) => (i === null ? null : Math.max(i - 1, 0)));
            }
            return;
          }
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(last);
          break;
        case "f":
          e.preventDefault();
          void toggleFullscreenImpl();
          break;
        case "o":
          e.preventDefault();
          setAnnexIndex(null);
          setOverviewOpen((v) => !v);
          break;
        case "a":
          e.preventDefault();
          setOverviewOpen(false);
          setAnnexIndex((i) => (i === null ? 0 : null));
          break;
        case "Escape":
          if (overlayRef.current) {
            e.preventDefault();
            setOverviewOpen(false);
            setAnnexIndex(null);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, goTo, last, annexCount]);

  /* ── Fullscreen ───────────────────────────────────────────────────────── */
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    void toggleFullscreenImpl();
  }, []);

  return {
    index,
    step,
    direction,
    next,
    prev,
    goTo,
    isFirst: index === 0,
    isLast: index === last,
    fullscreen,
    toggleFullscreen,
    overviewOpen,
    setOverviewOpen,
    annexIndex,
    openAnnex,
    closeAnnex,
  };
}

async function toggleFullscreenImpl() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // Fullscreen can be blocked by the browser; the deck stays usable windowed.
  }
}
