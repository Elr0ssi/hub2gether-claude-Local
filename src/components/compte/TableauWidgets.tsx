"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Globe2, GripVertical, Maximize2, Plus, X } from "lucide-react";
import { Odometre } from "@/components/concept/Roulement";
import { CADENCES_EXEMPLE, POPULATION_PAR_AN } from "@/data/concept/tempsReel";
import { majWidgets } from "@/app/compte/actions";

const GlobePoints = dynamic(() => import("@/components/globe/InteractiveGlobeIcons"), {
  ssr: false,
  loading: () => <div className="es-globe-attente" aria-hidden="true" />,
});

const AN = 365.2425 * 24 * 3600;
const CLE = "visualize-tableau-v2";

export interface PaysCompare {
  nom: string;
  fr: string;
  pib: number | null;
  pibHab: number | null;
  population: number | null;
  dette: number | null;
  inflation: number | null;
  lat: number | null;
  lon: number | null;
}

interface Item {
  id: string;
  /** Largeur sur 6 colonnes : 2 (petit), 3 (moyen), 6 (large). */
  t: 2 | 3 | 6;
}

const TAILLES: Item["t"][] = [2, 3, 6];
const NOM_TAILLE: Record<number, string> = { 2: "Petit", 3: "Moyen", 6: "Large" };

const INDIC = [
  { id: "pib", label: "PIB", f: (v: number) => (v >= 1000 ? `${(v / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} T$` : `${Math.round(v)} Md$`) },
  { id: "pibHab", label: "PIB / habitant", f: (v: number) => `${Math.round(v).toLocaleString("fr-FR")} $` },
  { id: "population", label: "Population", f: (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: v >= 100 ? 0 : 1 })} M` },
  { id: "dette", label: "Dette / PIB", f: (v: number) => `${Math.round(v)} %` },
  { id: "inflation", label: "Inflation", f: (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %` },
] as const;
type IndicId = (typeof INDIC)[number]["id"];

/* ── Le globe du tableau de bord ─────────────────────────────────────────── */

