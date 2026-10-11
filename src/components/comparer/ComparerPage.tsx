"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightLeft, Crown, LineChart, Plus, Radar, Share2, Sparkles, X } from "lucide-react";
import { EnTete, Pied } from "@/components/concept/pieces";
import { ChoixPays, drapeau, type OptionPays } from "@/components/concept/ChoixPays";
import { useSocleDemo, useSocleEco, valeurSocle } from "@/components/compte/socles";
import { COULEURS, INDICS, PRESETS, type Indic } from "./indicateurs";
import "@/components/concept/concept.css";
import "./comparer.css";

type Vue = "face" | "evolution" | "profil";
const DEFAUT_PAYS = ["France", "United States of America", "China"];
const DEFAUT_INDICS = ["gdp", "gdp_per_capita", "population", "inflation", "unemployment"];

const ratio = (a: number, b: number) => {
  const r = a >= b ? a / b : b / a;
  return r.toLocaleString("fr-FR", { maximumFractionDigits: r >= 10 ? 0 : 1 });
};

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function ComparerPage({ iso2 }: { iso2: Record<string, string> }) {
  const eco = useSocleEco();
  const demo = useSocleDemo();

  const [pays, setPays] = useState<string[]>(DEFAUT_PAYS);
  const [indics, setIndics] = useState<string[]>(DEFAUT_INDICS);
  const [annee, setAnnee] = useState<number>(2025);
  const [vue, setVue] = useState<Vue>("face");
  const [courbe, setCourbe] = useState<string>("gdp");
  const [de, setDe] = useState<number>(1960);
  const [a, setA] = useState<number>(2025);
  const [base100, setBase100] = useState(false);
  const [log, setLog] = useState(false);
  const [copie, setCopie] = useState(false);

  /* L'adresse pilote la première vue, et la suit ensuite : un lien partage la comparaison. */
  const pret = useRef(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = q.get("pays")?.split(",").filter(Boolean);
    if (p?.length) setPays(p.slice(0, 4));
    const i = q.get("indic")?.split(",").filter((x) => INDICS.some((y) => y.id === x));
    if (i?.length) setIndics(i);
    const an = Number(q.get("annee"));
    if (an >= 1960 && an <= 2026) setAnnee(an);
    const v = q.get("vue");
    if (v === "face" || v === "evolution" || v === "profil") setVue(v);
    const c = q.get("courbe");
    if (c && INDICS.some((y) => y.id === c)) setCourbe(c);
    const d0 = Number(q.get("de"));
    const a0 = Number(q.get("a"));
    if (d0 >= 1960) setDe(d0);
    if (a0 <= 2026 && a0 > 1960) setA(a0);
    if (q.get("b100") === "1") setBase100(true);
    if (q.get("log") === "1") setLog(true);
    pret.current = true;
  }, []);
  useEffect(() => {
    if (!pret.current) return;
    const q = new URLSearchParams();
    q.set("pays", pays.join(","));
    q.set("indic", indics.join(","));
    q.set("annee", String(annee));
    q.set("vue", vue);
    q.set("courbe", courbe);
    q.set("de", String(de));
    q.set("a", String(a));
    if (base100) q.set("b100", "1");
    if (log) q.set("log", "1");
    window.history.replaceState(null, "", `?${q.toString()}`);
  }, [pays, indics, annee, vue, courbe, de, a, base100, log]);

  const options = useMemo<OptionPays[]>(
    () => (eco ? eco.pays.map((p) => ({ nom: p.nom, fr: p.fr, iso2: iso2[p.nom] })) : []),
    [eco, iso2],
  );
  const fr = useCallback((nom: string) => options.find((o) => o.nom === nom)?.fr ?? nom, [options]);
  const indic = (id: string) => INDICS.find((i) => i.id === id) as Indic;

  const lit = useCallback(
    (i: Indic, nom: string, an: number): number | null => {
      if (i.src === "eco") return eco ? valeurSocle(eco, nom, an, i.champ) : null;
      return demo ? valeurSocle(demo, nom, an, i.champ) : null;
    },
    [eco, demo],
  );

  const annees = eco ? eco.annees : [];
  const anneeMax = annees.length ? annees[annees.length - 1] : 2025;
  const anneeVue = Math.min(annee, 2026);

  const partager = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 1800);
    } catch {}
  };

  const bascule = (id: string) => setIndics((l) => (l.includes(id) ? (l.length > 1 ? l.filter((x) => x !== id) : l) : [...l, id]));

  return (
    <div className="cg cmp">
      <EnTete actif="Comparer" />
      <div className="cmp-fond" aria-hidden="true" />

      <main className="cmp-page">
        {/* ── L'ouverture ─────────────────────────────────────────────────── */}
        <header className="cmp-tete">
          <p className="cmp-sur"><ArrowRightLeft size={14} aria-hidden="true" /> Comparer</p>
          <h1 className="cmp-h1">
            Deux pays, quatre pays,
            <br />
            <span>une seule lecture.</span>
          </h1>
          <p className="cmp-sous">Choisissez vos pays et ce qui compte. Tout se lit dans la même base, de 1960 à aujourd&apos;hui.</p>
        </header>

        {/* ── Les pays ────────────────────────────────────────────────────── */}
        <section className="cmp-scene" aria-label="Pays comparés">
          <div className="cmp-pays">
            {pays.map((nom, i) => (
              <div key={`${i}-${nom}`} className="cmp-pays-c" style={{ "--c": COULEURS[i] } as React.CSSProperties}>
                <span className="cmp-pays-p" aria-hidden="true" />
                <ChoixPays valeur={nom} options={options} label={`Pays ${i + 1}`} onChange={(v) => setPays((l) => l.map((x, k) => (k === i ? v : x)))} />
                {pays.length > 2 && (
                  <button type="button" className="cmp-x" aria-label={`Retirer ${fr(nom)}`} onClick={() => setPays((l) => l.filter((_, k) => k !== i))}>
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
            {pays.length < 4 && (
              <button type="button" className="cmp-ajout" onClick={() => setPays((l) => [...l, ["Germany", "Japan", "Brazil", "India"].find((x) => !l.includes(x)) ?? "Japan"])}>
                <Plus size={15} aria-hidden="true" /> Ajouter un pays
              </button>
            )}
          </div>
          <div className="cmp-presets">
            <span><Sparkles size={13} aria-hidden="true" /> Essayez</span>
            {PRESETS.filter((p) => p.pays.every((n) => options.some((o) => o.nom === n))).map((p) => (
              <button key={p.label} type="button" onClick={() => setPays(p.pays)}>{p.label}</button>
            ))}
          </div>
        </section>

        {/* ── Ce qu'on compare ────────────────────────────────────────────── */}
        <section className="cmp-regle" aria-label="Indicateurs">
          {(["Économie", "Démographie"] as const).map((g) => (
            <div key={g} className="cmp-groupe">
              <b>{g}</b>
              {INDICS.filter((i) => i.groupe === g).map((i) => (
                <button key={i.id} type="button" className={indics.includes(i.id) ? "on" : ""} aria-pressed={indics.includes(i.id)} onClick={() => bascule(i.id)}>
                  {i.label}
                </button>
              ))}
            </div>
          ))}
        </section>

        {/* ── Les trois lectures ──────────────────────────────────────────── */}
        <div className="cmp-barre">
          <div className="cmp-vues" role="tablist" aria-label="Type de lecture">
            {([
              ["face", "Face à face", ArrowRightLeft],
              ["evolution", "Évolution", LineChart],
              ["profil", "Profil", Radar],
            ] as const).map(([id, lib, Ic]) => (
              <button key={id} type="button" role="tab" aria-selected={vue === id} className={vue === id ? "on" : ""} onClick={() => setVue(id)}>
                <Ic size={16} aria-hidden="true" /> {lib}
              </button>
            ))}
          </div>
          <button type="button" className="cmp-partage" onClick={partager}>
            <Share2 size={14} aria-hidden="true" /> {copie ? "Lien copié" : "Partager"}
          </button>
        </div>

        {!eco ? (
          <div className="cmp-attente" aria-label="Chargement des données"><i /><i /><i /></div>
        ) : (
          <>
            {vue !== "evolution" && (
              <div className="cmp-annee">
                <span>Année</span>
                <input type="range" min={1960} max={2026} value={anneeVue} onChange={(e) => setAnnee(Number(e.target.value))} aria-label="Année comparée" />
                <strong>{anneeVue}</strong>
              </div>
            )}

            {vue === "face" && <FaceAFace pays={pays} indics={indics} annee={anneeVue} lit={lit} fr={fr} iso2={iso2} eco={eco} indic={indic} />}
            {vue === "evolution" && (
              <Evolution
                pays={pays}
                courbe={courbe}
                setCourbe={setCourbe}
                de={de}
                a={a}
                setDe={setDe}
                setA={setA}
                base100={base100}
                setBase100={setBase100}
                log={log}
                setLog={setLog}
                lit={lit}
                fr={fr}
                iso2={iso2}
                anneeMax={Math.max(anneeMax, demo ? demo.annees[demo.annees.length - 1] : 0)}
              />
            )}
            {vue === "profil" && <Profil pays={pays} indics={indics} annee={anneeVue} lit={lit} fr={fr} eco={eco} demo={demo} />}
          </>
        )}

        <p className="cmp-sources">
          Sources : Banque mondiale (WDI), FMI, Nations Unies (World Population Prospects 2024). Une valeur absente reste absente : elle n&apos;est jamais comptée pour zéro.
        </p>
      </main>
      <Pied />
    </div>
  );
}

type Lit = (i: Indic, nom: string, an: number) => number | null;

/* ═══════════════════════════════════════════════════════════════════════════
   FACE À FACE
   ═══════════════════════════════════════════════════════════════════════════ */

function FaceAFace({
  pays,
  indics,
  annee,
  lit,
  fr,
  iso2,
  eco,
  indic,
}: {
  pays: string[];
  indics: string[];
  annee: number;
  lit: Lit;
  fr: (n: string) => string;
  iso2: Record<string, string>;
  eco: NonNullable<ReturnType<typeof useSocleEco>>;
  indic: (id: string) => Indic;
}) {
  /* Le rang de chaque pays dans le monde, sur le PIB de l'année. */
  const rangs = useMemo(() => {
    const m = new Map<string, number>();
    const place = (eco.cols[annee] ?? {})["gdp"];
    if (place === undefined) return m;
    const vals = (eco.lignes[annee] ?? []).map((l) => ({ nom: eco.pays[l[0] as number].nom, v: l[place] })).filter((x): x is { nom: string; v: number } => typeof x.v === "number");
    vals.sort((x, y) => y.v - x.v);
    vals.forEach((x, i) => m.set(x.nom, i + 1));
    return m;
  }, [eco, annee]);

  /* Les phrases qui disent l'écart : le plus grand contre le plus petit. */
  const faits = useMemo(() => {
    const l: { v: string; t: string }[] = [];
    for (const id of ["gdp", "gdp_per_capita", "population", "unemployment", "inflation"]) {
      const i = indic(id);
      const vals = pays.map((n) => ({ n, v: lit(i, n, annee) })).filter((x): x is { n: string; v: number } => x.v !== null && x.v > 0);
      if (vals.length < 2) continue;
      vals.sort((x, y) => y.v - x.v);
      const haut = vals[0];
      const bas = vals[vals.length - 1];
      if (haut.v / bas.v < 1.05) continue;
      l.push({ v: `×${ratio(haut.v, bas.v)}`, t: `${fr(haut.n)} : ${i.nom} est ${ratio(haut.v, bas.v)} fois celui de ${fr(bas.n)}.` });
      if (l.length === 3) break;
    }
    return l;
  }, [pays, annee, lit, fr, indic]);

  return (
    <div className="cmp-face">
      <div className="cmp-tetes" style={{ "--n": pays.length } as React.CSSProperties}>
        {pays.map((n, i) => (
          <article key={`${i}-${n}`} className="cmp-tete-p" style={{ "--c": COULEURS[i] } as React.CSSProperties}>
            <span className="cmp-drap" aria-hidden="true">{drapeau(iso2[n])}</span>
            <h2>{fr(n)}</h2>
            <p>{rangs.get(n) ? `${rangs.get(n)}${rangs.get(n) === 1 ? "re" : "ᵉ"} économie du monde en ${annee}` : `Données ${annee}`}</p>
          </article>
        ))}
      </div>

      {faits.length > 0 && (
        <div className="cmp-faits">
          {faits.map((f, i) => (
            <article key={i} className="cmp-fait" style={{ "--k": i } as React.CSSProperties}>
              <strong>{f.v}</strong>
              <p>{f.t}</p>
            </article>
          ))}
        </div>
      )}

      <div className="cmp-lignes">
        {indics.map((id, k) => {
          const i = indic(id);
          const vals = pays.map((n) => lit(i, n, annee));
          const max = Math.max(1e-9, ...vals.map((v) => (v === null ? 0 : Math.abs(v))));
          const present = vals.filter((v): v is number => v !== null);
          const meilleur = present.length > 1 ? Math.max(...present.map((v) => v)) : null;
          const pos = present.filter((v) => v > 0);
          return (
            <section key={id} className="cmp-ligne" style={{ "--k": k } as React.CSSProperties}>
              <header>
                <h3>{i.label}</h3>
                {pos.length > 1 && <span className="cmp-ecart">×{ratio(Math.max(...pos), Math.min(...pos))} d&apos;écart</span>}
              </header>
              <div className="cmp-barres">
                {vals.map((v, j) => (
                  <div key={j} className={`cmp-b${v !== null && v === meilleur ? " cmp-b-top" : ""}`} style={{ "--c": COULEURS[j] } as React.CSSProperties}>
                    <span className="cmp-b-n">{drapeau(iso2[pays[j]])} {fr(pays[j])}</span>
                    <span className="cmp-b-piste">
                      <i style={{ width: v === null ? "0%" : `${Math.max(2, (Math.abs(v) / max) * 100)}%` }} />
                    </span>
                    <span className="cmp-b-v">
                      {v !== null && v === meilleur && <Crown size={13} aria-label="Valeur la plus élevée" />}
                      {v === null ? "—" : i.fmt(v)}
                    </span>
                    {j > 0 && v !== null && vals[0] !== null && v > 0 && (vals[0] as number) > 0 && (
                      <span className="cmp-b-m">{v >= (vals[0] as number) ? "×" : "÷"}{ratio(v, vals[0] as number)}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ÉVOLUTION
   ═══════════════════════════════════════════════════════════════════════════ */

const W = 1000;
const H = 440;
const M = { g: 64, d: 24, h: 24, b: 40 };

function Evolution({
  pays, courbe, setCourbe, de, a, setDe, setA, base100, setBase100, log, setLog, lit, fr, iso2, anneeMax,
}: {
  pays: string[];
  courbe: string;
  setCourbe: (s: string) => void;
  de: number;
  a: number;
  setDe: (n: number) => void;
  setA: (n: number) => void;
  base100: boolean;
  setBase100: (b: boolean) => void;
  log: boolean;
  setLog: (b: boolean) => void;
  lit: Lit;
  fr: (n: string) => string;
  iso2: Record<string, string>;
  anneeMax: number;
}) {
  const i = INDICS.find((x) => x.id === courbe) ?? INDICS[0];
  const debut = Math.min(de, a - 1);
  const fin = Math.max(a, debut + 1);
  const ans = useMemo(() => Array.from({ length: fin - debut + 1 }, (_, k) => debut + k), [debut, fin]);

  const series = useMemo(() => {
    return pays.map((n) => {
      const brut = ans.map((an) => lit(i, n, an));
      const premier = brut.find((v) => v !== null && v !== 0) ?? null;
      const vals = brut.map((v) => (v === null ? null : base100 ? (premier ? (v / premier) * 100 : null) : v));
      return { n, brut, vals };
    });
  }, [pays, ans, i, lit, base100]);

  const peutLog = !i.signe;
  const echelleLog = log && peutLog;

  const { ymin, ymax, ticks, y } = useMemo(() => {
    const tous = series.flatMap((s) => s.vals).filter((v): v is number => v !== null && (!echelleLog || v > 0));
    let lo = tous.length ? Math.min(...tous) : 0;
    let hi = tous.length ? Math.max(...tous) : 1;
    if (!echelleLog) lo = Math.min(lo, 0) === lo && lo < 0 ? lo : Math.min(0, lo);
    if (hi === lo) hi = lo + 1;
    const f = echelleLog
      ? (v: number) => (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))
      : (v: number) => (v - lo) / (hi - lo);
    const t: number[] = [];
    if (echelleLog) {
      const e0 = Math.floor(Math.log10(lo));
      const e1 = Math.ceil(Math.log10(hi));
      for (let e = e0; e <= e1; e++) if (10 ** e >= lo * 0.999 && 10 ** e <= hi * 1.001) t.push(10 ** e);
    } else {
      for (let k = 0; k <= 4; k++) t.push(lo + ((hi - lo) * k) / 4);
    }
    return { ymin: lo, ymax: hi, ticks: t, y: (v: number) => M.h + (1 - Math.max(0, Math.min(1, f(v)))) * (H - M.h - M.b) };
  }, [series, echelleLog]);

  const x = (an: number) => M.g + ((an - debut) / (fin - debut)) * (W - M.g - M.d);

  const chemin = (vals: (number | null)[]) => {
    let d = "";
    let ouvert = false;
    vals.forEach((v, k) => {
      if (v === null || (echelleLog && v <= 0)) {
        ouvert = false;
        return;
      }
      d += `${ouvert ? "L" : "M"}${x(ans[k]).toFixed(1)} ${y(v).toFixed(1)} `;
      ouvert = true;
    });
    return d.trim();
  };

  const [vise, setVise] = useState<number | null>(null);
  const zone = useRef<SVGSVGElement>(null);
  const survol = (e: React.PointerEvent) => {
    const r = zone.current?.getBoundingClientRect();
    if (!r) return;
    const px = ((e.clientX - r.left) / r.width) * W;
    const t = (px - M.g) / (W - M.g - M.d);
    setVise(Math.max(0, Math.min(ans.length - 1, Math.round(t * (ans.length - 1)))));
  };

  const fmtAxe = (v: number) => (base100 ? v.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : i.fmt(v));
  const rafraichit = `${courbe}-${debut}-${fin}-${base100}-${echelleLog}-${pays.join("|")}`;

  return (
    <div className="cmp-evo">
      <div className="cmp-evo-ctrl">
        <div className="cmp-evo-indic" role="tablist" aria-label="Indicateur de la courbe">
          {INDICS.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={courbe === x.id} className={courbe === x.id ? "on" : ""} onClick={() => setCourbe(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        <div className="cmp-evo-opts">
          <label className="cmp-bascule">
            <input type="checkbox" checked={base100} onChange={(e) => setBase100(e.target.checked)} />
            <span />
            Base 100 au départ
          </label>
          <label className={`cmp-bascule${peutLog ? "" : " cmp-bascule-off"}`}>
            <input type="checkbox" checked={echelleLog} disabled={!peutLog} onChange={(e) => setLog(e.target.checked)} />
            <span />
            Échelle logarithmique
          </label>
        </div>
      </div>

      <div className="cmp-evo-carte">
        <svg ref={zone} viewBox={`0 0 ${W} ${H}`} className="cmp-svg" role="img" aria-label={`Évolution : ${i.label}`} onPointerMove={survol} onPointerLeave={() => setVise(null)}>
          {ticks.map((t, k) => (
            <g key={k}>
              <line x1={M.g} x2={W - M.d} y1={y(t)} y2={y(t)} className="cmp-grille" />
              <text x={M.g - 10} y={y(t) + 4} textAnchor="end" className="cmp-axe">{fmtAxe(t)}</text>
            </g>
          ))}
          {ans.filter((an) => an % (fin - debut > 40 ? 10 : fin - debut > 15 ? 5 : 2) === 0).map((an) => (
            <text key={an} x={x(an)} y={H - 12} textAnchor="middle" className="cmp-axe">{an}</text>
          ))}
          {ymin < 0 && ymax > 0 && !echelleLog && <line x1={M.g} x2={W - M.d} y1={y(0)} y2={y(0)} className="cmp-zero" />}
          {series.map((s, k) => (
            <path key={`${rafraichit}-${k}`} d={chemin(s.vals)} pathLength={1} className="cmp-ligne-c" style={{ "--c": COULEURS[k], "--k": k } as React.CSSProperties} />
          ))}
          {vise !== null && (
            <g>
              <line x1={x(ans[vise])} x2={x(ans[vise])} y1={M.h} y2={H - M.b} className="cmp-reperes" />
              {series.map((s, k) => {
                const v = s.vals[vise];
                return v === null || (echelleLog && v <= 0) ? null : <circle key={k} cx={x(ans[vise])} cy={y(v)} r={6} fill={COULEURS[k]} className="cmp-point" />;
              })}
            </g>
          )}
        </svg>

        {vise !== null && (
          <div className="cmp-info" style={{ left: `${(x(ans[vise]) / W) * 100}%` }} data-droite={x(ans[vise]) > W * 0.62 ? "1" : "0"}>
            <b>{ans[vise]}</b>
            {series.map((s, k) => (
              <span key={k} style={{ "--c": COULEURS[k] } as React.CSSProperties}>
                <i />
                {fr(s.n)}
                <em>{s.brut[vise] === null ? "—" : i.fmt(s.brut[vise] as number)}</em>
              </span>
            ))}
          </div>
        )}

        <div className="cmp-evo-periode">
          <label>
            De <strong>{debut}</strong>
            <input type="range" min={1960} max={anneeMax - 1} value={debut} onChange={(e) => setDe(Math.min(Number(e.target.value), fin - 1))} aria-label="Début de la période" />
          </label>
          <label>
            à <strong>{fin}</strong>
            <input type="range" min={1961} max={anneeMax} value={fin} onChange={(e) => setA(Math.max(Number(e.target.value), debut + 1))} aria-label="Fin de la période" />
          </label>
        </div>
      </div>

      <div className="cmp-bilans">
        {series.map((s, k) => {
          const pts = s.brut.map((v, idx) => ({ v, an: ans[idx] })).filter((p): p is { v: number; an: number } => p.v !== null && p.v > 0);
          const d0 = pts[0];
          const d1 = pts[pts.length - 1];
          const taux = d0 && d1 && d1.an > d0.an ? (Math.pow(d1.v / d0.v, 1 / (d1.an - d0.an)) - 1) * 100 : null;
          return (
            <article key={k} className="cmp-bilan" style={{ "--c": COULEURS[k] } as React.CSSProperties}>
              <span className="cmp-bilan-p" aria-hidden="true" />
              <h4>{drapeau(iso2[s.n])} {fr(s.n)}</h4>
              <strong>{d1 ? i.fmt(d1.v) : "—"}</strong>
              <p>
                {d0 && d1 ? `${d0.an} : ${i.fmt(d0.v)}` : "Pas de série sur cette période"}
                {taux !== null && !i.signe && <em> · {taux >= 0 ? "+" : ""}{taux.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % par an</em>}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROFIL — un radar des rangs
   ═══════════════════════════════════════════════════════════════════════════ */

function Profil({
  pays, indics, annee, lit, fr, eco, demo,
}: {
  pays: string[];
  indics: string[];
  annee: number;
  lit: Lit;
  fr: (n: string) => string;
  eco: NonNullable<ReturnType<typeof useSocleEco>>;
  demo: ReturnType<typeof useSocleDemo>;
}) {
  /* Le rang d'un pays sur un indicateur : la part des autres pays qu'il dépasse. */
  const rang = useMemo(() => {
    const f = (i: Indic, nom: string): number | null => {
      const s = i.src === "eco" ? eco : demo;
      if (!s) return null;
      const place = (s.cols[annee] ?? {})[i.champ];
      const v = lit(i, nom, annee);
      if (place === undefined || v === null) return null;
      const vals = (s.lignes[annee] ?? []).map((l) => l[place]).filter((x): x is number => typeof x === "number");
      if (vals.length < 2) return null;
      return vals.filter((x) => x < v).length / (vals.length - 1);
    };
    return f;
  }, [eco, demo, annee, lit]);

  const axes = useMemo(
    () => INDICS.filter((i) => indics.includes(i.id)).filter((i) => pays.some((n) => rang(i, n) !== null)),
    [indics, pays, rang],
  );

  const C = 230;
  const R = 160;
  const pt = (k: number, v: number) => {
    const ang = (-Math.PI / 2) + (k / Math.max(1, axes.length)) * Math.PI * 2;
    return [C + Math.cos(ang) * R * v, C + Math.sin(ang) * R * v] as const;
  };

  if (axes.length < 3) {
    return <p className="cmp-vide">Choisissez au moins trois indicateurs disponibles pour {annee} afin de tracer un profil.</p>;
  }

  return (
    <div className="cmp-profil">
      <div className="cmp-radar-c">
        <svg viewBox="-70 -10 600 480" className="cmp-radar" role="img" aria-label="Profil comparé">
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <polygon key={r} points={axes.map((_, k) => pt(k, r).join(",")).join(" ")} className="cmp-toile" />
          ))}
          {axes.map((a, k) => {
            const [px, py] = pt(k, 1);
            const [lx, ly] = pt(k, 1.16);
            return (
              <g key={a.id}>
                <line x1={C} y1={C} x2={px} y2={py} className="cmp-toile" />
                <text x={lx} y={ly} textAnchor={lx < C - 6 ? "end" : lx > C + 6 ? "start" : "middle"} dominantBaseline="middle" className="cmp-radar-l">{a.label}</text>
              </g>
            );
          })}
          {pays.map((n, j) => {
            const pts = axes.map((a, k) => pt(k, rang(a, n) ?? 0));
            return (
              <g key={`${j}-${n}`} style={{ "--c": COULEURS[j], "--k": j } as React.CSSProperties} className="cmp-radar-g">
                <polygon points={pts.map((p) => p.join(",")).join(" ")} className="cmp-radar-p" />
                {pts.map((p, k) => (
                  <circle key={k} cx={p[0]} cy={p[1]} r={4} className="cmp-radar-pt" />
                ))}
              </g>
            );
          })}
        </svg>
        <p className="cmp-note">Chaque axe place le pays parmi tous les autres en {annee} : plus c&apos;est loin du centre, plus il dépasse de pays sur cet indicateur.</p>
      </div>

      <div className="cmp-tab">
        <div className="cmp-tab-l cmp-tab-t">
          <span />
          {pays.map((n, j) => (
            <span key={j} style={{ "--c": COULEURS[j] } as React.CSSProperties}><i />{fr(n)}</span>
          ))}
        </div>
        {axes.map((a) => (
          <div key={a.id} className="cmp-tab-l">
            <span>{a.label}</span>
            {pays.map((n, j) => {
              const r = rang(a, n);
              return <span key={j} style={{ "--c": COULEURS[j] } as React.CSSProperties}>{r === null ? "—" : `${Math.round(r * 100)}ᵉ centile`}</span>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
