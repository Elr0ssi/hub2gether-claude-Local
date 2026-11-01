"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { complet, flagLibelle } from "@/data/ressources/calc";

/* ═══════════════════════════════════════════════════════════════════════════
   LE MOTEUR DE GRAPHIQUES DES RESSOURCES

   Un seul tracé pour toutes les ressources : des courbes annuelles en SVG, avec un curseur qui donne la valeur, l'année et le flag de
   chaque série. Une valeur manquante coupe la courbe (jamais de zéro, jamais d'interpolation). Les valeurs qui ne sont pas
   « officielles » sont marquées d'un cercle creux.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PointSerie {
  annee: number;
  valeur: number | null;
  flag?: string;
  nonOfficielle?: boolean;
}

export interface SerieCourbe {
  id: string;
  nom: string;
  couleur: string;
  pts: PointSerie[];
}

function useLargeur(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    setW(Math.max(260, Math.round(el.clientWidth)));
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

const pas = (max: number) => {
  const brut = max / 4;
  const p = Math.pow(10, Math.floor(Math.log10(brut || 1)));
  const f = brut / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
};

export function Courbes({
  series, unite, hauteur = 240, annee, titre, couleurAxe,
}: {
  series: SerieCourbe[];
  unite: string;
  hauteur?: number;
  /** L'année sélectionnée sur la page : un repère vertical. */
  annee?: number;
  titre: string;
  couleurAxe?: string;
}) {
  const [ref, w] = useLargeur();
  const [survol, setSurvol] = useState<number | null>(null);
  const m = { g: 52, d: 12, h: 12, b: 26 };
  const toutes = series.flatMap((s) => s.pts);
  const annees = toutes.map((p) => p.annee);
  const [a0, a1] = annees.length ? [Math.min(...annees), Math.max(...annees)] : [0, 1];
  const valeurs = toutes.map((p) => p.valeur).filter((x): x is number => x !== null);
  const max = valeurs.length ? Math.max(...valeurs) : 1;
  const p = pas(max);
  const haut = Math.ceil(max / p) * p || 1;
  const x = (a: number) => m.g + ((a - a0) / Math.max(1, a1 - a0)) * (w - m.g - m.d);
  const y = (v: number) => m.h + (1 - v / haut) * (hauteur - m.h - m.b);
  /* Une seule unité d'affichage pour tout l'axe : jamais « 5 000 » à côté de « 15 k ». */
  const [div, suffixe] = haut >= 1e9 ? [1e9, " Md"] : haut >= 1e6 ? [1e6, " M"] : haut >= 1e4 ? [1e3, " k"] : [1, ""];
  const etiquette = (g: number) => `${(g / div).toLocaleString("fr-FR", { maximumFractionDigits: 2 })}${suffixe}`;
  const graduations = Array.from({ length: Math.round(haut / p) + 1 }, (_, i) => i * p);
  const ticks = useMemo(() => {
    const n = w < 420 ? 4 : 7;
    return Array.from({ length: n }, (_, i) => Math.round(a0 + ((a1 - a0) * i) / (n - 1)));
  }, [a0, a1, w]);

  const trace = (pts: PointSerie[]) => {
    let d = "";
    let ouvert = false;
    for (const q of pts) {
      if (q.valeur === null) { ouvert = false; continue; }
      d += `${ouvert ? "L" : "M"}${x(q.annee).toFixed(1)},${y(q.valeur).toFixed(1)}`;
      ouvert = true;
    }
    return d;
  };

  const surBouge = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * w;
    const a = Math.round(a0 + ((px - m.g) / (w - m.g - m.d)) * (a1 - a0));
    setSurvol(a >= a0 && a <= a1 ? a : null);
  };

  const ligneSurvol = survol === null ? null : series.map((s) => ({ s, q: s.pts.find((q) => q.annee === survol) }));

  if (!valeurs.length) return <div ref={ref} className="rs-vide-g">Aucune donnée pour ce graphique.</div>;

  return (
    <div ref={ref} className="rs-courbes">
      <svg
        width={w}
        height={hauteur}
        viewBox={`0 0 ${w} ${hauteur}`}
        role="img"
        aria-label={`${titre}. ${series.map((s) => s.nom).join(", ")}, de ${a0} à ${a1}, en ${unite}.`}
        onPointerMove={surBouge}
        onPointerLeave={() => setSurvol(null)}
      >
        {graduations.map((g) => (
          <g key={g}>
            <line x1={m.g} x2={w - m.d} y1={y(g)} y2={y(g)} className="rs-grille" />
            <text x={m.g - 8} y={y(g) + 4} textAnchor="end" className="rs-axe">{etiquette(g)}</text>
          </g>
        ))}
        {ticks.map((t) => <text key={t} x={x(t)} y={hauteur - 7} textAnchor="middle" className="rs-axe">{t}</text>)}
        {annee !== undefined && annee >= a0 && annee <= a1 && <line x1={x(annee)} x2={x(annee)} y1={m.h} y2={hauteur - m.b} className="rs-repere" style={couleurAxe ? { stroke: couleurAxe } : undefined} />}
        {series.map((s) => (
          <g key={s.id}>
            <path d={trace(s.pts)} fill="none" stroke={s.couleur} strokeWidth={series.length > 3 ? 1.6 : 2.2} strokeLinejoin="round" strokeLinecap="round" />
            {series.length <= 2 && s.pts.filter((q) => q.valeur !== null && q.flag && q.flag !== "A").map((q) => (
              <circle key={q.annee} cx={x(q.annee)} cy={y(q.valeur as number)} r={2.6} fill="var(--surface-2, #fff)" stroke={s.couleur} strokeWidth={1.2} />
            ))}
          </g>
        ))}
        {survol !== null && <line x1={x(survol)} x2={x(survol)} y1={m.h} y2={hauteur - m.b} className="rs-curseur" />}
        {ligneSurvol?.map(({ s, q }) => q && q.valeur !== null && <circle key={s.id} cx={x(survol as number)} cy={y(q.valeur)} r={4} fill={s.couleur} stroke="var(--surface-2, #fff)" strokeWidth={2} />)}
      </svg>
      {ligneSurvol && survol !== null && (
        <div className="rs-bulle" style={{ left: Math.min(Math.max(x(survol), 90), w - 90) }}>
          <b>{survol}</b>
          {ligneSurvol.map(({ s, q }) => (
            <span key={s.id}>
              <i style={{ background: s.couleur }} />
              {s.nom}
              <strong>{q ? (q.valeur === null ? "manquante" : `${complet(q.valeur)} ${unite}`) : "pas de donnée"}</strong>
              {q && q.flag && q.valeur !== null && <em>{flagLibelle(q.flag)}{q.nonOfficielle ? " · non officielle" : ""}</em>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Une répartition : des barres horizontales (part d'un total), la dernière ligne pouvant être « Autres ». */
export function Repartition({ lignes, unite }: { lignes: { id: string; nom: string; valeur: number; part: number; couleur: string; note?: string; onClick?: () => void }[]; unite: string }) {
  const max = Math.max(...lignes.map((l) => l.part), 1);
  return (
    <ul className="rs-parts">
      {lignes.map((l) => (
        <li key={l.id}>
          <button type="button" onClick={l.onClick} disabled={!l.onClick}>
            <span className="rs-parts-n">{l.nom}{l.note && <small>{l.note}</small>}</span>
            <i><b style={{ width: `${(l.part / max) * 100}%`, background: l.couleur }} /></i>
            <strong>{l.part.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</strong>
            <small>{complet(l.valeur)} {unite}</small>
          </button>
        </li>
      ))}
    </ul>
  );
}
