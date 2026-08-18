"use client";

import { useEffect } from "react";

/** Gestures land on the next stop no sooner than this, in ms. */
const COOLDOWN = 380;
/** Wheel deltas below this are treated as noise, not as a page gesture. */
const WHEEL_THRESHOLD = 8;
/** Vertical travel a touch drag needs before it counts as a gesture. */
const TOUCH_THRESHOLD = 34;
/** Slack when matching the current scroll position against a stop, in px. */
const EPSILON = 3;

interface Options {
  /** Selector for the sections that act as stops. */
  selector: string;
  /** Space kept above a stop — the fixed navbar. */
  offset: number;
  enabled?: boolean;
}

/**
 * Turns a run of sections into discrete stops: one scroll gesture moves the
 * page to the next section in a single step, with no intermediate frame. The
 * reader never ends up straddling two sections.
 *
 * Deliberately narrow so it cannot capture the rest of the page:
 *  - it only acts between the first stop and the end of the last section;
 *  - a gesture over an inner scroller (the ranking table) that can still move
 *    in that direction is left alone;
 *  - a section taller than the viewport is scrolled normally until its far
 *    edge is reached, so nothing becomes unreachable;
 *  - it stands down entirely when the reader asks for reduced motion, which
 *    leaves the CSS scroll-snap fallback in charge.
 */
export function useScrollTeleport({ selector, offset, enabled = true }: Options) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = 0;

    const stops = (): { tops: number[]; heights: number[]; end: number } | null => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
      if (els.length === 0) return null;
      const tops: number[] = [];
      const heights: number[] = [];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        tops.push(Math.round(r.top + window.scrollY - offset));
        heights.push(Math.round(r.height));
      }
      // The hero above the first section is a stop too, and so is whatever
      // follows the last one — otherwise the page would be sealed shut.
      const end = tops[tops.length - 1] + heights[heights.length - 1];
      return { tops: [0, ...tops, end], heights: [0, ...heights, 0], end };
    };

    // An inner scroller under the pointer wins: the ranking table scrolls to
    // its own end before the page moves on.
    const innerCanScroll = (target: EventTarget | null, dir: 1 | -1): boolean => {
      let el = target instanceof Element ? target : null;
      while (el && el !== document.body) {
        const style = getComputedStyle(el);
        const scrolls = /(auto|scroll)/.test(style.overflowY);
        if (scrolls && el.scrollHeight > el.clientHeight + 1) {
          const room =
            dir > 0
              ? el.scrollHeight - el.clientHeight - el.scrollTop > 1
              : el.scrollTop > 1;
          if (room) return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const jump = (dir: 1 | -1, target: EventTarget | null): boolean => {
      const s = stops();
      if (!s) return false;

      const y = window.scrollY;
      const viewport = window.innerHeight - offset;

      // Outside the run of sections — hand the page back.
      if (y < -EPSILON || y > s.end + EPSILON) return false;

      let i = 0;
      for (let k = 0; k < s.tops.length; k++) {
        if (y >= s.tops[k] - EPSILON) i = k;
      }
      const next = i + dir;
      if (next < 0 || next >= s.tops.length) return false;

      // Past the last section: let the page below scroll normally.
      if (dir > 0 && i === s.tops.length - 1) return false;

      if (innerCanScroll(target, dir)) return false;

      // A section that does not fit is read by scrolling, not by jumping —
      // until its far edge is on screen.
      const h = s.heights[i];
      if (h > viewport) {
        const bottom = s.tops[i] + h;
        if (dir > 0 && y + viewport < bottom - EPSILON) return false;
        if (dir < 0 && y > s.tops[i] + EPSILON) return false;
      }

      const now = performance.now();
      if (now - last < COOLDOWN) return true; // swallow, do not stack jumps
      last = now;

      window.scrollTo({ top: s.tops[next], behavior: "instant" as ScrollBehavior });
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch zoom
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (jump(e.deltaY > 0 ? 1 : -1, e.target)) e.preventDefault();
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = touchY - (e.touches[0]?.clientY ?? touchY);
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      touchY = e.touches[0]?.clientY ?? null;
      if (jump(dy > 0 ? 1 : -1, e.target)) e.preventDefault();
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (el && el.getAttribute("role") === "slider") return;
      const dir = e.key === "PageDown" ? 1 : e.key === "PageUp" ? -1 : 0;
      if (!dir) return;
      if (jump(dir as 1 | -1, el)) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [selector, offset, enabled]);
}
