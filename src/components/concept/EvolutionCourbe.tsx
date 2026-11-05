"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ÉVOLUTION DANS LE PANNEAU DU GLOBE (Économie, Ressources)

   Une seule courbe, dessinée en pixels réels : le trait, les points et les
   repères partagent le même repère SVG, donc un point est toujours exactement
   sur la ligne. Le trait est lissé (interpolation monotone : jamais de
   dépassement entre deux valeurs), une valeur absente coupe la courbe, et rien
   n'est interpolé au-dessus d'une lacune.

   Pas d'infobulle : au repos le bandeau donne les deux bouts ; au survol, l'année
   lue ; en cliquant deux années, l'écart entre elles.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PointEvolution {
  annee: number;
  valeur: number | null;
  /** Une mention courte sous la valeur lue (estimée, imputée…). */
  note?: string;
}

export interface EcartEvolution {
  /** Le grand nombre : « +105 % », « ×8,4 »… */
  texte: string;
  /** Ce qui l'accompagne sous lui. */
  detail?: string;
  /** Le sens de la variation : colore le texte (1 vert, −1 rouge, 0 neutre). */
  sens: 1 | -1 | 0;
}

interface Props {
  titre: string;
  points: PointEvolution[];
  format: (v: number) => string;
  ecart: (a: { annee: number; valeur: number }, b: { annee: number; valeur: number }) => EcartEvolution | null;
  /** Remet les repères à zéro quand ce qui est regardé change. */
  reinit?: string;
  hauteur?: number;
  vide?: string;
}

const HAUT = 96;
const BAS = 20;
const HAUT_PAD = 10;
const GAUCHE = 6;
const DROITE = 6;

