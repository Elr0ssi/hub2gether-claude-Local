"use client";

import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";

export type CurveLayer = "back" | "front";

/** An icon badge riding a strand of the flow. */
export interface FlowIcon {
  id: string;
  icon: LucideIcon;
  /** Index of the strand it sits on. */
  curve: number;
  /** Position along that strand, 0 (left edge) to 1 (right edge). */
  u: number;
}

interface DataFlowCurvesProps {
  /** Category colour — a few strands are tinted with it, the rest stay neutral. */
  accent: string;
  /**
   * `back` is the main band, `front` a sparser set of secondary strands drawn
   * a little higher. Both stay inside the same band above the globe.
   */
  layer?: CurveLayer;
  /** Badges to pin onto the strands. Only the `back` layer carries them. */
  icons?: FlowIcon[];
}

interface Curve {
  /** Offset inside the band, -1 (top) to 1 (bottom). */
  offset: number;
  amp: number;
  freq: number;
  phase: number;
  drift: number;
  width: number;
  alpha: number;
  tinted: boolean;
  dots: number[];
}

interface Ripple {
  x: number;
  y: number;
  born: number;
}

// --- Band geometry, as fractions of the stage height -------------------------
// The strands arc over the globe: highest in the middle, sloping away towards
// the edges, so they accompany the dome's curvature without ever crossing it,
// the title above it or the panel below.
const BAND_APEX = 0.36;
const BAND_EDGE_DROP = 0.19;
const BAND_THICKNESS = 0.075;

// --- Pointer response --------------------------------------------------------
// Not a wave: a short, local shiver. A couple of pixels, a few oscillations,
// gone in under half a second.
const RIPPLE_LIFE = 440; // ms from tap to rest
const RIPPLE_RADIUS = 40; // px — beyond this the strand is untouched
const RIPPLE_LIFT = 2.4; // px peak displacement
const RIPPLE_TRAVEL = 52; // px the shiver creeps outward
const CURSOR_LIFT = 1.2; // px of standing swell under the cursor
const CURSOR_RADIUS = 46;
const MAX_RIPPLES = 6;
const SAMPLES = 74;

