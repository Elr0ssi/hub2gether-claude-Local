"use client";

/** Rounded so the server and the browser agree on every coordinate. */
const q = (n: number): number => Math.round(n * 100) / 100;

const W = 1000;
const H = 600;

// A handful of long, shallow trajectories — the globe's own graphic language
// carried into the surface it becomes. Deliberately sparse: this reads as a
// trace left behind, not as a pattern.
const LINES: { y: number; bend: number; width: number; alpha: number; tinted: boolean }[] = [
  { y: 0.22, bend: -0.09, width: 1, alpha: 0.55, tinted: true },
  { y: 0.42, bend: 0.11, width: 1, alpha: 0.35, tinted: false },
  { y: 0.63, bend: -0.08, width: 1, alpha: 0.45, tinted: true },
  { y: 0.82, bend: 0.07, width: 1, alpha: 0.28, tinted: false },
];

const DOTS: { x: number; y: number; r: number; tinted: boolean }[] = [
  { x: 0.18, y: 0.22, r: 3, tinted: true },
  { x: 0.62, y: 0.44, r: 2.5, tinted: false },
  { x: 0.84, y: 0.63, r: 3, tinted: true },
  { x: 0.36, y: 0.81, r: 2.5, tinted: false },
];

function path(y: number, bend: number): string {
  const cy = q(y * H);
  const b = q(bend * H);
  return `M -40 ${cy} C ${q(W * 0.24)} ${q(cy + b)}, ${q(W * 0.42)} ${q(cy - b * 1.4)}, ${q(W * 0.6)} ${q(cy - b * 0.3)} S ${q(W * 0.88)} ${q(cy + b * 1.2)}, ${W + 40} ${q(cy + b * 0.2)}`;
}

/**
 * The fine trajectories drawn inside the expanding surface. Purely
 * decorative, stretched to whatever box it is dropped into.
 */
export function HeroSurfaceLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="p2-surface-tint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
          <stop offset="38%" stopColor="#10B981" stopOpacity="1" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="p2-surface-plain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9BB6A8" stopOpacity="0" />
          <stop offset="45%" stopColor="#9BB6A8" stopOpacity="1" />
          <stop offset="100%" stopColor="#9BB6A8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {LINES.map((l, i) => (
        <path
          key={i}
          d={path(l.y, l.bend)}
          fill="none"
          stroke={l.tinted ? "url(#p2-surface-tint)" : "url(#p2-surface-plain)"}
          strokeWidth={l.width}
          strokeOpacity={l.alpha}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Beads as round stroke caps: the viewBox is stretched to the surface's
          aspect, so a circle would render as a flattened ellipse. */}
      {DOTS.map((d, i) => (
        <line
          key={i}
          x1={q(d.x * W)}
          y1={q(d.y * H)}
          x2={q(d.x * W) + 0.01}
          y2={q(d.y * H)}
          stroke={d.tinted ? "#10B981" : "#9BB6A8"}
          strokeOpacity={0.5}
          strokeWidth={d.r * 2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
