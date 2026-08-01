"use client";

import { useEffect, useRef, type RefObject } from "react";
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
   * `back` is the main sheaf hugging the globe, `front` a few secondary
   * strands running higher above it.
   */
  layer?: CurveLayer;
  /** Badges to pin onto the strands. Only the `back` layer carries them. */
  icons?: FlowIcon[];
  /** The globe's square container — the strands are traced from its real rect. */
  globeRef: RefObject<HTMLElement | null>;
}

interface Curve {
  /** Clearance above the globe's silhouette, in px. */
  margin: number;
  /** Apex shift as a fraction of the radius — breaks the symmetry. */
  skew: number;
  /** Slight hollow over the middle of the dome, in px. */
  sag: number;
  /** Free undulation along the path, in px. */
  amp: number;
  freq: number;
  phase: number;
  drift: number;
  width: number;
  alpha: number;
  tinted: boolean;
  dots: number[];
}

interface Pulse {
  curve: number;
  x0: number;
  dir: 1 | -1;
  born: number;
}

// --- Path shape --------------------------------------------------------------
// Up to TAIL_START the strand is a circle concentric with the globe, so it
// traces the silhouette at a constant clearance. Past it, it peels off
// tangentially and settles onto a near-horizontal course towards the edges of
// the screen, rather than diving with the sphere down behind the panel.
const TAIL_START = 0.78;

// --- Pointer response --------------------------------------------------------
// No wave: the strand under the cursor brightens over a short span, a pulse of
// light runs along it, and the line itself barely moves.
const NEAR_SIGMA = 7; // px — vertical falloff; neighbours react far less
const HOVER_SPAN = 190; // px — half-length of the brightened stretch
const HOVER_GAIN = 0.26; // extra alpha at the centre of that stretch
const HOVER_BEND = 1.8; // px — the whole of the strand's displacement
const PULSE_SPAN = 62; // px — half-length of the travelling glint
const PULSE_SPEED = 250; // px per second
const PULSE_LIFE = 1000; // ms
const PULSE_GAP = 1100; // ms between two pulses on the same strand
const SAMPLES = 96;

// Deterministic pseudo-random so server and client agree and the field looks
// identical on every reload.
function rand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Irregular but controlled spacing: the lowest strand almost grazes the globe,
// the others fan out above it with widening gaps.
// The whole sheaf has to fit between the globe's crown and the subtitle, so
// the topmost strand never rises past roughly a quarter of a radius above it.
const BACK_MARGINS = [6, 14, 24, 36, 50, 66, 84];
const FRONT_MARGINS = [96, 110, 124];

