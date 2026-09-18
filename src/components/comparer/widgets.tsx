"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   LES WIDGETS DU TABLEAU DE BORD

   Chacun reçoit la même chose — les pays choisis, leurs quatre séries, et
   l'année pointée — et en tire une lecture différente. Aucun ne calcule de
   valeur qui ne soit pas dans la source : un trou reste un trou.
   ═══════════════════════════════════════════════════════════════════════════ */

export const COULEURS = ["#39FF88", "#5AC8FF", "#FFD166", "#FF7B72", "#C792EA", "#FF9F6E"];
const TRAIT = "rgba(255,255,255,0.10)";
const EASE = [0.16, 1, 0.3, 1] as const;

export type Champ = "gdp" | "gdp_per_capita" | "trade_balance" | "inflation";

export const CHAMP_META: Record<Champ, { label: string; court: string }> = {
  gdp: { label: "PIB", court: "Md€" },
  gdp_per_capita: { label: "PIB / habitant", court: "€" },
  trade_balance: { label: "Balance commerciale", court: "Md€" },
  inflation: { label: "Inflation", court: "%" },
};

export interface PaysChoisi {
  cle: string;
  label: string;
  couleur: string;
}

export interface Jeu {
  annees: number[];
  /** cle pays → champ → série alignée sur `annees`. */
  series: Record<string, Record<Champ, (number | null)[]>>;
  pays: PaysChoisi[];
  i: number;
}

export function fmt(v: number | null, champ: Champ): string {
  if (v === null || v === undefined) return "—";
  if (champ === "inflation") return `${v.toFixed(1).replace(".", ",")} %`;
  if (champ === "gdp_per_capita") return `${Math.round(v).toLocaleString("fr-FR")} €`;
  const a = Math.abs(v);
  if (a >= 1000) return `${(v / 1000).toFixed(1).replace(".", ",")} T€`;
  return `${Math.round(v).toLocaleString("fr-FR")} Md€`;
}

function val(j: Jeu, cle: string, champ: Champ, i = j.i): number | null {
  return j.series[cle]?.[champ]?.[i] ?? null;
}

/* ── Les chiffres clés, pays par pays ────────────────────────────────────── */

