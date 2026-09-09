"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════════════
   LE TABLEAU DE BORD

   Comparer, c'est superposer. La page tient en une hauteur d'écran : on
   choisit des pays, un indicateur, une année, et tout se met à jour en même
   temps — les courbes, les barres, le tableau.

   Deux lectures possibles : les valeurs telles qu'elles sont publiées, ou
   ramenées à base 100 sur la première année où chaque pays a une donnée.
   La seconde répond à la question « qui a progressé le plus vite », que
   l'échelle absolue rend illisible dès qu'un pays écrase les autres.

   Une année sans donnée reste un trou : la courbe s'interrompt, la barre
   affiche un tiret. Rien n'est interpolé.
   ═══════════════════════════════════════════════════════════════════════════ */

const COULEURS = ["#39FF88", "#5AC8FF", "#FFD166", "#FF7B72", "#C792EA", "#FF9F6E"];
const TRAIT = "rgba(255,255,255,0.10)";

export const CHAMPS_UI = [
  { id: "gdp", label: "PIB", unite: "€", court: "Md€" },
  { id: "gdp_per_capita", label: "PIB par habitant", unite: "€", court: "€" },
  { id: "trade_balance", label: "Balance commerciale", unite: "€", court: "Md€" },
  { id: "inflation", label: "Inflation", unite: "%", court: "%" },
] as const;

type ChampId = (typeof CHAMPS_UI)[number]["id"];

interface Pays {
  cle: string;
  label: string;
}

function fmt(v: number | null, champ: ChampId): string {
  if (v === null) return "—";
  if (champ === "inflation") return `${v.toFixed(1).replace(".", ",")} %`;
  if (champ === "gdp_per_capita") return `${Math.round(v).toLocaleString("fr-FR")} €`;
  const a = Math.abs(v);
  if (a >= 1000) return `${(v / 1000).toFixed(1).replace(".", ",")} T€`;
  return `${Math.round(v).toLocaleString("fr-FR")} Md€`;
}

/* ── Les courbes superposées ─────────────────────────────────────────────── */