// Deterministic pseudo-random so server and client agree and the field looks
// identical on every reload.
function rand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildCurves(layer: CurveLayer): Curve[] {
  const next = rand(layer === "back" ? 20250729 : 78123401);
  const count = layer === "back" ? 7 : 3;
  const curves: Curve[] = [];

  for (let i = 0; i < count; i++) {
    const spread = i / (count - 1);
    curves.push({
      offset: layer === "back" ? spread * 2 - 1 : spread * 1.1 - 1.5,
      amp: 0.008 + next() * 0.013,
      freq: 0.8 + next() * 1.1,
      phase: next() * Math.PI * 2,
      drift: (0.04 + next() * 0.07) * (next() > 0.5 ? 1 : -1),
      width: layer === "back" ? 0.9 + next() * 0.6 : 0.8 + next() * 0.5,
      alpha: layer === "back" ? 0.14 + next() * 0.12 : 0.06 + next() * 0.05,
      tinted: next() > 0.4,
      // Data nodes riding the strand, at fixed positions along it.
      dots: Array.from({ length: Math.round(next() * 2.4) }, () => 0.08 + next() * 0.84),
    });
  }
  return curves;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function DataFlowCurves({ accent, layer = "back", icons = [] }: DataFlowCurvesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const curves = buildCurves(layer);
    const [ar, ag, ab] = hexToRgb(accent);

    let W = 0;
    let H = 0;
    // Amplitude follows the narrower of the two axes: on a phone, scaling off
    // height alone turns gentle flows into scribbles.
    let ampScale = 0;
    let visible = curves;
    let rect = parent.getBoundingClientRect();

    const resize = () => {
      rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      ampScale = Math.min(H, W * 0.55);
      visible = W < 660 ? curves.filter((_, i) => i % 2 === 0) : curves;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // --- Pointer state -------------------------------------------------------
    const ripples: Ripple[] = [];
    let cursorX = -9999;
    let cursorY = -9999;
    let cursorFade = 0;
    let lastSpawnX = -9999;
    let lastSpawnY = -9999;
    let lastSpawnAt = 0;

    const onMove = (e: MouseEvent) => {
      cursorX = e.clientX - rect.left;
      cursorY = e.clientY - rect.top;
      if (cursorX < -40 || cursorY < -40 || cursorX > W + 40 || cursorY > H + 40) {
        cursorX = -9999;
        cursorY = -9999;
        return;
      }
      // Small, frequent taps along the pointer's path — the trail of a
      // fingertip grazing the surface rather than a stone dropped in it.
      const now = performance.now();
      const dx = cursorX - lastSpawnX;
      const dy = cursorY - lastSpawnY;
      if (now - lastSpawnAt > 55 && dx * dx + dy * dy > 180) {
        ripples.push({ x: cursorX, y: cursorY, born: now });
        if (ripples.length > MAX_RIPPLES) ripples.shift();
        lastSpawnX = cursorX;
        lastSpawnY = cursorY;
        lastSpawnAt = now;
      }
    };

    // --- Displacement field --------------------------------------------------
    // Each tap is a damped oscillation confined to its own small disc: the
    // strand shivers for a moment and settles straight back. Strands are
    // near-horizontal, so displacing on Y alone reads as a ripple.
    const displace = (px: number, py: number, now: number): number => {
      let d = 0;

      for (const r of ripples) {
        const age = (now - r.born) / RIPPLE_LIFE;
        if (age >= 1) continue;
        const dx = px - r.x;
        const dy = py - r.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 > RIPPLE_RADIUS * RIPPLE_RADIUS * 6) continue;
        const dist = Math.sqrt(dist2);
        const reach = Math.exp(-dist2 / (2 * RIPPLE_RADIUS * RIPPLE_RADIUS));
        // Phase lags with distance, so the shiver creeps outward a little.
        const osc = Math.sin((dist / RIPPLE_TRAVEL - age * 2.4) * Math.PI * 2);
        const decay = (1 - age) * (1 - age);
        d += RIPPLE_LIFT * reach * decay * osc;
      }

      if (cursorFade > 0.01) {
        const dx = px - cursorX;
        const dy = py - cursorY;
        const swell = Math.exp(-(dx * dx + dy * dy) / (2 * CURSOR_RADIUS * CURSOR_RADIUS));
        d += CURSOR_LIFT * swell * cursorFade * (dy / Math.max(18, Math.abs(dy)));
      }

      return d;
    };

    // Resting shape of a strand at horizontal position `u`, in px: the arc over
    // the globe, plus two detuned harmonics so it never looks like a plain sine.
    const curveY = (c: Curve, u: number, t: number): number => {
      const s = (u - 0.5) * 2;
      const arc = (BAND_APEX + (c.offset * BAND_THICKNESS) / 2) * H + BAND_EDGE_DROP * H * s * s;
      const wave =
        Math.sin(u * Math.PI * 2 * c.freq + c.phase + t * c.drift) * c.amp +
        Math.sin(u * Math.PI * 2 * c.freq * 1.9 + c.phase * 1.4 - t * c.drift * 0.6) * c.amp * 0.34;
      return arc + wave * ampScale;
    };

    // --- Icon nodes ----------------------------------------------------------
    // Pinned to their strand: the badge rests on the line, its lower edge
    // sitting on it, and it inherits whatever the ripple does to that point.
    const placeNodes = (t: number, now: number) => {
      icons.forEach((item, i) => {
        const el = nodeRefs.current[i];
        const c = curves[item.curve % curves.length];
        if (!el || !c) return;
        const x = item.u * W;
        const line = curveY(c, item.u, t);
        const y = line + displace(x, line, now);
        const r = (el.offsetWidth || 48) / 2;
        // Barely-there breathing, secondary to the strand's own motion.
        const bob = prefersReduced ? 0 : Math.sin(now / 2900 + i * 1.9) * 1.6;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y - r + 2 + bob}px)`;
      });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const t = prefersReduced ? 0 : now / 1000;

      for (const c of visible) {
        const stroke = c.tinted
          ? `rgba(${ar},${ag},${ab},${c.alpha})`
          : `rgba(110,122,116,${c.alpha * 0.75})`;

        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
          const u = i / SAMPLES;
          const px = u * W;
          const py = curveY(c, u, t);
          const y = py + displace(px, py, now);
          if (i === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = c.width;
        ctx.lineCap = "round";
        ctx.stroke();

        for (const u of c.dots) {
          const px = u * W;
          const py = curveY(c, u, t);
          ctx.beginPath();
          ctx.arc(px, py + displace(px, py, now), 1.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ar},${ag},${ab},${Math.min(0.6, c.alpha * 3.2)})`;
          ctx.fill();
        }
      }

      placeNodes(t, now);
    };

    // --- Loop, paused while off-screen --------------------------------------
    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const now = performance.now();
      cursorFade += ((cursorX > -1000 ? 1 : 0) - cursorFade) * 0.1;
      while (ripples.length && now - ripples[0].born > RIPPLE_LIFE) ripples.shift();
      draw(now);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    if (prefersReduced) {
      const ro = new ResizeObserver(() => {
        resize();
        draw(0);
      });
      ro.observe(parent);
      draw(0);
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(parent);
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    const onScroll = () => {
      rect = parent.getBoundingClientRect();
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [accent, layer, icons]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        data-flow-layer={layer}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      {icons.map((item, i) => {
        const Icon = item.icon;
        return (
          <span
            key={item.id}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            className="cat-node"
            aria-hidden
          >
            <span className="cat-node-badge">
              <span
                className="cat-node-halo"
                style={{ background: `radial-gradient(circle, ${accent}33 0%, ${accent}00 70%)` }}
              />
              <Icon size={19} color={accent} strokeWidth={2.2} style={{ position: "relative" }} />
            </span>
          </span>
        );
      })}

      {icons.length > 0 && (
        <style>{`
          /* Outer span carries the per-frame position on the strand, inner one
             the hover response — the two transforms never fight. */
          .cat-node {
            position: absolute;
            left: 0;
            top: 0;
            will-change: transform;
          }
          .cat-node-badge {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: clamp(40px, 3.4vw, 50px);
            height: clamp(40px, 3.4vw, 50px);
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 6px 18px rgba(16,24,20,0.10), 0 0 0 1px rgba(16,24,20,0.04);
            cursor: default;
            /* The layer sets pointer-events: none so the globe stays draggable —
               badges opt back in for their hover state. */
            pointer-events: auto;
            transition: transform 420ms var(--ease-spring), box-shadow 420ms var(--ease-smooth);
          }
          .cat-node-halo {
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 380ms var(--ease-smooth);
          }
          .cat-node-badge:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 13px 28px rgba(16,24,20,0.14), 0 0 0 1px rgba(16,24,20,0.05);
          }
          .cat-node-badge:hover .cat-node-halo { opacity: 1; }

          /* Below tablet the badges would crowd the title and the globe. */
          @media (max-width: 760px) { .cat-node { display: none; } }
          @media (prefers-reduced-motion: reduce) {
            .cat-node-badge { transition: none; }
          }
        `}</style>
      )}
    </>
  );
}