/** Une courbe lissée qui ne dépasse jamais ses points (Fritsch-Carlson). */
function cheminMonotone(pts: { x: number; y: number }[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1].x - pts[i].x || 1e-6);
    m.push((pts[i + 1].y - pts[i].y) / dx[i]);
  }
  const t: number[] = new Array(n);
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${(pts[i].x + h).toFixed(2)},${(pts[i].y + t[i] * h).toFixed(2)} ${(pts[i + 1].x - h).toFixed(2)},${(pts[i + 1].y - t[i + 1] * h).toFixed(2)} ${pts[i + 1].x.toFixed(2)},${pts[i + 1].y.toFixed(2)}`;
  }
  return d;
}

export function EvolutionCourbe({ titre, points, format, ecart: calculEcart, reinit, hauteur = HAUT, vide }: Props) {
  const cadre = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(300);
  const [survol, setSurvol] = useState<number | null>(null);
  const [bornes, setBornes] = useState<number[]>([]);

  useEffect(() => setBornes([]), [reinit, titre]);
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(160, Math.round(e.contentRect.width))));
    ro.observe(el);
    setW(Math.max(160, Math.round(el.clientWidth || 300)));
    return () => ro.disconnect();
  }, []);

  const valides = useMemo(() => points.filter((p) => p.valeur !== null) as { annee: number; valeur: number; note?: string }[], [points]);

  const g = useMemo(() => {
    if (valides.length < 2) return null;
    const a0 = points[0].annee;
    const a1 = points[points.length - 1].annee;
    const vs = valides.map((p) => p.valeur);
    const lo = Math.min(...vs);
    const hi = Math.max(...vs);
    const haut = hauteur - BAS;
    const X = (an: number) => GAUCHE + (a1 === a0 ? 0 : ((an - a0) / (a1 - a0)) * (w - GAUCHE - DROITE));
    const Y = (v: number) => (hi === lo ? (haut + HAUT_PAD) / 2 : haut - ((v - lo) / (hi - lo)) * (haut - HAUT_PAD));
    /* Les tronçons continus : une lacune de plus d'une année coupe le trait. */
    const troncons: { x: number; y: number }[][] = [];
    let cur: { x: number; y: number }[] = [];
    let prev: number | null = null;
    for (const p of points) {
      if (p.valeur === null) {
        if (cur.length) troncons.push(cur);
        cur = [];
        prev = null;
        continue;
      }
      if (prev !== null && p.annee - prev > 1) {
        troncons.push(cur);
        cur = [];
      }
      cur.push({ x: X(p.annee), y: Y(p.valeur) });
      prev = p.annee;
    }
    if (cur.length) troncons.push(cur);
    const traits = troncons.map((t) => cheminMonotone(t));
    const aires = troncons.filter((t) => t.length > 1).map((t) => `${cheminMonotone(t)}L${t[t.length - 1].x.toFixed(2)},${haut}L${t[0].x.toFixed(2)},${haut}Z`);
    const pos = new Map(valides.map((p) => [p.annee, { x: X(p.annee), y: Y(p.valeur) }]));
    const nTicks = w < 280 ? 3 : 5;
    const ticks = Array.from({ length: nTicks }, (_, i) => Math.round(a0 + ((a1 - a0) * i) / (nTicks - 1)));
    return { a0, a1, traits, aires, pos, ticks, X, haut };
  }, [points, valides, w, hauteur]);

  if (!g) {
    return (
      <div className="ge-evo ge-evo2">
        <p className="ge-evo-t">Évolution · {titre}</p>
        <p className="ge-evo-vide">{vide ?? "Moins de deux années publiées pour ce pays sur cet indicateur."}</p>
      </div>
    );
  }

  const parAn = new Map(valides.map((p) => [p.annee, p]));
  const premier = valides[0];
  const dernier = valides[valides.length - 1];
  const lu = survol !== null ? parAn.get(survol) ?? null : null;
  const [ba, bb] = bornes.length === 2 ? [parAn.get(bornes[0]), parAn.get(bornes[1])] : [undefined, undefined];
  const ec = ba && bb ? calculEcart(ba, bb) : null;

  const vise = (x: number) => {
    const el = cadre.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = ((x - r.left) / (r.width || 1)) * w;
    let best = valides[0];
    let d = Infinity;
    for (const p of valides) {
      const e = Math.abs(g.pos.get(p.annee)!.x - px);
      if (e < d) { d = e; best = p; }
    }
    setSurvol(best.annee);
  };
  const pose = (an: number) => setBornes((b) => (b.length === 1 ? (b[0] === an ? [] : [b[0], an].sort((x, y) => x - y)) : [an]));

  const marques = [...(bornes.length ? bornes : [])].map((a) => ({ a, p: g.pos.get(a) })).filter((m) => m.p) as { a: number; p: { x: number; y: number } }[];
  const pl = lu ? g.pos.get(lu.annee)! : null;

  return (
    <div className="ge-evo ge-evo2">
      <p className="ge-evo-t">Évolution · {titre}</p>
      <div className="ge-evo-h">
        {ec ? (
          <span className={`ge-evo-ec${ec.sens > 0 ? " ge-evo-ec-h" : ec.sens < 0 ? " ge-evo-ec-b" : ""}`}>
            <b>{ec.texte}</b>
            {ec.detail}
          </span>
        ) : lu ? (
          <span className="ge-evo-lu">
            <b>{format(lu.valeur)}</b>
            {lu.annee}{lu.note ? ` · ${lu.note}` : ""}
          </span>
        ) : (
          <>
            <span className="ge-evo-bout"><b>{format(premier.valeur)}</b>{premier.annee}</span>
            <span className="ge-evo-bout ge-evo-bout-d"><b>{format(dernier.valeur)}</b>{dernier.annee}</span>
          </>
        )}
      </div>
      <div
        ref={cadre}
        className="ge-evo-c"
        onPointerMove={(e) => vise(e.clientX)}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); vise(e.clientX); }}
        onClick={() => survol !== null && pose(survol)}
        onPointerLeave={() => setSurvol(null)}
        onPointerCancel={() => setSurvol(null)}
      >
        <svg width={w} height={hauteur} viewBox={`0 0 ${w} ${hauteur}`} aria-hidden="true">
          <defs>
            <linearGradient id="ge-evo2-fond" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--froid)" stopOpacity="0.26" />
              <stop offset="100%" stopColor="var(--froid)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {g.ticks.map((t) => (
            <g key={t}>
              <line x1={g.X(t)} x2={g.X(t)} y1={g.haut} y2={g.haut + 3} className="ge-evo2-tick" />
              <text x={Math.min(w - 12, Math.max(12, g.X(t)))} y={hauteur - 4} textAnchor="middle" className="ge-evo2-an">{t}</text>
            </g>
          ))}
          <line x1={GAUCHE} x2={w - DROITE} y1={g.haut} y2={g.haut} className="ge-evo2-base" />
          {ba && bb && (
            <rect x={g.pos.get(ba.annee)!.x} y={HAUT_PAD - 4} width={Math.max(0, g.pos.get(bb.annee)!.x - g.pos.get(ba.annee)!.x)} height={g.haut - HAUT_PAD + 4} className="ge-evo2-plage" />
          )}
          {g.aires.map((d, i) => <path key={`a${i}`} d={d} fill="url(#ge-evo2-fond)" stroke="none" />)}
          {g.traits.map((d, i) => <path key={`t${i}-${titre}`} d={d} pathLength={1} className="ge-evo2-trait" />)}
          {marques.map((m) => <line key={m.a} x1={m.p.x} x2={m.p.x} y1={HAUT_PAD - 4} y2={g.haut} className="ge-evo2-borne" />)}
          {pl && <line x1={pl.x} x2={pl.x} y1={HAUT_PAD - 4} y2={g.haut} className="ge-evo2-guide" />}
          <circle cx={g.pos.get(premier.annee)!.x} cy={g.pos.get(premier.annee)!.y} r={3} className="ge-evo2-pt" />
          <circle cx={g.pos.get(dernier.annee)!.x} cy={g.pos.get(dernier.annee)!.y} r={4.2} className="ge-evo2-pt ge-evo2-pt-f" />
          {marques.map((m) => <circle key={`m${m.a}`} cx={m.p.x} cy={m.p.y} r={4.6} className="ge-evo2-pt ge-evo2-pt-e" />)}
          {pl && (
            <g className="ge-evo2-lu" style={{ transform: `translate(${pl.x}px, ${pl.y}px)` }}>
              <circle r={7} className="ge-evo2-halo" />
              <circle r={4.2} className="ge-evo2-pt ge-evo2-pt-l" />
            </g>
          )}
        </svg>
      </div>
      <p className="ge-evo-aide">
        {bornes.length === 0 ? "Cliquez deux années pour mesurer l’écart." : bornes.length === 1 ? `${bornes[0]} posée. Cliquez la seconde année.` : "Cliquez ailleurs pour repartir."}
      </p>
    </div>
  );
}
