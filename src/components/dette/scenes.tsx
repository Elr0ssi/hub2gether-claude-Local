"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ADMINISTRATIONS,
  COMPARAISON,
  DETENTEURS,
  REPERES,
  SOURCE_COMPARAISON,
  SOURCE_SERIE,
  serieMontant,
  serieRatio,
} from "@/data/articles/detteFrancaise";
import { Donnees, Leve, useVu } from "./pieces";

/* ═══════════════════════════════════════════════════════════════════════════
   LES SCÈNES

   Chaque scène termine une phrase du texte : elle n'illustre pas, elle
   démontre. Tout est en SVG ou en CSS — aucune bibliothèque de graphiques
   n'est ajoutée pour tracer une courbe de quelques points.
   ═══════════════════════════════════════════════════════════════════════════ */

const nb = (v: number, d = 0) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

/* ── La courbe d'évolution ─────────────────────────────────────────────── */

export function Courbe() {
  const [mode, setMode] = useState<"pct" | "md">("pct");
  const { ref, vu } = useVu<HTMLDivElement>(80);
  const [survol, setSurvol] = useState<number | null>(null);
  const cadre = useRef<HTMLDivElement>(null);

  const points = useMemo(() => {
    const ratio = serieRatio().filter((p) => p.pctPib !== null);
    const montant = new Map(serieMontant().map((m) => [m.annee, m.md]));
    return ratio.map((p) => ({ annee: p.annee, pct: p.pctPib as number, md: montant.get(p.annee) ?? null }));
  }, []);

  const trace = useMemo(() => {
    const vals = points
      .map((p) => (mode === "pct" ? p.pct : p.md))
      .filter((v): v is number => v !== null);
    if (vals.length < 2) return null;
    const bas = Math.min(...vals);
    const haut = Math.max(...vals);
    const ampl = haut - bas || 1;
    const a0 = points[0].annee;
    const a1 = points[points.length - 1].annee;
    const x = (a: number) => ((a - a0) / (a1 - a0 || 1)) * 100;
    const y = (v: number) => 46 - ((v - bas) / ampl) * 40;
    const m = points
      .filter((p) => (mode === "pct" ? p.pct : p.md) !== null)
      .map((p) => ({ ...p, x: x(p.annee), y: y((mode === "pct" ? p.pct : (p.md as number))) }));
    return {
      m,
      d: m.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" "),
      aire: `M ${m[0].x.toFixed(2)} 50 ` + m.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ") + ` L ${m[m.length - 1].x.toFixed(2)} 50 Z`,
      x,
      a0,
      a1,
    };
  }, [points, mode]);

  const vise = useCallback(
    (clientX: number) => {
      const el = cadre.current;
      if (!el || !trace) return;
      const r = el.getBoundingClientRect();
      const t = Math.max(0, Math.min(100, ((clientX - r.left) / (r.width || 1)) * 100));
      let best = 0;
      let d = Infinity;
      trace.m.forEach((p, i) => {
        const e = Math.abs(p.x - t);
        if (e < d) {
          d = e;
          best = i;
        }
      });
      setSurvol(best);
    },
    [trace],
  );

  const lu = survol !== null && trace ? trace.m[survol] : null;

  return (
    <figure className="dp-fig" ref={ref} data-vu={vu ? "1" : "0"}>
      <figcaption className="dp-fig-t">
        <span>Évolution de la dette publique française</span>
        <span className="dp-bascule" role="group" aria-label="Unité affichée">
          <button type="button" aria-pressed={mode === "md"} onClick={() => setMode("md")}>
            Md€
          </button>
          <button type="button" aria-pressed={mode === "pct"} onClick={() => setMode("pct")}>
            % du PIB
          </button>
        </span>
      </figcaption>

      {trace ? (
        <>
          <p className="dp-fig-lu" aria-live="polite">
            {lu ? (
              <>
                <b>{lu.annee}</b>
                <span>{lu.md !== null ? `${nb(lu.md)} Md€` : "montant non publié"}</span>
                <span>{nb(lu.pct, 1)} % du PIB</span>
              </>
            ) : (
              <span className="dp-fig-aide">
                Passez le doigt ou le curseur sur la courbe pour lire une date.
              </span>
            )}
          </p>

          <div
            ref={cadre}
            className="dp-courbe"
            onPointerMove={(e) => vise(e.clientX)}
            onPointerLeave={() => setSurvol(null)}
          >
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" role="img" aria-label="Courbe de la dette publique française">
              <defs>
                <linearGradient id="dp-aire" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(90,165,240,0.28)" />
                  <stop offset="100%" stopColor="rgba(90,165,240,0)" />
                </linearGradient>
              </defs>
              <path className="dp-courbe-a" d={trace.aire} fill="url(#dp-aire)" />
              <path className="dp-courbe-l" d={trace.d} fill="none" stroke="#7cc0ff" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
              {REPERES.filter((r) => r.annee >= trace.a0 && r.annee <= trace.a1).map((r) => (
                <line key={r.annee} x1={trace.x(r.annee)} y1="0" x2={trace.x(r.annee)} y2="50" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
              ))}
              {lu && (
                <>
                  <line x1={lu.x} y1="0" x2={lu.x} y2="50" stroke="rgba(124,192,255,0.6)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  <circle cx={lu.x} cy={lu.y} r="2" fill="#fff" vectorEffect="non-scaling-stroke" />
                </>
              )}
            </svg>
            <div className="dp-courbe-r" aria-hidden="true">
              {/* Les repères proches se marchaient dessus : un rang sur deux
                  descend d'une ligne. */}
              {REPERES.filter((r) => r.annee >= trace.a0 && r.annee <= trace.a1).map((r, i) => (
                <span
                  key={r.annee}
                  style={{ left: `${trace.x(r.annee)}%`, top: `${(i % 2) * 26}px` }}
                >
                  <b>{r.annee}</b>
                  {r.nom}
                </span>
              ))}
            </div>
            <div className="dp-courbe-x" aria-hidden="true">
              <span>{trace.a0}</span>
              <span>{trace.a1}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="dp-vide">Moins de deux dates publiées pour cet indicateur.</p>
      )}

      <Donnees
        titre="Dette publique française, telle que la base l'enregistre"
        colonnes={["Date", "Dette (Md€)", "Dette / PIB (%)"]}
        lignes={points.map((p) => [p.annee, p.md !== null ? nb(p.md) : "n.d.", nb(p.pct, 1)])}
      />
      <p className="dp-fig-s">
        Sources : {SOURCE_SERIE.ratio} pour le ratio ; {SOURCE_SERIE.pib}{" "}
        pour le PIB. Le montant en
        euros est reconstitué à partir de ces deux séries, il n&apos;est pas mesuré directement.
      </p>
    </figure>
  );
}