function GlobeWidget({ pays }: { pays: PaysCompare[] }) {
  const avecCentre = useMemo(() => pays.filter((p) => p.lat !== null && p.lon !== null), [pays]);
  const [indic, setIndic] = useState<IndicId>("pib");
  const [noms, setNoms] = useState<string[]>(["France", "États-Unis", "Chine", "Inde", "Brésil"]);
  const [sombre, setSombre] = useState(true);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("visualize-globe-perso") ?? "null");
      if (s?.indic) setIndic(s.indic);
      if (Array.isArray(s?.noms)) setNoms(s.noms);
    } catch {}
    const lit = () => setSombre(document.documentElement.getAttribute("data-concept") !== "clair");
    lit();
    const o = new MutationObserver(lit);
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-concept"] });
    return () => o.disconnect();
  }, []);
  const garde = (i: IndicId, n: string[]) => {
    try {
      localStorage.setItem("visualize-globe-perso", JSON.stringify({ indic: i, noms: n }));
    } catch {}
  };

  const spec = INDIC.find((i) => i.id === indic) ?? INDIC[0];
  const marqueurs = useMemo(
    () =>
      noms
        .map((n) => avecCentre.find((p) => p.fr === n))
        .filter((p): p is PaysCompare => Boolean(p))
        .map((p) => {
          const v = p[indic];
          return { id: p.nom, lat: p.lat as number, lon: p.lon as number, icon: Globe2, texte: { chiffre: v === null ? "—" : spec.f(v), label: p.fr } };
        }),
    [noms, avecCentre, indic, spec],
  );
  const dispo = avecCentre.filter((p) => !noms.includes(p.fr));

  return (
    <div className="es-gw">
      <div className="es-gw-ctrl">
        <div className="es-gw-indic" role="tablist" aria-label="Indicateur affiché">
          {INDIC.map((i) => (
            <button key={i.id} type="button" role="tab" aria-selected={indic === i.id} className={indic === i.id ? "on" : ""} onClick={() => { setIndic(i.id); garde(i.id, noms); }}>
              {i.label}
            </button>
          ))}
        </div>
        <div className="es-gw-pays">
          {noms.map((n) => (
            <span key={n} className="es-puce">
              {n}
              <button type="button" aria-label={`Retirer ${n}`} onClick={() => { const x = noms.filter((y) => y !== n); setNoms(x); garde(indic, x); }}>
                <X size={12} aria-hidden="true" />
              </button>
            </span>
          ))}
          {noms.length < 8 && (
            <select
              value=""
              aria-label="Ajouter un pays"
              onChange={(e) => { if (e.target.value) { const x = [...noms, e.target.value]; setNoms(x); garde(indic, x); } }}
            >
              <option value="">+ Ajouter un pays</option>
              {dispo.map((p) => (
                <option key={p.nom} value={p.fr}>{p.fr}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="es-gw-zone">
        <GlobePoints
          markers={marqueurs}
          accent="#8b5cff"
          sphereColor={sombre ? "#15102c" : "#e9e3fb"}
          badgeBackground={sombre ? "rgba(22,17,44,0.82)" : "rgba(255,255,255,0.9)"}
          badgeShadow={sombre ? "0 12px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(165,131,255,0.35)" : "0 12px 28px rgba(60,30,140,0.22), 0 0 0 1px rgba(91,45,224,0.18)"}
          iconColor={sombre ? "#cdbcff" : "#5b2de0"}
          markerSize="clamp(26px, 3vw, 34px)"
        />
      </div>
    </div>
  );
}

/* ── Le comparateur ──────────────────────────────────────────────────────── */

function Comparateur({ pays }: { pays: PaysCompare[] }) {
  const [noms, setNoms] = useState<string[]>(["France", "États-Unis", "Chine"]);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("visualize-compare") ?? "null");
      if (Array.isArray(s) && s.length === 3) setNoms(s);
    } catch {}
  }, []);
  const change = (i: number, v: string) => {
    const n = noms.map((x, k) => (k === i ? v : x));
    setNoms(n);
    try {
      localStorage.setItem("visualize-compare", JSON.stringify(n));
    } catch {}
  };
  const choisis = noms.map((n) => pays.find((p) => p.fr === n));
  return (
    <div>
      <div className="es-choix">
        {noms.map((n, i) => (
          <select key={i} value={n} onChange={(e) => change(i, e.target.value)} aria-label={`Pays ${i + 1}`}>
            {pays.map((p) => (
              <option key={p.nom} value={p.fr}>{p.fr}</option>
            ))}
          </select>
        ))}
      </div>
      <div className="es-barres">
        {INDIC.slice(0, 3).map((ind) => {
          const vals = choisis.map((p) => (p ? p[ind.id] : null));
          const max = Math.max(1, ...vals.map((v) => v ?? 0));
          return (
            <div key={ind.id} className="es-ligne">
              <span className="es-ligne-t">{ind.label}</span>
              {vals.map((v, i) => (
                <div key={i} className="es-barre" style={{ "--c": i } as React.CSSProperties}>
                  <i style={{ width: v ? `${Math.max(4, (v / max) * 100)}%` : "0%" }} />
                  <b>{noms[i]}</b>
                  <em>{v ? ind.f(v) : "—"}</em>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Le tableau ──────────────────────────────────────────────────────────── */

interface Compteur {
  id: string;
  label: string;
  parSeconde: number;
  base: number;
  dec: number;
  unite: string;
  exemple?: boolean;
}

export function TableauWidgets({
  widgetsInitial,
  sommePib,
  sommePopulation,
  pays,
}: {
  widgetsInitial: string[];
  sommePib: number;
  sommePopulation: number;
  pays: PaysCompare[];
}) {
  const depart = useMemo(() => {
    const t = new Date(new Date().getFullYear(), 0, 1).getTime();
    return performance.now() - (Date.now() - t);
  }, []);

  const compteurs = useMemo<Compteur[]>(() => {
    const l: Compteur[] = [
      { id: "pib", label: "PIB mondial", base: 0, parSeconde: sommePib / AN, dec: 3, unite: " Md $" },
      { id: "population", label: "Population mondiale", base: sommePopulation * 1e6, parSeconde: POPULATION_PAR_AN / AN, dec: 0, unite: "" },
    ];
    for (const c of CADENCES_EXEMPLE) l.push({ id: c.id, label: c.label, base: 0, parSeconde: c.parAn / AN, dec: c.dec, unite: c.unite, exemple: true });
    return l;
  }, [sommePib, sommePopulation]);

  const NOMS: Record<string, string> = useMemo(
    () => ({ ...Object.fromEntries(compteurs.map((c) => [c.id, c.label])), globe: "Mon globe", comparateur: "Comparer des pays" }),
    [compteurs],
  );

  const defaut = useMemo<Item[]>(() => {
    const c = (widgetsInitial.length ? widgetsInitial : ["pib", "population"]).filter((id) => compteurs.some((x) => x.id === id));
    return [
      ...c.map((id) => ({ id, t: 3 as const })),
      { id: "globe", t: 6 as const },
      { id: "comparateur", t: 6 as const },
    ];
  }, [widgetsInitial, compteurs]);

  const [items, setItems] = useState<Item[]>(defaut);
  const pret = useRef(false);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(CLE) ?? "null") as Item[] | null;
      if (Array.isArray(s) && s.every((x) => x.id in NOMS && TAILLES.includes(x.t))) setItems(s);
    } catch {}
    pret.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Chaque changement est gardé ici, et les compteurs choisis (quatre au plus)
     rejoignent le profil pour suivre d'un appareil à l'autre. */
  const maj = (suite: Item[]) => {
    setItems(suite);
    try {
      localStorage.setItem(CLE, JSON.stringify(suite));
    } catch {}
    const f = new FormData();
    suite.filter((x) => compteurs.some((c) => c.id === x.id)).slice(0, 4).forEach((x) => f.append("widget", x.id));
    startTransition(() => {
      void majWidgets({}, f);
    });
  };

  const [glisse, setGlisse] = useState<string | null>(null);
  const [survol, setSurvol] = useState<string | null>(null);
  const deplace = (de: string, vers: string) => {
    if (de === vers) return;
    const l = [...items];
    const i = l.findIndex((x) => x.id === de);
    const j = l.findIndex((x) => x.id === vers);
    if (i < 0 || j < 0) return;
    const [x] = l.splice(i, 1);
    l.splice(j, 0, x);
    maj(l);
  };
  const retirables = Object.keys(NOMS).filter((id) => !items.some((x) => x.id === id));

  return (
    <div className="es-wb">
      <div className="es-wb-grille">
        {items.map((it) => {
          const c = compteurs.find((x) => x.id === it.id);
          return (
            <article
              key={it.id}
              className={`es-w es-w-${it.t}${glisse === it.id ? " es-w-glisse" : ""}${survol === it.id && glisse !== it.id ? " es-w-cible" : ""}`}
              draggable
              onDragStart={(e) => { setGlisse(it.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", it.id); }}
              onDragOver={(e) => { e.preventDefault(); setSurvol(it.id); }}
              onDragLeave={() => setSurvol((s) => (s === it.id ? null : s))}
              onDrop={(e) => { e.preventDefault(); if (glisse) deplace(glisse, it.id); setGlisse(null); setSurvol(null); }}
              onDragEnd={() => { setGlisse(null); setSurvol(null); }}
            >
              <header className="es-w-t">
                <span className="es-w-poignee" aria-hidden="true"><GripVertical size={16} /></span>
                <h4>{NOMS[it.id]}</h4>
                {c?.exemple && <span className="es-w-ex">exemple</span>}
                <button type="button" className="es-w-b" title={`Taille : ${NOM_TAILLE[it.t]}`} aria-label={`Changer la taille (${NOM_TAILLE[it.t]})`} onClick={() => maj(items.map((x) => (x.id === it.id ? { ...x, t: TAILLES[(TAILLES.indexOf(x.t) + 1) % TAILLES.length] } : x)))}>
                  <Maximize2 size={14} aria-hidden="true" />
                </button>
                <button type="button" className="es-w-b" aria-label={`Retirer ${NOMS[it.id]}`} onClick={() => maj(items.filter((x) => x.id !== it.id))}>
                  <X size={15} aria-hidden="true" />
                </button>
              </header>
              <div className="es-w-c" draggable={false} onDragStart={(e) => e.stopPropagation()}>
                {c && (
                  <div className="es-w-cpt">
                    <Odometre className="es-w-v" valeur={c.base} parSeconde={c.parSeconde} depuis={depart} dec={c.dec} unite={c.unite} />
                    <p>Depuis le 1<sup>er</sup> janvier</p>
                  </div>
                )}
                {it.id === "globe" && <GlobeWidget pays={pays} />}
                {it.id === "comparateur" && <Comparateur pays={pays} />}
              </div>
            </article>
          );
        })}
      </div>

      {retirables.length > 0 && (
        <div className="es-wb-ajout">
          <span><Plus size={14} aria-hidden="true" /> Ajouter un widget</span>
          {retirables.map((id) => (
            <button key={id} type="button" onClick={() => maj([...items, { id, t: id === "globe" || id === "comparateur" ? 6 : 3 }])}>
              {NOMS[id]}
            </button>
          ))}
        </div>
      )}
      <p className="es-wb-aide">Glissez un widget par sa poignée pour le déplacer, changez sa taille avec le bouton ⤢. Votre disposition est gardée sur cet appareil.</p>
    </div>
  );
}
