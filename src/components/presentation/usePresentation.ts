"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "@/data/presentation/presentationData";

const LAST = SLIDES.length - 1;

function clampIndex(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(Math.max(n, 0), LAST);
}

/** Reads `?slide=` (1-based) once, on mount. */
function readInitialIndex(initial?: number): number {
  if (typeof initial === "number") return clampIndex(initial - 1);
  return 0;
}

export interface PresentationController {
  index: number;
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
}

export function usePresentation(initialSlide?: number): PresentationController {
  const [index, setIndex] = useState(() => readInitialIndex(initialSlide));
  const [direction, setDirection] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);

  // Keep a ref so the keyboard handler never needs to be re-bound.
  const indexRef = useRef(index);
  indexRef.current = index;
  const overviewRef = useRef(overviewOpen);
  overviewRef.current = overviewOpen;

  const goTo = useCallback((target: number) => {
    const clamped = clampIndex(target);
    setDirection(clamped >= indexRef.current ? 1 : -1);
    setIndex(clamped);
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => Math.min(i + 1, LAST));
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

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
      // Never hijack keys while a control has focus and is being activated.
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Spacebar":
        case "n":
          e.preventDefault();
          if (overviewRef.current) return;
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "p":
          e.preventDefault();
          if (overviewRef.current) return;
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(LAST);
          break;
        case "f":
          e.preventDefault();
          void toggleFullscreenImpl();
          break;
        case "o":
          e.preventDefault();
          setOverviewOpen((v) => !v);
          break;
        case "Escape":
          if (overviewRef.current) {
            e.preventDefault();
            setOverviewOpen(false);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, goTo]);

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
    direction,
    next,
    prev,
    goTo,
    isFirst: index === 0,
    isLast: index === LAST,
    fullscreen,
    toggleFullscreen,
    overviewOpen,
    setOverviewOpen,
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