function Courbes({
  annees,
  series,
  pays,
  champ,
  base100,
  i,
  onPick,
}: {
  annees: number[];
  series: Record<string, (number | null)[]>;
  pays: Pays[];
  champ: ChampId;
  base100: boolean;
  i: number;
  onPick: (i: number) => void;
}) {
  const L = 1000;
  const H = 300;
  const px = 6;
  const py = 14;

  const preparees = useMemo(() => {
    const out: { cle: string; couleur: string; pts: (number | null)[] }[] = [];
    pays.forEach((p, k) => {
      const brut = series[p.cle];
      if (!brut) return;
      let pts = brut;
      if (base100) {
        const ref = brut.find((v) => v !== null && v !== 0);
        pts = ref ? brut.map((v) => (v === null ? null : (v / ref) * 100)) : brut;
      }
      out.push({ cle: p.cle, couleur: COULEURS[k % COULEURS.length], pts });
    });
    return out;
  }, [series, pays, base100]);

  const { min, max } = useMemo(() => {
    const vals = preparees.flatMap((s) => s.pts.filter((v): v is number => v !== null));
    if (!vals.length) return { min: 0, max: 1 };
    const lo = Math.min(...vals, 0);
    const hi = Math.max(...vals);
    return { min: lo, max: hi === lo ? lo + 1 : hi };
  }, [preparees]);

  const x = (k: number) => px + (k * (L - px * 2)) / (annees.length - 1);
  const y = (v: number) => H - py - ((v - min) / (max - min)) * (H - py * 2);

  /* Un `null` coupe la ligne : on repart en `M` au point suivant plutôt que
     de tirer un trait par-dessus une année que la source ne publie pas. */
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

  const ref = useRef<SVGSVGElement>(null);
  const viser = useCallback(
    (e: React.PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const t = (e.clientX - r.left) / r.width;
      onPick(Math.max(0, Math.min(annees.length - 1, Math.round(t * (annees.length - 1)))));
    },
    [annees.length, onPick]
  );

  const zero = min < 0 && max > 0 ? y(0) : null;

  return (
    <div className="cp-scene">
      <svg
      ref={ref}
      viewBox={`0 0 ${L} ${H}`}
      preserveAspectRatio="none"
      className="cp-courbes"
      onPointerDown={viser}
      onPointerMove={(e) => e.buttons === 1 && viser(e)}
    >
      {annees.map((a, k) =>
        a % 10 === 0 ? <line key={a} x1={x(k)} x2={x(k)} y1={py - 6} y2={H - py} stroke={TRAIT} /> : null
      )}
      <line x1={px} x2={L - px} y1={H - py} y2={H - py} stroke={TRAIT} />
      {zero !== null && <line x1={px} x2={L - px} y1={zero} y2={zero} stroke="rgba(255,255,255,0.28)" strokeDasharray="4 5" />}

      {preparees.map((s) => (
        <motion.path
          key={s.cle}
          d={chemin(s.pts)}
          fill="none"
          stroke={s.couleur}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      <motion.line
        x1={x(i)}
        x2={x(i)}
        y1={py - 6}
        y2={H - py}
        stroke="#fff"
        strokeOpacity={0.45}
        vectorEffect="non-scaling-stroke"
        animate={{ x1: x(i), x2: x(i) }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
      />
    </svg>
      <div className="cp-marqueurs" aria-hidden="true">
        {preparees.map((s) => {
          const v = s.pts[i];
          if (v === null) return null;
          return (
            <motion.span
              key={`pt-${s.cle}`}
              className="cp-marqueur"
              style={{ borderColor: s.couleur }}
              animate={{
                left: `${((x(i) - px) / (L - px * 2)) * 100}%`,
                top: `${((y(v) - py) / (H - py * 2)) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function ComparerDashboard({
  catalogue,
  defaut,
}: {
  catalogue: Pays[];
  defaut: string[];
}) {
  const [choisis, setChoisis] = useState<string[]>(defaut);
  const [champ, setChamp] = useState<ChampId>("gdp");
  const [base100, setBase100] = useState(false);
  const [annees, setAnnees] = useState<number[]>([]);
  const [series, setSeries] = useState<Record<string, (number | null)[]>>({});
  const [i, setI] = useState(0);
  const [q, setQ] = useState("");
  const [charge, setCharge] = useState(true);

  const pays = useMemo(
    () => choisis.map((c) => catalogue.find((p) => p.cle === c)).filter(Boolean) as Pays[],
    [choisis, catalogue]
  );

  /* Une seule requête par changement de sélection ou d'indicateur. */
  useEffect(() => {
    if (!choisis.length) {
      setSeries({});
      setCharge(false);
      return;
    }
    let vivant = true;
    setCharge(true);
    fetch(`/api/series?champ=${champ}&pays=${encodeURIComponent(choisis.join("|"))}`)
      .then((r) => r.json())
      .then((d) => {
        if (!vivant) return;
        setAnnees(d.annees);
        setSeries(d.series);
        setI((k) => (k === 0 || k >= d.annees.length ? d.annees.length - 1 : k));
        setCharge(false);
      })
      .catch(() => vivant && setCharge(false));
    return () => {
      vivant = false;
    };
  }, [choisis, champ]);

  const basculer = useCallback((cle: string) => {
    setChoisis((l) => (l.includes(cle) ? l.filter((c) => c !== cle) : l.length >= 6 ? l : [...l, cle]));
  }, []);

  const resultats = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return catalogue.filter((p) => p.label.toLowerCase().includes(t)).slice(0, 8);
  }, [q, catalogue]);

  const annee = annees[i];
  const uniteCourte = CHAMPS_UI.find((c) => c.id === champ)?.court ?? "";

  /* Le classement de l'année affichée, pour les barres et le tableau. */
  const rangs = useMemo(() => {
    return pays
      .map((p, k) => ({
        ...p,
        couleur: COULEURS[k % COULEURS.length],
        v: series[p.cle]?.[i] ?? null,
      }))
      .sort((a, b) => (b.v ?? -Infinity) - (a.v ?? -Infinity));
  }, [pays, series, i]);

  const maxAbs = Math.max(1, ...rangs.map((r) => Math.abs(r.v ?? 0)));

  return (
    <div className="cp">
      <div className="nc-scan" aria-hidden="true" />

      {/* ── La tête ──────────────────────────────────────────────────────── */}
      <header className="cp-tete">
        <div className="cp-tete-gauche">
          <h1 className="nc-titre">
            Comparer, <span>indicateur par indicateur</span>
          </h1>
          <span className="nc-sous">{catalogue.length} pays · 1960–2025 · Banque mondiale (WDI)</span>
        </div>
        <div className="cp-champs" role="group" aria-label="Indicateur">
          {CHAMPS_UI.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChamp(c.id)}
              className={`cp-champ${champ === c.id ? " cp-champ-actif" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="cp-tete-droite">
          <Link href="/neo" className="nc-btn">
            Live
          </Link>
          <Link href="/map/economy" className="nc-btn nc-btn-plein">
            Carte
          </Link>
        </div>
      </header>

      {/* ── La sélection ─────────────────────────────────────────────────── */}
      <div className="cp-selection">
        {pays.map((p, k) => (
          <button key={p.cle} type="button" onClick={() => basculer(p.cle)} className="cp-puce" title="Retirer">
            <span className="cp-puce-point" style={{ background: COULEURS[k % COULEURS.length] }} />
            {p.label}
            <span className="cp-puce-x" aria-hidden="true">
              ×
            </span>
          </button>
        ))}

        <div className="cp-recherche">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={choisis.length >= 6 ? "Six pays au maximum" : "Ajouter un pays…"}
            disabled={choisis.length >= 6}
            aria-label="Ajouter un pays"
          />
          {resultats.length > 0 && (
            <ul className="cp-suggestions">
              {resultats.map((p) => (
                <li key={p.cle}>
                  <button
                    type="button"
                    onClick={() => {
                      basculer(p.cle);
                      setQ("");
                    }}
                    disabled={choisis.includes(p.cle)}
                  >
                    {p.label}
                    {choisis.includes(p.cle) && <span> · déjà là</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="cp-bascule">
          <input type="checkbox" checked={base100} onChange={(e) => setBase100(e.target.checked)} />
          <span>Base 100</span>
        </label>
      </div>

      {/* ── La grille ────────────────────────────────────────────────────── */}
      <div className="cp-grille">
        <section className="nc-panneau" style={{ gridArea: "courbes" }}>
          <span className="nc-eq nc-eq-tl" aria-hidden="true" />
          <span className="nc-eq nc-eq-br" aria-hidden="true" />
          <header className="nc-panneau-tete">
            <span className="nc-label">
              {CHAMPS_UI.find((c) => c.id === champ)?.label}
              {base100 ? " · base 100" : ` · ${uniteCourte}`}
            </span>
            <span className="nc-mini">{charge ? "chargement…" : "glissez sur le graphique"}</span>
          </header>
          <div className="nc-panneau-corps">
            {annees.length > 0 && pays.length > 0 ? (
              <>
                <Courbes
                  annees={annees}
                  series={series}
                  pays={pays}
                  champ={champ}
                  base100={base100}
                  i={i}
                  onPick={setI}
                />
                <div className="nc-piste">
                  <span className="nc-piste-fond">
                    <motion.span
                      className="nc-piste-fait"
                      animate={{ width: `${(i / (annees.length - 1)) * 100}%` }}
                      transition={{ duration: 0.12 }}
                    />
                  </span>
                  <div className="nc-decennies">
                    {annees.map((a, k) =>
                      a % 10 === 0 ? (
                        <button
                          key={a}
                          type="button"
                          className={`nc-dec${k === i ? " nc-dec-actif" : ""}`}
                          onClick={() => setI(k)}
                          style={{ left: `${(k / (annees.length - 1)) * 100}%` }}
                        >
                          {a}
                        </button>
                      ) : null
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="cp-vide">Ajoutez un pays pour commencer.</p>
            )}
          </div>
        </section>

        <section className="nc-panneau" style={{ gridArea: "barres" }}>
          <span className="nc-eq nc-eq-tl" aria-hidden="true" />
          <span className="nc-eq nc-eq-br" aria-hidden="true" />
          <header className="nc-panneau-tete">
            <span className="nc-label">Au coude à coude</span>
            <span className="nc-mini">{annee ?? "—"}</span>
          </header>
          <div className="nc-panneau-corps cp-barres">
            {rangs.map((r) => (
              <motion.div key={r.cle} layout className="cp-barre" transition={{ type: "spring", stiffness: 420, damping: 38 }}>
                <span className="cp-barre-nom">{r.label}</span>
                <span className="cp-barre-piste">
                  <motion.span
                    className="cp-barre-fait"
                    style={{ background: r.couleur }}
                    animate={{ width: `${r.v === null ? 0 : (Math.abs(r.v) / maxAbs) * 100}%` }}
                    transition={{ type: "spring", stiffness: 220, damping: 30 }}
                  />
                </span>
                <span className="cp-barre-val">{fmt(r.v, champ)}</span>
              </motion.div>
            ))}
            {rangs.some((r) => r.v === null) && (
              <p className="cp-note">Un tiret signale une année que la source ne publie pas pour ce pays.</p>
            )}
          </div>
        </section>

        <section className="nc-panneau" style={{ gridArea: "ecarts" }}>
          <span className="nc-eq nc-eq-tl" aria-hidden="true" />
          <span className="nc-eq nc-eq-br" aria-hidden="true" />
          <header className="nc-panneau-tete">
            <span className="nc-label">L&apos;écart au premier</span>
            <span className="nc-mini">{annee ?? "—"}</span>
          </header>
          <div className="nc-panneau-corps cp-ecarts">
            {rangs.length > 1 && rangs[0].v !== null ? (
              rangs.slice(1).map((r) => (
                <div key={r.cle} className="cp-ecart">
                  <span className="cp-ecart-nom">{r.label}</span>
                  <span className="cp-ecart-v">
                    {r.v === null || r.v === 0 || rangs[0].v === null
                      ? "—"
                      : champ === "inflation"
                        ? `${(r.v - (rangs[0].v as number)).toFixed(1).replace(".", ",")} pt`
                        : `× ${((rangs[0].v as number) / r.v).toFixed(1).replace(".", ",")}`}
                  </span>
                </div>
              ))
            ) : (
              <p className="cp-note">Sélectionnez au moins deux pays.</p>
            )}
            <p className="cp-note cp-note-bas">
              Référence&nbsp;: {rangs[0]?.label ?? "—"}. Sur l&apos;inflation, l&apos;écart est en points, pas
              en multiple.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