export function WChiffres({ j }: { j: Jeu }) {
  const champs: Champ[] = ["gdp", "gdp_per_capita", "trade_balance", "inflation"];
  return (
    <div className="db-fiches">
      {j.pays.map((p) => (
        <motion.div key={p.cle} layout className="db-fiche" style={{ borderTopColor: p.couleur }}>
          <p className="db-fiche-nom">{p.label}</p>
          <div className="db-fiche-grille">
            {champs.map((c) => {
              const v = val(j, p.cle, c);
              const precedent = val(j, p.cle, c, j.i - 1);
              const evol = v !== null && precedent !== null && precedent !== 0 ? ((v - precedent) / Math.abs(precedent)) * 100 : null;
              return (
                <div key={c}>
                  <span className="db-fiche-l">{CHAMP_META[c].label}</span>
                  <span className="db-fiche-v">{fmt(v, c)}</span>
                  {evol !== null && (
                    <span className={`db-fiche-e ${evol >= 0 ? "up" : "down"}`}>
                      {evol >= 0 ? "▲" : "▼"} {Math.abs(evol).toFixed(1).replace(".", ",")} %
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Les courbes superposées ─────────────────────────────────────────────── */

export function WCourbes({
  j,
  champ,
  base100,
  onPick,
}: {
  j: Jeu;
  champ: Champ;
  base100: boolean;
  onPick?: (i: number) => void;
}) {
  const L = 1000;
  const H = 300;
  const px = 6;
  const py = 14;

  const prep = useMemo(() => {
    return j.pays.map((p) => {
      const brut = j.series[p.cle]?.[champ] ?? [];
      if (!base100) return { p, pts: brut };
      const ref = brut.find((v) => v !== null && v !== 0);
      return { p, pts: ref ? brut.map((v) => (v === null ? null : (v / ref) * 100)) : brut };
    });
  }, [j, champ, base100]);

  const { min, max } = useMemo(() => {
    const vals = prep.flatMap((s) => s.pts.filter((v): v is number => v !== null));
    if (!vals.length) return { min: 0, max: 1 };
    const lo = Math.min(...vals, 0);
    const hi = Math.max(...vals);
    return { min: lo, max: hi === lo ? lo + 1 : hi };
  }, [prep]);

  const x = (k: number) => px + (k * (L - px * 2)) / Math.max(1, j.annees.length - 1);
  const y = (v: number) => H - py - ((v - min) / (max - min)) * (H - py * 2);

  const chemin = (pts: (number | null)[]) => {
    let d = "";
    let ouvert = false;
    pts.forEach((v, k) => {
      if (v === null) {
        ouvert = false;
        return;
      }
      d += `${ouvert ? "L" : "M"} ${x(k).toFixed(1)} ${y(v).toFixed(1)} `;
      ouvert = true;
    });
    return d.trim();
  };

  const zero = min < 0 && max > 0 ? y(0) : null;

  return (
    <div className="db-scene">
      <svg
        viewBox={`0 0 ${L} ${H}`}
        preserveAspectRatio="none"
        className="db-svg"
        onPointerDown={(e) => {
          if (!onPick) return;
          const r = e.currentTarget.getBoundingClientRect();
          onPick(Math.max(0, Math.min(j.annees.length - 1, Math.round(((e.clientX - r.left) / r.width) * (j.annees.length - 1)))));
        }}
        onPointerMove={(e) => {
          if (!onPick || e.buttons !== 1) return;
          const r = e.currentTarget.getBoundingClientRect();
          onPick(Math.max(0, Math.min(j.annees.length - 1, Math.round(((e.clientX - r.left) / r.width) * (j.annees.length - 1)))));
        }}
      >
        {j.annees.map((a, k) => (a % 10 === 0 ? <line key={a} x1={x(k)} x2={x(k)} y1={py - 6} y2={H - py} stroke={TRAIT} /> : null))}
        <line x1={px} x2={L - px} y1={H - py} y2={H - py} stroke={TRAIT} />
        {zero !== null && <line x1={px} x2={L - px} y1={zero} y2={zero} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 5" />}
        {prep.map((s) => (
          <motion.path
            key={s.p.cle}
            d={chemin(s.pts)}
            fill="none"
            stroke={s.p.couleur}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          />
        ))}
        <line x1={x(j.i)} x2={x(j.i)} y1={py - 6} y2={H - py} stroke="#fff" strokeOpacity={0.42} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="db-marqueurs" aria-hidden="true">
        {prep.map((s) => {
          const v = s.pts[j.i];
          if (v === null || v === undefined) return null;
          return (
            <motion.span
              key={s.p.cle}
              className="db-marqueur"
              style={{ borderColor: s.p.couleur }}
              animate={{ left: `${((x(j.i) - px) / (L - px * 2)) * 100}%`, top: `${((y(v) - py) / (H - py * 2)) * 100}%` }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Les barres de l'année ───────────────────────────────────────────────── */

export function WBarres({ j, champ }: { j: Jeu; champ: Champ }) {
  const rangs = useMemo(
    () =>
      j.pays
        .map((p) => ({ ...p, v: val(j, p.cle, champ) }))
        .sort((a, b) => (b.v ?? -Infinity) - (a.v ?? -Infinity)),
    [j, champ]
  );
  const max = Math.max(1, ...rangs.map((r) => Math.abs(r.v ?? 0)));

  return (
    <div className="db-barres">
      {rangs.map((r) => (
        <motion.div key={r.cle} layout className="db-barre" transition={{ type: "spring", stiffness: 420, damping: 38 }}>
          <span className="db-barre-nom">{r.label}</span>
          <span className="db-barre-piste">
            <motion.span
              className="db-barre-fait"
              style={{ background: r.couleur }}
              animate={{ width: `${r.v === null ? 0 : (Math.abs(r.v) / max) * 100}%` }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
            />
          </span>
          <span className="db-barre-v">{fmt(r.v, champ)}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Le nuage : deux indicateurs croisés ─────────────────────────────────── */

export function WNuage({ j, x: cx, y: cy }: { j: Jeu; x: Champ; y: Champ }) {
  const pts = j.pays
    .map((p) => ({ p, x: val(j, p.cle, cx), y: val(j, p.cle, cy) }))
    .filter((d): d is { p: PaysChoisi; x: number; y: number } => d.x !== null && d.y !== null);

  const xs = pts.map((d) => d.x);
  const ys = pts.map((d) => d.y);
  const xMin = Math.min(0, ...xs);
  const xMax = Math.max(...xs, xMin + 1);
  const yMin = Math.min(0, ...ys);
  const yMax = Math.max(...ys, yMin + 1);

  return (
    <div className="db-nuage">
      <div className="db-nuage-cadre">
        <span className="db-axe-y">{CHAMP_META[cy].label}</span>
        <div className="db-nuage-zone">
          {[0.25, 0.5, 0.75].map((f) => (
            <span key={f} className="db-nuage-grille" style={{ top: `${f * 100}%` }} />
          ))}
          {pts.map((d) => (
            <motion.span
              key={d.p.cle}
              className="db-point"
              style={{ background: d.p.couleur }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                left: `${((d.x - xMin) / (xMax - xMin)) * 100}%`,
                top: `${100 - ((d.y - yMin) / (yMax - yMin)) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <span className="db-point-l">{d.p.label}</span>
            </motion.span>
          ))}
        </div>
        <span className="db-axe-x">{CHAMP_META[cx].label}</span>
      </div>
      {pts.length === 0 && <p className="db-note">Aucune donnée croisée sur cette année.</p>}
    </div>
  );
}

/* ── L'évolution du rang ─────────────────────────────────────────────────── */

export function WRangs({ j, champ }: { j: Jeu; champ: Champ }) {
  /* Le rang à l'intérieur de la sélection, année par année : qui double qui,
     et quand. C'est la lecture que l'échelle absolue écrase. */
  const lignes = useMemo(() => {
    const n = j.pays.length;
    return j.pays.map((p) => ({
      p,
      rangs: j.annees.map((_, k) => {
        const v = val(j, p.cle, champ, k);
        if (v === null) return null;
        const mieux = j.pays.filter((q) => {
          const w = val(j, q.cle, champ, k);
          return w !== null && w > v;
        }).length;
        return mieux + 1;
      }),
      n,
    }));
  }, [j, champ]);

  const L = 1000;
  const H = 200;
  const n = Math.max(2, j.pays.length);
  const x = (k: number) => (k * L) / Math.max(1, j.annees.length - 1);
  const y = (r: number) => 18 + ((r - 1) / (n - 1)) * (H - 36);

  const chemin = (rangs: (number | null)[]) => {
    let d = "";
    let ouvert = false;
    rangs.forEach((r, k) => {
      if (r === null) {
        ouvert = false;
        return;
      }
      d += `${ouvert ? "L" : "M"} ${x(k).toFixed(1)} ${y(r).toFixed(1)} `;
      ouvert = true;
    });
    return d.trim();
  };

  return (
    <div className="db-scene">
      <svg viewBox={`0 0 ${L} ${H}`} preserveAspectRatio="none" className="db-svg">
        {Array.from({ length: n }, (_, k) => (
          <line key={k} x1={0} x2={L} y1={y(k + 1)} y2={y(k + 1)} stroke={TRAIT} />
        ))}
        {lignes.map((l) => (
          <path
            key={l.p.cle}
            d={chemin(l.rangs)}
            fill="none"
            stroke={l.p.couleur}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line x1={x(j.i)} x2={x(j.i)} y1={0} y2={H} stroke="#fff" strokeOpacity={0.42} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="db-rangs-l" aria-hidden="true">
        {Array.from({ length: n }, (_, k) => (
          <span key={k}>#{k + 1}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Le tableau ──────────────────────────────────────────────────────────── */

export function WTableau({ j }: { j: Jeu }) {
  const champs: Champ[] = ["gdp", "gdp_per_capita", "trade_balance", "inflation"];
  return (
    <div className="db-tableau">
      <table>
        <thead>
          <tr>
            <th>Pays</th>
            {champs.map((c) => (
              <th key={c}>{CHAMP_META[c].label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {j.pays.map((p) => (
            <tr key={p.cle}>
              <th scope="row">
                <span className="db-pastille" style={{ background: p.couleur }} />
                {p.label}
              </th>
              {champs.map((c) => (
                <td key={c}>{fmt(val(j, p.cle, c), c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── L'écart au premier ──────────────────────────────────────────────────── */

export function WEcarts({ j, champ }: { j: Jeu; champ: Champ }) {
  const rangs = j.pays
    .map((p) => ({ ...p, v: val(j, p.cle, champ) }))
    .sort((a, b) => (b.v ?? -Infinity) - (a.v ?? -Infinity));
  const tete = rangs[0];

  if (!tete || tete.v === null) return <p className="db-note">Pas de référence sur cette année.</p>;

  return (
    <div className="db-ecarts">
      <p className="db-ecarts-ref">
        Référence <strong style={{ color: tete.couleur }}>{tete.label}</strong> · {fmt(tete.v, champ)}
      </p>
      {rangs.slice(1).map((r) => (
        <div key={r.cle} className="db-ecart">
          <span>{r.label}</span>
          <strong>
            {r.v === null || r.v === 0
              ? "—"
              : champ === "inflation"
                ? `${(r.v - (tete.v as number)).toFixed(1).replace(".", ",")} pt`
                : `× ${((tete.v as number) / r.v).toFixed(1).replace(".", ",")}`}
          </strong>
        </div>
      ))}
    </div>
  );
}
