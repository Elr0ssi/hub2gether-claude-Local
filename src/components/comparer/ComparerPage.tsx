"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Crown, HelpCircle, Pause, Play, Plus, Share2, Sparkles, X } from "lucide-react";
import { EnTete, Pied } from "@/components/concept/pieces";
import { ChoixPays, drapeau, type OptionPays } from "@/components/concept/ChoixPays";
import { Dessin, Jetons } from "@/components/concept/Jetons";
import { Titre, usePret, useProgression, useVu } from "@/components/concept/ouverture";
import { useSocleDemo, useSocleEco, valeurSocle } from "@/components/compte/socles";
import { COULEURS, INDICS, PRESETS, type Indic } from "./indicateurs";
import "@/components/concept/concept.css";
import "@/components/concept/v2eco.css";
import "./comparer.css";

const DEFAUT_PAYS = ["France", "United States of America", "China"];
const AN_MIN = 1960;

const ratio = (a: number, b: number) => {
  const r = a >= b ? a / b : b / a;
  return r.toLocaleString("fr-FR", { maximumFractionDigits: r >= 10 ? 0 : 1 });
};
type Lit = (i: Indic, nom: string, an: number) => number | null;
type Eco = NonNullable<ReturnType<typeof useSocleEco>>;
type Demo = ReturnType<typeof useSocleDemo>;

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE — un seul écran de travail

   Les pays en haut, un indicateur à la fois, puis la scène : les barres de
   l'année choisie et la courbe de toutes les années, reliées entre elles. En
   dessous, tous les indicateurs d'un coup d'œil : un clic en choisit un.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ComparerPage({ iso2 }: { iso2: Record<string, string> }) {
  const eco = useSocleEco();
  const demo = useSocleDemo();
  const ouverture = useProgression();
  const haut = useVu(260);
  const arrive = usePret();

  const [pays, setPays] = useState<string[]>(DEFAUT_PAYS);
  const [indicId, setIndicId] = useState<string>("gdp");
  const [annee, setAnnee] = useState<number>(2025);
  const [base100, setBase100] = useState(false);
  const [log, setLog] = useState(false);
  const [copie, setCopie] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [epingle, setEpingle] = useState<number | null>(null);
  const [lecture, setLecture] = useState(false);

  const pret = useRef(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = q.get("pays")?.split(",").filter(Boolean);
    if (p?.length) setPays(p.slice(0, 4));
    const i = q.get("indic");
    if (i && INDICS.some((y) => y.id === i)) setIndicId(i);
    const an = Number(q.get("annee"));
    if (an >= AN_MIN && an <= 2026) setAnnee(an);
    if (q.get("b100") === "1") setBase100(true);
    if (q.get("log") === "1") setLog(true);
    pret.current = true;
  }, []);
  useEffect(() => {
    if (!pret.current) return;
    const q = new URLSearchParams();
    q.set("pays", pays.join(","));
    q.set("indic", indicId);
    q.set("annee", String(annee));
    if (base100) q.set("b100", "1");
    if (log) q.set("log", "1");
    window.history.replaceState(null, "", `?${q.toString()}`);
  }, [pays, indicId, annee, base100, log]);

  const options = useMemo<OptionPays[]>(() => (eco ? eco.pays.map((p) => ({ nom: p.nom, fr: p.fr, iso2: iso2[p.nom] })) : []), [eco, iso2]);
  const fr = useCallback((nom: string) => options.find((o) => o.nom === nom)?.fr ?? nom, [options]);
  const indic = INDICS.find((i) => i.id === indicId) ?? INDICS[0];

  const lit = useCallback<Lit>(
    (i, nom, an) => (i.src === "eco" ? (eco ? valeurSocle(eco, nom, an, i.champ) : null) : demo ? valeurSocle(demo, nom, an, i.champ) : null),
    [eco, demo],
  );

  const anneeMax = Math.max(eco ? eco.annees[eco.annees.length - 1] : 2025, demo ? demo.annees[demo.annees.length - 1] : 0);
  const anneeVue = Math.min(annee, anneeMax);

  /* La lecture automatique : on déroule les années, les barres suivent. */
  useEffect(() => {
    if (!lecture) return;
    const id = window.setInterval(() => {
      setAnnee((a) => {
        if (a >= anneeMax) {
          setLecture(false);
          return anneeMax;
        }
        return a + 1;
      });
    }, 230);
    return () => window.clearInterval(id);
  }, [lecture, anneeMax]);

  const partager = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 1800);
    } catch {}
  };
  const retire = (k: number) => {
    setPays((l) => l.filter((_, i) => i !== k));
    setEpingle(null);
    setFocus(null);
  };
  const actif = epingle ?? focus;

  return (
    <div className="cg cg-eco cg-v2 cmp">
      <EnTete actif="Comparer" />

      <section
        ref={ouverture as React.RefObject<HTMLElement>}
        className="cg-section cg-eco-haut"
        data-vu={haut.vu ? "1" : "0"}
        data-pret={arrive ? "1" : "0"}
      >
        <div className="cg-eco-lueur" aria-hidden="true" />
        <Jetons theme="comparer" />
        <div className="cg-wrap">
          <div className="cg-eco-ouv">
            <span className="cg-sceau" aria-hidden="true">
              <span className="cg-sceau-i">
                <Dessin f="balance" />
              </span>
            </span>
            <h1 className="cg-eco-titre">
              <Titre texte="Comparaison" />
            </h1>
          </div>
        </div>
        <div className="cg-arc" aria-hidden="true">
          <span className="cg-arc-corps" />
          <span className="cg-arc-trait" />
          <span className="cg-arc-nappe" />
          <span className="cg-arc-point" />
        </div>
      </section>
      <div ref={haut.ref as React.RefObject<HTMLDivElement>} className="cg-temoin" aria-hidden="true" />

      <main className="cmp-page">
        {/* ── Les pays, et l'indicateur regardé ─────────────────────────────── */}
        <section className="cmp-barre-haut" aria-label="Pays et indicateur">
          <div className="cmp-pays">
            {pays.map((nom, i) => (
              <div key={`${i}-${nom}`} className={`cmp-pays-c${actif === i ? " cmp-pays-on" : ""}`} style={{ "--c": COULEURS[i] } as React.CSSProperties} onPointerEnter={() => setFocus(i)} onPointerLeave={() => setFocus(null)}>
                <span className="cmp-pays-p" aria-hidden="true" />
                <ChoixPays valeur={nom} options={options} label={`Pays ${i + 1}`} onChange={(v) => setPays((l) => l.map((x, k) => (k === i ? v : x)))} />
                {pays.length > 2 && (
                  <button type="button" className="cmp-x" aria-label={`Retirer ${fr(nom)}`} onClick={() => retire(i)}>
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
            {pays.length < 4 && (
              <button type="button" className="cmp-ajout" onClick={() => setPays((l) => [...l, ["Germany", "Japan", "Brazil", "India"].find((x) => !l.includes(x)) ?? "Japan"])}>
                <Plus size={15} aria-hidden="true" /> Ajouter
              </button>
            )}
          </div>

          <div className="cmp-ligne-outils">
            <div className="cmp-presets">
              <span><Sparkles size={13} aria-hidden="true" /> Idées</span>
              {PRESETS.filter((p) => p.pays.every((n) => options.some((o) => o.nom === n))).map((p) => (
                <button key={p.label} type="button" onClick={() => { setPays(p.pays); setEpingle(null); }}>{p.label}</button>
              ))}
            </div>
            <button type="button" className="cmp-partage" onClick={partager}>
              <Share2 size={14} aria-hidden="true" /> {copie ? "Lien copié" : "Partager"}
            </button>
          </div>

          <div className="cmp-lentille" role="tablist" aria-label="Indicateur comparé">
            {(["Économie", "Démographie"] as const).map((g) => (
              <div key={g} className="cmp-lentille-g">
                <b>{g}</b>
                {INDICS.filter((i) => i.groupe === g).map((i) => (
                  <button key={i.id} type="button" role="tab" aria-selected={indicId === i.id} className={indicId === i.id ? "on" : ""} onClick={() => setIndicId(i.id)}>
                    {i.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        {!eco ? (
          <div className="cmp-attente" aria-label="Chargement des données"><i /><i /></div>
        ) : (
          <>
            {/* ── La scène : barres de l'année + courbe de toutes les années ── */}
            <section className="cmp-scene2" aria-label={`Comparaison : ${indic.label}`}>
              <Barres
                pays={pays}
                indic={indic}
                annee={anneeVue}
                lit={lit}
                fr={fr}
                iso2={iso2}
                eco={eco}
                demo={demo}
                actif={actif}
                epingle={epingle}
                setFocus={setFocus}
                setEpingle={setEpingle}
              />
              <Courbe
                pays={pays}
                indic={indic}
                annee={anneeVue}
                setAnnee={(a) => { setLecture(false); setAnnee(a); }}
                anneeMax={anneeMax}
                lit={lit}
                fr={fr}
                base100={base100}
                setBase100={setBase100}
                log={log}
                setLog={setLog}
                actif={actif}
              />
              <div className="cmp-temps">
                <button type="button" className="cmp-lecture" aria-label={lecture ? "Pause" : "Lire l'évolution année par année"} onClick={() => { if (!lecture && anneeVue >= anneeMax) setAnnee(AN_MIN); setLecture(!lecture); }}>
                  {lecture ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                </button>
                <input type="range" min={AN_MIN} max={anneeMax} value={anneeVue} onChange={(e) => { setLecture(false); setAnnee(Number(e.target.value)); }} aria-label="Année comparée" />
                <strong>{anneeVue}</strong>
              </div>
            </section>

            {/* ── Tous les indicateurs, par catégorie ──────────────────────── */}
            <section className="cmp-tout" aria-label="Tous les indicateurs">
              <header className="cmp-tout-t">
                <h2>Tout en un coup d&apos;œil</h2>
                <p>En {anneeVue}. Cliquez une carte pour la comparer en grand.</p>
              </header>
              {(["Économie", "Démographie"] as const).map((g) => (
                <div key={g} className="cmp-cat">
                  <h3>{g}</h3>
                  <div className="cmp-cartes">
                    {INDICS.filter((i) => i.groupe === g).map((i, k) => {
                      const vals = pays.map((n) => lit(i, n, anneeVue));
                      const pos = vals.filter((v): v is number => v !== null && v > 0);
                      const max = Math.max(1e-9, ...vals.map((v) => (v === null ? 0 : Math.abs(v))));
                      const haut = vals.some((v) => v !== null) ? Math.max(...vals.filter((v): v is number => v !== null)) : null;
                      return (
                        <button
                          key={i.id}
                          type="button"
                          className={`cmp-carte${indicId === i.id ? " cmp-carte-on" : ""}`}
                          style={{ "--k": k } as React.CSSProperties}
                          onClick={() => {
                            setIndicId(i.id);
                            const sc = document.querySelector(".cmp-scene2") as HTMLElement | null;
                            if (sc) window.scrollTo({ top: sc.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
                          }}
                        >
                          <span className="cmp-carte-tete">
                            <span className="cmp-carte-t">{i.label}</span>
                            {pos.length > 1 && <em>×{ratio(Math.max(...pos), Math.min(...pos))} d&apos;écart</em>}
                          </span>
                          <span className="cmp-carte-l">
                            {vals.map((v, j) => (
                              <span key={j} className="cmp-carte-r" style={{ "--c": COULEURS[j], "--l": v === null ? "0%" : `${Math.max(3, (Math.abs(v) / max) * 100)}%` } as React.CSSProperties}>
                                <span className="cmp-carte-n">{drapeau(iso2[pays[j]])} {fr(pays[j])}</span>
                                <span className="cmp-carte-b"><i /></span>
                                <span className="cmp-carte-x">
                                  {v !== null && v === haut && pos.length > 1 && <Crown size={12} aria-hidden="true" />}
                                  {v === null ? "—" : i.fmt(v)}
                                </span>
                              </span>
                            ))}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="cmp-cat cmp-cat-bientot">
                <h3>Ressources <em>bientôt</em></h3>
                <p>Eau, énergie, forêts : de nouveaux indicateurs arrivent ici.</p>
              </div>
            </section>

            {/* ── D'autres lectures ─────────────────────────────────────────── */}
            <section className="cmp-plus" aria-label="D'autres lectures">
              <header className="cmp-tout-t">
                <h2>D&apos;autres lectures</h2>
                <p>Une vue d&apos;ensemble de vos pays sur plusieurs indicateurs à la fois.</p>
              </header>
              <Profil pays={pays} annee={anneeVue} lit={lit} eco={eco} demo={demo} fr={fr} />
            </section>
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

/* ═══════════════════════════════════════════════════════════════════════════
   LES BARRES — l'année choisie
   ═══════════════════════════════════════════════════════════════════════════ */

function Barres({
  pays, indic, annee, lit, fr, iso2, eco, demo, actif, epingle, setFocus, setEpingle,
}: {
  pays: string[];
  indic: Indic;
  annee: number;
  lit: Lit;
  fr: (n: string) => string;
  iso2: Record<string, string>;
  eco: Eco;
  demo: Demo;
  actif: number | null;
  epingle: number | null;
  setFocus: (i: number | null) => void;
  setEpingle: (i: number | null) => void;
}) {
  const vals = pays.map((n) => lit(indic, n, annee));
  const max = Math.max(1e-9, ...vals.map((v) => (v === null ? 0 : Math.abs(v))));
  const present = vals.filter((v): v is number => v !== null);
  const haut = present.length > 1 ? Math.max(...present) : null;

  /* Le rang mondial de chaque pays sur cet indicateur, cette année-là. */
  const rangs = useMemo(() => {
    const s = indic.src === "eco" ? eco : demo;
    const m = new Map<string, { rang: number; total: number }>();
    if (!s) return m;
    const place = (s.cols[annee] ?? {})[indic.champ];
    if (place === undefined) return m;
    const tous = (s.lignes[annee] ?? [])
      .map((l) => ({ nom: s.pays[l[0] as number].nom, v: l[place] }))
      .filter((x): x is { nom: string; v: number } => typeof x.v === "number")
      .sort((a, b) => b.v - a.v);
    tous.forEach((x, i) => m.set(x.nom, { rang: i + 1, total: tous.length }));
    return m;
  }, [indic, eco, demo, annee]);

  const pos = present.filter((v) => v > 0);
  const phrase = useMemo(() => {
    const l = vals.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v !== null && x.v > 0);
    if (l.length < 2) return null;
    l.sort((a, b) => b.v - a.v);
    return { haut: l[0].i, bas: l[l.length - 1].i, r: ratio(l[0].v, l[l.length - 1].v) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vals.join("|")]);

  return (
    <div className="cmp-barres2">
      <header className="cmp-sc-t">
        <h2>{indic.label}</h2>
        <span>en {annee}</span>
        {pos.length > 1 && <em>×{ratio(Math.max(...pos), Math.min(...pos))} d&apos;écart</em>}
      </header>
      {phrase && (
        <p className="cmp-phrase">
          <b style={{ color: COULEURS[phrase.haut] }}>{fr(pays[phrase.haut])}</b> : {indic.nom} est <strong>{phrase.r} fois</strong> celui de{" "}
          <b style={{ color: COULEURS[phrase.bas] }}>{fr(pays[phrase.bas])}</b>.
        </p>
      )}

      <div className="cmp-b2-l">
        {pays.map((n, j) => {
          const v = vals[j];
          const r = rangs.get(n);
          return (
            <button
              key={`${j}-${n}`}
              type="button"
              className={`cmp-b2${actif === j ? " cmp-b2-on" : ""}${actif !== null && actif !== j ? " cmp-b2-pale" : ""}${epingle === j ? " cmp-b2-epingle" : ""}`}
              style={{ "--c": COULEURS[j], "--l": v === null ? "0%" : `${Math.max(3, (Math.abs(v) / max) * 100)}%` } as React.CSSProperties}
              onPointerEnter={() => setFocus(j)}
              onPointerLeave={() => setFocus(null)}
              onFocus={() => setFocus(j)}
              onBlur={() => setFocus(null)}
              onClick={() => setEpingle(epingle === j ? null : j)}
              aria-pressed={epingle === j}
            >
              <span className="cmp-b2-fond" aria-hidden="true" />
              <span className="cmp-b2-nom">
                <span className="cmp-b2-drap">{drapeau(iso2[n])}</span>
                {fr(n)}
                {v !== null && v === haut && <Crown size={14} aria-label="Valeur la plus élevée" />}
              </span>
              <span className="cmp-b2-val">{v === null ? "—" : indic.fmt(v)}</span>
              {epingle === j || actif === j ? (
                <span className="cmp-b2-detail">
                  {r ? `${r.rang}${r.rang === 1 ? "er" : "ᵉ"} sur ${r.total} dans le monde` : "Rang indisponible"}
                  {j > 0 && v !== null && vals[0] !== null && v > 0 && (vals[0] as number) > 0 && ` · ${v >= (vals[0] as number) ? "×" : "÷"}${ratio(v, vals[0] as number)} ${fr(pays[0])}`}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="cmp-astuce">Survolez ou cliquez un pays pour le mettre en avant sur la courbe.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA COURBE — toutes les années
   ═══════════════════════════════════════════════════════════════════════════ */

const W = 760;
const H = 400;
const M = { g: 58, d: 18, h: 18, b: 34 };

function Courbe({
  pays, indic, annee, setAnnee, anneeMax, lit, fr, base100, setBase100, log, setLog, actif,
}: {
  pays: string[];
  indic: Indic;
  annee: number;
  setAnnee: (a: number) => void;
  anneeMax: number;
  lit: Lit;
  fr: (n: string) => string;
  base100: boolean;
  setBase100: (b: boolean) => void;
  log: boolean;
  setLog: (b: boolean) => void;
  actif: number | null;
}) {
  const ans = useMemo(() => Array.from({ length: anneeMax - AN_MIN + 1 }, (_, k) => AN_MIN + k), [anneeMax]);
  const peutLog = !indic.signe;
  const echelleLog = log && peutLog;

  const series = useMemo(
    () =>
      pays.map((n) => {
        const brut = ans.map((an) => lit(indic, n, an));
        const premier = brut.find((v) => v !== null && v !== 0) ?? null;
        return { n, brut, vals: brut.map((v) => (v === null ? null : base100 ? (premier ? (v / premier) * 100 : null) : v)) };
      }),
    [pays, ans, indic, lit, base100],
  );

  const { ticks, y } = useMemo(() => {
    const tous = series.flatMap((s) => s.vals).filter((v): v is number => v !== null && (!echelleLog || v > 0));
    let lo = tous.length ? Math.min(...tous) : 0;
    let hi = tous.length ? Math.max(...tous) : 1;
    if (!echelleLog) lo = Math.min(0, lo);
    if (hi === lo) hi = lo + 1;
    const f = echelleLog
      ? (v: number) => (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))
      : (v: number) => (v - lo) / (hi - lo);
    const t: number[] = [];
    if (echelleLog) {
      for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++) if (10 ** e >= lo * 0.999 && 10 ** e <= hi * 1.001) t.push(10 ** e);
    } else for (let k = 0; k <= 4; k++) t.push(lo + ((hi - lo) * k) / 4);
    return { ticks: t, y: (v: number) => M.h + (1 - Math.max(0, Math.min(1, f(v)))) * (H - M.h - M.b) };
  }, [series, echelleLog]);

  const x = (an: number) => M.g + ((an - AN_MIN) / (anneeMax - AN_MIN)) * (W - M.g - M.d);
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
  const [aide, setAide] = useState(false);
  const zone = useRef<SVGSVGElement>(null);
  const bas = useRef(false);
  const an_de = (e: React.PointerEvent) => {
    const r = zone.current?.getBoundingClientRect();
    if (!r) return null;
    const t = ((e.clientX - r.left) / r.width * W - M.g) / (W - M.g - M.d);
    return Math.max(0, Math.min(ans.length - 1, Math.round(t * (ans.length - 1))));
  };
  const fmtAxe = (v: number) => (base100 ? v.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : indic.fmt(v));
  const cle = `${indic.id}-${base100}-${echelleLog}-${pays.join("|")}`;
  const iAnnee = annee - AN_MIN;

  return (
    <div className="cmp-courbe">
      <header className="cmp-sc-t">
        <h2>Depuis {AN_MIN}</h2>
        <div className="cmp-opts">
          <label className="cmp-bascule" title="Tous les pays partent de 100 : on compare la vitesse de croissance, pas la taille.">
            <input type="checkbox" checked={base100} onChange={(e) => setBase100(e.target.checked)} />
            <span />
            Croissance (base 100)
          </label>
          <label className={`cmp-bascule${peutLog ? "" : " cmp-bascule-off"}`} title="Chaque graduation multiplie par dix : les petits pays restent lisibles.">
            <input type="checkbox" checked={echelleLog} disabled={!peutLog} onChange={(e) => setLog(e.target.checked)} />
            <span />
            Échelle log
          </label>
          <button type="button" className="cmp-aide-b" aria-expanded={aide} aria-label="Aide sur ces options" onClick={() => setAide(!aide)}>
            <HelpCircle size={17} aria-hidden="true" />
          </button>
        </div>
      </header>
      {aide && (
        <div className="cmp-aide2">
          <p><b>Croissance (base 100)</b> : chaque pays part de 100 à la première année. Une courbe à 300 a triplé. On compare la <em>vitesse</em>, pas la taille.</p>
          <p><b>Échelle log</b> : chaque graduation multiplie par dix au lieu d&apos;ajouter. Les petits pays redeviennent lisibles ; une pente raide veut dire une croissance rapide.</p>
        </div>
      )}

      <div className="cmp-svg-c">
        <svg
          ref={zone}
          viewBox={`0 0 ${W} ${H}`}
          className="cmp-svg"
          role="img"
          aria-label={`Évolution : ${indic.label}`}
          onPointerDown={(e) => { bas.current = true; const k = an_de(e); if (k !== null) setAnnee(ans[k]); }}
          onPointerMove={(e) => { const k = an_de(e); setVise(k); if (bas.current && k !== null) setAnnee(ans[k]); }}
          onPointerUp={() => { bas.current = false; }}
          onPointerLeave={() => { setVise(null); bas.current = false; }}
        >
          {ticks.map((t, k) => (
            <g key={k}>
              <line x1={M.g} x2={W - M.d} y1={y(t)} y2={y(t)} className="cmp-grille" />
              <text x={M.g - 8} y={y(t) + 4} textAnchor="end" className="cmp-axe">{fmtAxe(t)}</text>
            </g>
          ))}
          {ans.filter((an) => an % 10 === 0).map((an) => (
            <text key={an} x={x(an)} y={H - 10} textAnchor="middle" className="cmp-axe">{an}</text>
          ))}
          {series.map((s, k) => (
            <path key={`${cle}-${k}`} d={chemin(s.vals)} pathLength={1} className={`cmp-ligne-c${actif !== null && actif !== k ? " cmp-ligne-pale" : ""}${actif === k ? " cmp-ligne-forte" : ""}`} style={{ "--c": COULEURS[k], "--k": k } as React.CSSProperties} />
          ))}
          <line x1={x(annee)} x2={x(annee)} y1={M.h} y2={H - M.b} className="cmp-annee-l" />
          {series.map((s, k) => {
            const v = s.vals[iAnnee];
            return v === null || v === undefined || (echelleLog && v <= 0) ? null : <circle key={k} cx={x(annee)} cy={y(v)} r={actif === k ? 8 : 6} fill={COULEURS[k]} className="cmp-point" />;
          })}
          {vise !== null && vise !== iAnnee && <line x1={x(ans[vise])} x2={x(ans[vise])} y1={M.h} y2={H - M.b} className="cmp-reperes" />}
        </svg>
        {vise !== null && (
          <div className="cmp-info" style={{ left: `${(x(ans[vise]) / W) * 100}%` }} data-droite={x(ans[vise]) > W * 0.6 ? "1" : "0"}>
            <b>{ans[vise]}</b>
            {series.map((s, k) => (
              <span key={k} style={{ "--c": COULEURS[k] } as React.CSSProperties}>
                <i />
                {fr(s.n)}
                <em>{s.brut[vise] === null ? "—" : indic.fmt(s.brut[vise] as number)}</em>
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="cmp-astuce">Cliquez ou glissez sur la courbe pour changer d&apos;année : les barres suivent.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE PROFIL — un radar des rangs, sur tous les indicateurs
   ═══════════════════════════════════════════════════════════════════════════ */

function Profil({ pays, annee, lit, eco, demo, fr }: { pays: string[]; annee: number; lit: Lit; eco: Eco; demo: Demo; fr: (n: string) => string }) {
  const rang = useMemo(
    () => (i: Indic, nom: string): number | null => {
      const s = i.src === "eco" ? eco : demo;
      if (!s) return null;
      const place = (s.cols[annee] ?? {})[i.champ];
      const v = lit(i, nom, annee);
      if (place === undefined || v === null) return null;
      const vals = (s.lignes[annee] ?? []).map((l) => l[place]).filter((x): x is number => typeof x === "number");
      return vals.length < 2 ? null : vals.filter((x) => x < v).length / (vals.length - 1);
    },
    [eco, demo, annee, lit],
  );
  const axes = useMemo(
    () => INDICS.filter((i) => ["gdp", "gdp_per_capita", "population", "inflation", "unemployment", "birth_rate", "death_rate"].includes(i.id)).filter((i) => pays.some((n) => rang(i, n) !== null)),
    [pays, rang],
  );
  const C = 230;
  const R = 150;
  const pt = (k: number, v: number) => {
    const ang = -Math.PI / 2 + (k / Math.max(1, axes.length)) * Math.PI * 2;
    return [C + Math.cos(ang) * R * v, C + Math.sin(ang) * R * v] as const;
  };
  if (axes.length < 3) return null;
  return (
    <div className="cmp-radar-c cmp-radar-large">
      <div className="cmp-radar-t">
        <h3>Profil</h3>
        <p>Plus un point est loin du centre, plus le pays dépasse de pays sur cet indicateur.</p>
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
      <svg viewBox="-70 -10 600 480" className="cmp-radar" role="img" aria-label="Profil comparé">
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <polygon key={r} points={axes.map((_, k) => pt(k, r).join(",")).join(" ")} className="cmp-toile" />
        ))}
        {axes.map((a, k) => {
          const [px, py] = pt(k, 1);
          const [lx, ly] = pt(k, 1.17);
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
            <g key={`${j}-${n}`} style={{ "--c": COULEURS[j], "--k": j } as React.CSSProperties}>
              <polygon points={pts.map((p) => p.join(",")).join(" ")} className="cmp-radar-p" />
              {pts.map((p, k) => (
                <circle key={k} cx={p[0]} cy={p[1]} r={4} className="cmp-radar-pt" />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