function buildCurves(layer: CurveLayer): Curve[] {
  const next = rand(layer === "back" ? 20250729 : 78123401);
  const margins = layer === "back" ? BACK_MARGINS : FRONT_MARGINS;

  return margins.map((margin, i) => ({
    margin,
    skew: (next() - 0.5) * 0.12,
    sag: 3 + next() * 9,
    amp: 2.5 + next() * 5,
    freq: 0.7 + next() * 1.1,
    phase: next() * Math.PI * 2,
    drift: (0.04 + next() * 0.07) * (next() > 0.5 ? 1 : -1),
    width: layer === "back" ? 0.85 + (i < 3 ? 0.5 : 0.2) + next() * 0.3 : 0.7 + next() * 0.3,
    alpha: layer === "back" ? 0.34 - i * 0.03 + next() * 0.05 : 0.07 + next() * 0.04,
    tinted: next() > 0.38,
    // Data nodes riding the strand, at fixed positions along it.
    dots: Array.from({ length: Math.round(next() * 2.4) }, () => 0.16 + next() * 0.68),
  }));
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

export function DataFlowCurves({
  accent,
  layer = "back",
  icons = [],
  globeRef,
}: DataFlowCurvesProps) {
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
    const tint = (a: number) => `rgba(${ar},${ag},${ab},${a})`;
    const grey = (a: number) => `rgba(110,122,116,${a})`;

    let W = 0;
    let H = 0;
    let visible = curves;
    let rect = parent.getBoundingClientRect();

    // --- Globe-relative geometry --------------------------------------------
    // Centre and radius of the sphere, in canvas coordinates. Everything the
    // strands do is expressed against these, so the sheaf keeps hugging the
    // globe at any viewport size without a single hardcoded coordinate.
    let cx = 0;
    let cy = 0;
    let R = 0;

    const measure = () => {
      rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;

      const g = globeRef.current?.getBoundingClientRect();
      if (g && g.width > 0) {
        R = g.width / 2;
        cx = g.left + g.width / 2 - rect.left;
        cy = g.top + g.height / 2 - rect.top;
      } else {
        R = Math.min(W * 0.45, H * 0.58);
        cx = W / 2;
        cy = H * 0.4 + R;
      }

      visible = W < 660 ? curves.filter((_, i) => i % 2 === 0) : curves;
    };

    const resize = () => {
      measure();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /**
     * Resting height of a strand at abscissa `x`.
     *
     * Inside the dome it is a circle of radius `R + margin` centred on the
     * globe: the line runs parallel to the silhouette, the innermost one a few
     * pixels off it. A shallow sag hollows the middle, a skew moves the apex
     * off-centre, and a slow undulation keeps the sheaf from looking machined.
     */
    const strandY = (c: Curve, x: number, t: number): number => {
      const rm = R + c.margin;
      const k = (x - (cx + c.skew * R)) / rm;
      const a = Math.abs(k);

      let drop: number;
      if (a <= TAIL_START) {
        drop = rm * (1 - Math.sqrt(1 - k * k));
      } else {
        // Leaves on the circle's own tangent, then eases onto an asymptote a
        // few dozen pixels lower — so the strand still reaches the edge of the
        // screen instead of plunging behind the statistics panel.
        const dTail = rm * (1 - Math.sqrt(1 - TAIL_START * TAIL_START));
        const slope = TAIL_START / Math.sqrt(1 - TAIL_START * TAIL_START);
        const over = a - TAIL_START;
        // Inner strands get more room to fall away than outer ones, so the
        // sheaf keeps fanning out instead of converging at the edges.
        const room = 26 + (BACK_MARGINS[BACK_MARGINS.length - 1] + 46 - c.margin) * 0.35;
        drop = dTail + room * (1 - Math.exp((-rm * slope * over) / room));
      }

      const sag = c.sag * Math.exp(-3.2 * k * k);
      const wave = Math.sin((x / Math.max(1, W)) * Math.PI * 2 * c.freq + c.phase + t * c.drift) * c.amp;
      return cy - rm + drop + sag + wave;
    };

    // --- Pointer state -------------------------------------------------------
    let pointerX = -9999;
    let pointerY = -9999;
    const near = curves.map(() => 0); // smoothed proximity, per strand
    const lastPulseAt = curves.map(() => 0);
    const pulses: Pulse[] = [];

    const onMove = (e: MouseEvent) => {
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      if (pointerX < -60 || pointerY < -60 || pointerX > W + 60 || pointerY > H + 60) {
        pointerX = -9999;
        pointerY = -9999;
      }
    };

    /** The strand leans a hair towards the cursor — 2px at most, nothing else. */
    const bend = (c: Curve, index: number, x: number, y: number): number => {
      const n = near[index];
      if (n < 0.02 || pointerX < -1000) return 0;
      const dx = x - pointerX;
      const falloff = Math.exp(-(dx * dx) / (2 * 80 * 80));
      const dir = Math.sign(pointerY - y) || 1;
      return HOVER_BEND * n * falloff * dir;
    };

    // --- Icon nodes ----------------------------------------------------------
    // Pinned to their strand: the badge rests on the line, its lower edge
    // sitting on it, and it inherits whatever the strand does.
    const placeNodes = (t: number, now: number) => {
      icons.forEach((item, i) => {
        const el = nodeRefs.current[i];
        const ci = item.curve % curves.length;
        const c = curves[ci];
        if (!el || !c) return;
        const x = item.u * W;
        const line = strandY(c, x, t);
        const y = line + bend(c, ci, x, line);
        const r = (el.offsetWidth || 48) / 2;
        // Barely-there breathing, secondary to the strand's own motion.
        const bob = prefersReduced ? 0 : Math.sin(now / 2900 + i * 1.9) * 1.4;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y - r + 2 + bob}px)`;
      });
    };

    /**
     * Vertical ramp that dissolves a strand as it dives towards the lower part
     * of the stage: the flow reads as flowing away rather than running under
     * the statistics panel and out of the bottom corners.
     */
    const fadeOut = (color: (a: number) => string, alpha: number) => {
      const grad = ctx.createLinearGradient(0, H * 0.6, 0, H * 0.78);
      grad.addColorStop(0, color(alpha));
      grad.addColorStop(1, color(0));
      return grad;
    };

    /** Horizontal alpha ramp centred on `x` — used for the glow and the pulse. */
    const bandGradient = (x: number, span: number, peak: number) => {
      const grad = ctx.createLinearGradient(x - span, 0, x + span, 0);
      grad.addColorStop(0, tint(0));
      grad.addColorStop(0.5, tint(peak));
      grad.addColorStop(1, tint(0));
      return grad;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const t = prefersReduced ? 0 : now / 1000;

      visible.forEach((c) => {
        const index = curves.indexOf(c);

        // Trace once, re-stroke for the highlights: the glow can never drift
        // away from the line it belongs to.
        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
          const x = (i / SAMPLES) * W;
          const y = strandY(c, x, t);
          const py = y + bend(c, index, x, y);
          if (i === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.lineCap = "round";
        ctx.lineWidth = c.width;
        ctx.strokeStyle = fadeOut(c.tinted ? tint : grey, c.tinted ? c.alpha : c.alpha * 0.7);
        ctx.stroke();

        // Local brightening around the cursor.
        const n = near[index];
        if (n > 0.02 && pointerX > -1000) {
          ctx.lineWidth = c.width + 0.35;
          ctx.strokeStyle = bandGradient(pointerX, HOVER_SPAN, HOVER_GAIN * n);
          ctx.stroke();
        }

        // Glints running along it.
        for (const p of pulses) {
          if (p.curve !== index) continue;
          const age = (now - p.born) / PULSE_LIFE;
          if (age >= 1) continue;
          const x = p.x0 + p.dir * PULSE_SPEED * age * (PULSE_LIFE / 1000);
          const env = Math.sin(age * Math.PI); // fades in and out
          ctx.lineWidth = c.width + 0.5;
          ctx.strokeStyle = bandGradient(x, PULSE_SPAN, 0.4 * env);
          ctx.stroke();
        }

        for (const u of c.dots) {
          const x = u * W;
          const y = strandY(c, x, t);
          ctx.beginPath();
          ctx.arc(x, y + bend(c, index, x, y), 1.7, 0, Math.PI * 2);
          ctx.fillStyle = tint(Math.min(0.55, c.alpha * 2.4));
          ctx.fill();
        }
      });

      placeNodes(t, now);
    };

    // --- Loop, paused while off-screen --------------------------------------
    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const now = performance.now();

      // Proximity per strand: quick to answer, slow to let go.
      visible.forEach((c) => {
        const index = curves.indexOf(c);
        let target = 0;
        if (pointerX > -1000) {
          const y = strandY(c, pointerX, now / 1000);
          const dv = pointerY - y;
          target = Math.exp(-(dv * dv) / (2 * NEAR_SIGMA * NEAR_SIGMA));
        }
        const k = target > near[index] ? 0.22 : 0.07;
        near[index] += (target - near[index]) * k;

        if (target > 0.45 && now - lastPulseAt[index] > PULSE_GAP) {
          lastPulseAt[index] = now;
          pulses.push({
            curve: index,
            x0: pointerX,
            dir: pointerX > cx ? 1 : -1,
            born: now,
          });
        }
      });

      while (pulses.length && now - pulses[0].born > PULSE_LIFE) pulses.shift();
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
    const onScroll = () => measure();
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
  }, [accent, layer, icons, globeRef]);

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
                style={{ background: `radial-gradient(circle, ${accent}2B 0%, ${accent}00 70%)` }}
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
          /* Glow first, movement almost none. */
          .cat-node-badge:hover {
            transform: scale(1.03);
            box-shadow: 0 10px 24px rgba(16,24,20,0.12), 0 0 0 1px rgba(16,24,20,0.05);
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
