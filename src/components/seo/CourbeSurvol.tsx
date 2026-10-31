"use client";

import { useRef, useState } from "react";
import { fmtHabCourt, fmtMdCourt } from "@/data/seo/francais";

/** Une courbe qu'on lit au survol (ou au doigt) : l'année et la valeur sous le curseur.
 *  Dessinée dès le rendu serveur : sans JavaScript, c'est la même courbe, sans la lecture.
 *
 *    <CourbeSurvol points={pib} format="md" label="Évolution du PIB de la France depuis 1960" />
 *
 *  `format` : « md » (milliards de dollars) ou « hab » (habitants). */
export function CourbeSurvol({
  points,
  couleur = "#8b5cff",
  label,
  format,
}: {
  points: { annee: number; v: number }[];
  couleur?: string;
  label: string;
  format: "md" | "hab";
}) {
  const [i, setI] = useState<number | null>(null);
  const zone = useRef<HTMLDivElement>(null);
  if (points.length < 2) return null;

  const W = 520;
  const H = 120;
  const min = Math.min(...points.map((p) => p.v));
  const max = Math.max(...points.map((p) => p.v));
  const a0 = points[0].annee;
  const a1 = points[points.length - 1].annee;
  const x = (a: number) => ((a - a0) / (a1 - a0)) * W;
  const y = (v: number) => H - 8 - ((v - min) / (max - min || 1)) * (H - 16);
  const d = points.map((p, k) => `${k ? "L" : "M"}${x(p.annee).toFixed(1)} ${y(p.v).toFixed(1)}`).join(" ");
  const fmt = format === "md" ? fmtMdCourt : fmtHabCourt;

  const vise = (clientX: number) => {
    const r = zone.current?.getBoundingClientRect();
    if (!r) return;
    const t = Math.min(1, Math.max(0, (clientX - r.left) / (r.width || 1)));
    const annee = a0 + t * (a1 - a0);
    let best = 0;
    for (let k = 1; k < points.length; k++) if (Math.abs(points[k].annee - annee) < Math.abs(points[best].annee - annee)) best = k;
    setI(best);
  };

  const p = i === null ? null : points[i];
  return (
    <div
      ref={zone}
      className="sg-survol"
      onPointerMove={(e) => vise(e.clientX)}
      onPointerDown={(e) => vise(e.clientX)}
      onPointerLeave={() => setI(null)}
    >
      <p className="sg-survol-l" aria-live="polite">
        {p ? (
          <>
            <b>{p.annee}</b> · {fmt(p.v)}
          </>
        ) : (
          <span>Survolez la courbe pour lire une année.</span>
        )}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="sg-mini" role="img" aria-label={label}>
        <path d={`${d} L${W} ${H} L0 ${H} Z`} fill={couleur} opacity="0.14" />
        <path d={d} fill="none" stroke={couleur} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        {p && (
          <>
            <line x1={x(p.annee)} y1="0" x2={x(p.annee)} y2={H} stroke={couleur} strokeWidth="1.2" opacity="0.6" vectorEffect="non-scaling-stroke" />
            <circle cx={x(p.annee)} cy={y(p.v)} r="5" fill="#fff" stroke={couleur} strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>
    </div>
  );
}
