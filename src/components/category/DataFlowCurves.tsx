"use client";

import { useEffect, useRef } from "react";

export type CurveLayer = "back" | "front";

interface DataFlowCurvesProps {
  /** Category colour — a few strands are tinted with it, the rest stay neutral. */
  accent: string;
  /**
   * `back` draws the dense field behind the globe, `front` a sparser set that
   * reads as passing in front of it. Rendering both around the globe is what
   * gives the flows depth.
   */
  layer?: CurveLayer;
  /** Global multiplier on stroke alpha — lets the caller fade the field out. */
  intensity?: number;
}

interface Curve {
  /** Vertical anchor as a fraction of height. */
  y: number;
  amp: number;
  freq: number;
  phase: number;
  drift: number;
  tilt: number;
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

const RIPPLE_LIFE = 1500; // ms until a ripple has fully settled
const RIPPLE_REACH = 340; // px the wavefront travels
const RIPPLE_BAND = 54; // px thickness of the wavefront
const RIPPLE_LIFT = 19; // px peak displacement
const CURSOR_LIFT = 11; // px of standing swell under the cursor
const CURSOR_RADIUS = 92;
const MAX_RIPPLES = 5;
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
  const count = layer === "back" ? 11 : 6;
  const curves: Curve[] = [];

  for (let i = 0; i < count; i++) {
    const spread = (i + 0.5) / count;
    curves.push({
      y: 0.1 + spread * 0.86 + (next() - 0.5) * 0.05,
      amp: 0.035 + next() * 0.06,
      freq: 1.1 + next() * 1.8,
      phase: next() * Math.PI * 2,
      drift: (0.05 + next() * 0.1) * (next() > 0.5 ? 1 : -1),
      tilt: (next() - 0.5) * 0.16,
      width: layer === "back" ? 0.9 + next() * 0.7 : 1 + next() * 0.9,
      alpha: layer === "back" ? 0.12 + next() * 0.12 : 0.075 + next() * 0.085,
      tinted: next() > 0.42,
      // Data nodes riding the strand, at fixed positions along it.
      dots: Array.from({ length: Math.round(next() * 3) }, () => 0.08 + next() * 0.84),
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

export function DataFlowCurves({ accent, layer = "back", intensity = 1 }: DataFlowCurvesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

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
      // A ripple is shed only once the cursor has travelled far enough, so a
      // slow sweep leaves a trail of waves instead of a solid smear.
      const now = performance.now();
      const dx = cursorX - lastSpawnX;
      const dy = cursorY - lastSpawnY;
      if (now - lastSpawnAt > 90 && dx * dx + dy * dy > 1150) {
        ripples.push({ x: cursorX, y: cursorY, born: now });
        if (ripples.length > MAX_RIPPLES) ripples.shift();
        lastSpawnX = cursorX;
        lastSpawnY = cursorY;
        lastSpawnAt = now;
      }
    };

    // --- Displacement field --------------------------------------------------
    // Sum of the settling wavefronts plus a soft swell that tracks the cursor.
    // Curves are near-horizontal, so displacing on Y alone reads as a wave.
    const displace = (px: number, py: number, now: number): number => {
      let d = 0;

      for (const r of ripples) {
        const age = (now - r.born) / RIPPLE_LIFE;
        if (age >= 1) continue;
        const dx = px - r.x;
        const dy = py - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Front decelerates outward, amplitude decays as it goes.
        const front = RIPPLE_REACH * (1 - Math.pow(1 - age, 2.2));
        const band = Math.exp(-Math.pow(dist - front, 2) / (2 * RIPPLE_BAND * RIPPLE_BAND));
        const decay = Math.pow(1 - age, 2.4);
        d += RIPPLE_LIFT * band * decay * (dy / Math.max(24, Math.abs(dy)));
      }

      if (cursorFade > 0.01) {
        const dx = px - cursorX;
        const dy = py - cursorY;
        const dist2 = dx * dx + dy * dy;
        const swell = Math.exp(-dist2 / (2 * CURSOR_RADIUS * CURSOR_RADIUS));
        d += CURSOR_LIFT * swell * cursorFade * (dy / Math.max(20, Math.abs(dy)));
      }

      return d;
    };

    // Resting shape of a strand at horizontal position `u`, in px.
    // Two detuned harmonics keep it from looking like a plain sine.
    const curveY = (c: Curve, u: number, t: number): number => {
      const wave =
        Math.sin(u * Math.PI * 2 * c.freq + c.phase + t * c.drift) * c.amp +
        Math.sin(u * Math.PI * 2 * c.freq * 1.9 + c.phase * 1.4 - t * c.drift * 0.6) * c.amp * 0.34;
      return c.y * H + (wave + (u - 0.5) * c.tilt) * ampScale;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const globalAlpha = intensityRef.current;
      if (globalAlpha <= 0.01) return;

      const t = prefersReduced ? 0 : now / 1000;

      for (const c of visible) {
        const alpha = c.alpha * globalAlpha;
        const stroke = c.tinted
          ? `rgba(${ar},${ag},${ab},${alpha})`
          : `rgba(110,122,116,${alpha * 0.75})`;

        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
          const u = i / SAMPLES;
          const px = u * W;
          // Two detuned harmonics keep the strand from looking like a sine.
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
          ctx.fillStyle = `rgba(${ar},${ag},${ab},${Math.min(0.65, alpha * 3.4)})`;
          ctx.fill();
        }
      }
    };

    // --- Loop, paused while off-screen --------------------------------------
    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const now = performance.now();
      const wantCursor = cursorX > -1000 ? 1 : 0;
      cursorFade += (wantCursor - cursorFade) * 0.08;
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
      draw(0);
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start();
          else stop();
        },
        { threshold: 0 }
      );
      io.observe(parent);
      window.addEventListener("mousemove", onMove, { passive: true });
      start();

      const ro = new ResizeObserver(resize);
      ro.observe(parent);
      const onScroll = () => {
        rect = parent.getBoundingClientRect();
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        stop();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
      };
    }

    const ro = new ResizeObserver(() => {
      resize();
      draw(0);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [accent, layer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-flow-layer={layer}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