/* ── Recettes, dépenses, déficit ───────────────────────────────────────── */

const RECETTES = ["Impôts", "Cotisations", "Taxes", "Autres recettes"];
const DEPENSES = [
  "Retraites",
  "Santé",
  "Éducation",
  "Défense",
  "Collectivités",
  "Prestations sociales",
  "Fonctionnement",
  "Investissements",
  "Intérêts de la dette",
];

export function Balance() {
  const { ref, vu } = useVu<HTMLDivElement>(100);
  return (
    <div className="dp-balance" ref={ref} data-vu={vu ? "1" : "0"}>
      <div className="dp-balance-c">
        <h3>Recettes publiques</h3>
        <ul>
          {RECETTES.map((r, i) => (
            <li key={r} style={{ "--i": i } as React.CSSProperties}>
              {r}
            </li>
          ))}
        </ul>
      </div>
      <div className="dp-balance-m" aria-hidden="true">
        <span className="dp-balance-s">Recettes &lt; Dépenses</span>
        <span className="dp-balance-d">Déficit</span>
      </div>
      <div className="dp-balance-c">
        <h3>Dépenses publiques</h3>
        <ul>
          {DEPENSES.map((d, i) => (
            <li key={d} style={{ "--i": i } as React.CSSProperties}>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Cascade() {
  const { ref, vu } = useVu<HTMLOListElement>(100);
  const pas = [
    { v: "100 €", l: "encaissés" },
    { v: "105 €", l: "dépensés" },
    { v: "5 €", l: "manquants", fort: true },
    { v: "Financement", l: "à trouver", fort: true },
  ];
  return (
    <ol className="dp-cascade" ref={ref} data-vu={vu ? "1" : "0"}>
      {pas.map((p, i) => (
        <li key={p.v} style={{ "--i": i } as React.CSSProperties} className={p.fort ? "dp-cascade-f" : undefined}>
          <b>{p.v}</b>
          <span>{p.l}</span>
        </li>
      ))}
    </ol>
  );
}

/* ── Les quatre administrations ────────────────────────────────────────── */

export function Administrations() {
  const [ouvert, setOuvert] = useState(0);
  return (
    <div className="dp-admin">
      <div className="dp-admin-l" role="tablist" aria-label="Administrations publiques">
        {ADMINISTRATIONS.map((a, i) => (
          <button
            key={a.nom}
            type="button"
            role="tab"
            aria-selected={ouvert === i}
            aria-controls={`admin-${i}`}
            className={ouvert === i ? "dp-admin-on" : undefined}
            onClick={() => setOuvert(i)}
          >
            {a.court}
          </button>
        ))}
      </div>
      {/* Les quatre explications sont dans le HTML : celle qui n'est pas
          ouverte est masquée visuellement, jamais retirée du document. */}
      {ADMINISTRATIONS.map((a, i) => (
        <div key={a.nom} id={`admin-${i}`} role="tabpanel" className="dp-admin-r" hidden={ouvert !== i}>
          <h3>{a.nom}</h3>
          <p>{a.texte}</p>
        </div>
      ))}
    </div>
  );
}

/* ── La consolidation ──────────────────────────────────────────────────── */

export function Consolidation() {
  const [neutralise, setNeutralise] = useState(false);
  return (
    <div className={`dp-conso${neutralise ? " dp-conso-on" : ""}`}>
      <div className="dp-conso-s">
        <span className="dp-conso-b">A</span>
        <span className="dp-conso-f" aria-hidden="true">
          <span className="dp-conso-m">10</span>
        </span>
        <span className="dp-conso-b">B</span>
      </div>
      <p className="dp-conso-t">
        {neutralise
          ? "A et B appartiennent toutes deux au périmètre public : cette dette interne est neutralisée, elle ne compte pas dans la dette de Maastricht."
          : "L'administration A doit 10 à l'administration B."}
      </p>
      <button type="button" className="dp-bouton" onClick={() => setNeutralise((n) => !n)}>
        {neutralise ? "Revenir avant consolidation" : "Consolider"}
      </button>
    </div>
  );
}

/* ── Les détenteurs ────────────────────────────────────────────────────── */

export function Detenteurs() {
  const rail = useRef<HTMLDivElement>(null);
  const prise = useRef<{ x: number; g: number } | null>(null);
  return (
    <div
      ref={rail}
      className="dp-rail"
      onPointerDown={(e) => {
        prise.current = { x: e.clientX, g: e.currentTarget.scrollLeft };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!prise.current || !rail.current) return;
        rail.current.scrollLeft = prise.current.g - (e.clientX - prise.current.x);
      }}
      onPointerUp={() => (prise.current = null)}
      onPointerCancel={() => (prise.current = null)}
    >
      {DETENTEURS.map((d) => (
        <article key={d.nom} className="dp-det">
          <h3>{d.nom}</h3>
          <p>{d.texte}</p>
        </article>
      ))}
    </div>
  );
}

/* ── Le refinancement dans le temps ────────────────────────────────────── */

export function Echeances() {
  const { ref, vu } = useVu<HTMLDivElement>(100);
  const ans = [2026, 2027, 2028, 2030, 2035, 2040, 2050];
  return (
    <div className="dp-ech" ref={ref} data-vu={vu ? "1" : "0"}>
      <div className="dp-ech-l" aria-hidden="true" />
      <ol>
        {ans.map((a, i) => (
          <li key={a} style={{ "--i": i } as React.CSSProperties}>
            <span className="dp-ech-p" />
            <b>{a}</b>
            <span className="dp-ech-o">Titre à échéance</span>
          </li>
        ))}
      </ol>
      <p className="dp-ech-n">
        Chaque obligation possède sa propre échéance. Il n&apos;existe pas de date unique à laquelle
        la totalité de la dette serait exigible.
      </p>
    </div>
  );
}

/* ── Le besoin de financement ──────────────────────────────────────────── */

export function Tuyaux() {
  const { ref, vu } = useVu<HTMLDivElement>(100);
  return (
    <div className="dp-tuyaux" ref={ref} data-vu={vu ? "1" : "0"}>
      <ul className="dp-tuyaux-h">
        {["Déficit à financer", "Titres à rembourser", "Autres besoins de trésorerie"].map((t, i) => (
          <li key={t} style={{ "--i": i } as React.CSSProperties}>
            {t}
          </li>
        ))}
      </ul>
      <span className="dp-tuyaux-f" aria-hidden="true" />
      <p className="dp-tuyaux-b">Besoin de financement</p>
      <span className="dp-tuyaux-f" aria-hidden="true" />
      <p className="dp-tuyaux-e">Émissions de titres</p>
    </div>
  );
}

/* ── La comparaison européenne ─────────────────────────────────────────── */

export function Comparaison() {
  const { ref, vu } = useVu<HTMLDivElement>(90);
  const max = Math.max(...COMPARAISON.map((c) => c.pct));
  return (
    <figure className="dp-fig">
      <div className="dp-comp" ref={ref} data-vu={vu ? "1" : "0"}>
        {COMPARAISON.map((c, i) => (
          <div
            key={c.nom}
            className={`dp-comp-l${c.france ? " dp-comp-fr" : ""}${c.agregat ? " dp-comp-ag" : ""}`}
            style={{ "--i": i, "--p": `${(c.pct / max) * 100}%` } as React.CSSProperties}
          >
            <span className="dp-comp-n">{c.nom}</span>
            <span className="dp-comp-b" aria-hidden="true" />
            <span className="dp-comp-v">{nb(c.pct, 1)} %</span>
          </div>
        ))}
      </div>
      <Donnees
        titre={`Dette publique rapportée au PIB, ${SOURCE_COMPARAISON.periode}`}
        colonnes={["Pays ou zone", "Dette / PIB (%)"]}
        lignes={COMPARAISON.map((c) => [c.nom, nb(c.pct, 1)])}
      />
      <p className="dp-fig-s">
        <a href={SOURCE_COMPARAISON.url} target="_blank" rel="noopener noreferrer">
          Source : {SOURCE_COMPARAISON.source} ↗
        </a>
      </p>
    </figure>
  );
}

/* ── Le contrôle de compréhension ──────────────────────────────────────── */

const QUIZ = [
  { q: "La dette et le déficit sont-ils la même chose ?", r: false, e: "Le déficit est un écart annuel entre recettes et dépenses. La dette est le stock accumulé." },
  { q: "La France doit-elle rembourser 3 536 Md€ à une date unique ?", r: false, e: "Les titres arrivent à échéance à des dates échelonnées, de quelques mois à plusieurs décennies." },
  { q: "Une hausse des taux augmente-t-elle instantanément le coût de toute la dette ?", r: false, e: "Les titres déjà émis gardent leurs conditions. L'effet se diffuse au fil des refinancements." },
  { q: "Toute la dette française est-elle détenue à l'étranger ?", r: false, e: "Au 31 mars 2026, les non-résidents détenaient 55,9 % des titres de dette de long terme des administrations publiques." },
];

export function Quiz() {
  const [rep, setRep] = useState<(boolean | null)[]>(() => QUIZ.map(() => null));
  const justes = rep.filter((r, i) => r !== null && r === QUIZ[i].r).length;
  const toutes = rep.every((r) => r !== null);
  return (
    <div className="dp-quiz">
      <ol>
        {QUIZ.map((q, i) => (
          <li key={q.q}>
            <p className="dp-quiz-q">{q.q}</p>
            <div className="dp-quiz-b">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={rep[i] === v}
                  className={
                    rep[i] === null ? undefined : rep[i] === v ? (v === q.r ? "dp-juste" : "dp-faux") : undefined
                  }
                  onClick={() => setRep((l) => l.map((x, k) => (k === i ? v : x)))}
                >
                  {v ? "Oui" : "Non"}
                </button>
              ))}
            </div>
            {rep[i] !== null && <p className="dp-quiz-e">{q.e}</p>}
          </li>
        ))}
      </ol>
      {toutes && (
        <p className="dp-quiz-r">
          {justes === QUIZ.length
            ? "4/4 — vous avez compris l'essentiel."
            : `${justes}/4 — les explications ci-dessus reprennent chaque point.`}
        </p>
      )}
    </div>
  );
}

export { Leve };
