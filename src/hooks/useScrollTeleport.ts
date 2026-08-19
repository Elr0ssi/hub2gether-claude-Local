"use client";

import { useEffect } from "react";

/** Fired on `window` right after the page jumps to a section. */
export const TELEPORT_EVENT = "eco-teleport";

export interface TeleportDetail {
  /** Index of the arriving section, or -1 for the hero above them. */
  index: number;
  /** 1 when moving down the page, -1 when moving up. */
  dir: 1 | -1;
}

/** How long the page takes to roll from one stop to the next, in ms. */
const ROLL_MS = 1050;
/** Gestures land on the next stop no sooner than this, in ms. */
const COOLDOWN = ROLL_MS + 60;
/** Wheel deltas below this are treated as noise, not as a page gesture. */
const WHEEL_THRESHOLD = 8;
/**
 * Quiet time that has to pass before a new wheel gesture is recognised.
 *
 * A trackpad flick emits events for well over a second, so a cooldown alone
 * let one physical gesture spend itself on two sections — most visibly going
 * up, where the momentum tail is longest. A gesture now has to end before the
 * next one counts, and the gap is wide enough that a busy main thread
 * delaying the momentum tail cannot fake a gesture boundary.
 */
const GESTURE_GAP = 340;
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
  /**
   * `"top"` (default) treats the top of the page as the first stop, so the
   * run starts from whatever sits above the first matched section.
   * `"first"` starts the run at the first matched section and leaves
   * everything above it to ordinary scrolling.
   */
  startAt?: "top" | "first";
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
export function useScrollTeleport({ selector, offset, enabled = true, startAt = "top" }: Options) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = 0;
    let rollFrame = 0;
    let lastWheel = 0;
    let rolling = false;
    // Set the moment a gesture moves the page, cleared only once that gesture
    // has demonstrably ended. One gesture therefore buys exactly one section.
    let spent = false;
    /** True while the run, rather than the browser, is answering the gesture. */
    let owns = false;
    /** Wheel travel accumulated since the gesture began. */
    let travel = 0;

    // The page rolls to the next stop rather than cutting to it: one gesture
    // still resolves to exactly one section, but the movement between them is
    // visible, so the sections read as a single strip passing by instead of a
    // sequence of jump cuts. A new gesture retargets the roll in flight.
    //
    // Smootherstep: its first and second derivatives are both zero at each
    // end, so there is no kick leaving a section and no thump arriving at the
    // next — the page just starts moving, glides, and comes to rest. It reads
    // as the page scrolling itself rather than as a cut with an ease painted
    // on it, and the curve keeps that true at any duration.
    const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

    const rollTo = (target: number) => {
      cancelAnimationFrame(rollFrame);
      const from = window.scrollY;
      const delta = target - from;
      if (Math.abs(delta) < 2) {
        window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
        return;
      }
      const started = performance.now();
      rolling = true;
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / ROLL_MS);
        window.scrollTo({
          top: from + delta * smootherstep(t),
          behavior: "instant" as ScrollBehavior,
        });
        if (t < 1) rollFrame = requestAnimationFrame(step);
        else rolling = false;
      };
      rollFrame = requestAnimationFrame(step);
    };

    const stops = (): { tops: number[]; heights: number[]; end: number; floor: number } | null => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
      if (els.length === 0) return null;
      const tops: number[] = [];
      const heights: number[] = [];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        tops.push(Math.round(r.top + window.scrollY - offset));
        heights.push(Math.round(r.height));
      }
      // Whatever follows the last section is a stop too, otherwise the page
      // would be sealed shut. Under "top", so is the page's own top, which is
      // where the hero above the first section lives.
      const end = tops[tops.length - 1] + heights[heights.length - 1];
      if (startAt === "first") {
        return { tops: [...tops, end], heights: [...heights, 0], end, floor: tops[0] };
      }
      return { tops: [0, ...tops, end], heights: [0, ...heights, 0], end, floor: 0 };
    };

    /**
     * Content the reader is meant to scroll through, marked in the markup.
     * Inside one of these the wheel belongs to the content and to nothing
     * else — not even at its end, or the page would jump out from under a
     * reader who simply reached the bottom of a table.
     */
    const insideScrollRegion = (target: EventTarget | null): boolean => {
      const el = target instanceof Element ? target : null;
      return Boolean(el?.closest("[data-scroll-region]"));
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

    /**
     * Does this gesture belong to the run at all? Asked before the page has
     * moved a pixel, so a gesture the run is going to answer can be taken off
     * the browser from its very first event — otherwise the head of a flick
     * nudges the page a few pixels and its momentum tail carries it past the
     * stop, which is exactly what a reader sees as the page "jumping".
     */
    const owned = (dir: 1 | -1, target: EventTarget | null): number | null => {
      const s = stops();
      if (!s) return null;

      const y = window.scrollY;
      const viewport = window.innerHeight - offset;

      // Outside the run of sections — hand the page back.
      if (y < s.floor - EPSILON || y > s.end + EPSILON) return null;

      let i = 0;
      for (let k = 0; k < s.tops.length; k++) {
        if (y >= s.tops[k] - EPSILON) i = k;
      }
      const next = i + dir;
      if (next < 0 || next >= s.tops.length) return null;

      // Past the last section: let the page below scroll normally.
      if (dir > 0 && i === s.tops.length - 1) return null;

      if (insideScrollRegion(target)) return null;
      if (innerCanScroll(target, dir)) return null;

      // A section that does not fit is read by scrolling, not by jumping —
      // until its far edge is on screen.
      const h = s.heights[i];
      if (h > viewport) {
        const bottom = s.tops[i] + h;
        if (dir > 0 && y + viewport < bottom - EPSILON) return null;
        if (dir < 0 && y > s.tops[i] + EPSILON) return null;
      }
      return next;
    };

    const jump = (dir: 1 | -1, target: EventTarget | null): boolean => {
      const s = stops();
      const next = owned(dir, target);
      if (!s || next === null) return false;

      const now = performance.now();
      // Locked while the page is still travelling, and until the gesture that
      // started it has actually ended.
      if (rolling || now - last < COOLDOWN) return true;
      last = now;

      rollTo(s.tops[next]);
      // Announce the move so the arriving section can answer it — see
      // SectionFlowCurves, which throws its sheaf the other way.
      window.dispatchEvent(
        new CustomEvent<TeleportDetail>(TELEPORT_EVENT, {
          detail: { index: startAt === "first" ? next : next - 1, dir },
        })
      );
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch zoom
      // Something nearer the pointer already answered this wheel — the globe
      // zooming, say. Whoever consumed it owns it; the page stays put.
      if (e.defaultPrevented) return;

      const now = performance.now();
      // A gesture is over once the wheel has been quiet for long enough — and
      // never while the page is still travelling, since the momentum tail of
      // the flick that started the roll is exactly what would otherwise be
      // mistaken for the next gesture.
      const fresh = !rolling && now - lastWheel >= GESTURE_GAP;
      lastWheel = now;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      if (fresh) {
        spent = false;
        travel = 0;
        owns = owned(e.deltaY > 0 ? 1 : -1, e.target) !== null;
      }

      // Owned means owned for the whole gesture: the browser never sees its
      // head, so the page cannot creep before the roll starts, and never sees
      // its tail, so the page cannot drift past the stop after it ends.
      if (owns) e.preventDefault();
      if (spent || !owns) return;

      // Summed rather than tested event by event: a flick opens with a couple
      // of pixels, and a slow drag never sends more than that at a time.
      travel += e.deltaY;
      if (Math.abs(travel) < WHEEL_THRESHOLD) return;
      spent = true;
      jump(travel > 0 ? 1 : -1, e.target);
    };

    let touchY: number | null = null;
    // A finger down is unambiguously the start of a new gesture.
    let touchSpent = false;
    let touchOwns = false;
    let touchDecided = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
      touchSpent = false;
      touchOwns = false;
      touchDecided = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.defaultPrevented) return;
      if (touchY === null) return;
      // Measured from where the finger landed, so one drag is one section
      // however far it travels.
      const dy = touchY - (e.touches[0]?.clientY ?? touchY);
      if (!touchDecided && Math.abs(dy) >= 4) {
        touchDecided = true;
        touchOwns = owned(dy > 0 ? 1 : -1, e.target) !== null;
      }
      if (touchOwns) e.preventDefault();
      if (touchSpent || !touchOwns) return;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      touchSpent = true;
      jump(dy > 0 ? 1 : -1, e.target);
    };
    const onTouchEnd = () => {
      touchY = null;
      touchSpent = false;
      touchOwns = false;
      touchDecided = false;
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
      cancelAnimationFrame(rollFrame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [selector, offset, enabled, startAt]);
}
