"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { GripVertical, Plus, Settings2, X, Check } from "lucide-react";
import { Odometre } from "@/components/concept/Roulement";
import { CADENCES_EXEMPLE, POPULATION_PAR_AN } from "@/data/concept/tempsReel";
import { majWidgets } from "@/app/compte/actions";
import { ChoixPays } from "@/components/concept/ChoixPays";
import { useSocleDemo, useSocleEco, valeurSocle } from "./socles";

const GlobePerso = dynamic(() => import("./GlobePerso").then((m) => m.GlobePerso), {
  ssr: false,
  loading: () => <div className="es-globe-attente" aria-hidden="true" />,
});

const AN = 365.2425 * 24 * 3600;
const CLE = "visualize-tableau-v4";

export interface PaysCompare {
  nom: string;
  fr: string;
}

type Taille = 2 | 3 | 6;
type Texte = "s" | "m" | "l";
interface Item {
  id: string;
  /** Largeur sur 6 colonnes : 2 (petit), 3 (moyen), 6 (large). */
  t: Taille;
  /** Taille du texte d'un compteur. */
  x?: Texte;
}
const TAILLES: Taille[] = [2, 3, 6];
const NOM_TAILLE: Record<number, string> = { 2: "Petit", 3: "Moyen", 6: "Large" };
const TEXTES: Texte[] = ["s", "m", "l"];

/* ── Le comparateur ──────────────────────────────────────────────────────── */

const INDICS = [
  { id: "gdp", src: "eco", label: "PIB", f: (v: number) => (v >= 1000 ? `${(v / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} T$` : `${Math.round(v)} Md$`) },
  { id: "gdp_per_capita", src: "eco", label: "PIB par habitant", f: (v: number) => `${Math.round(v).toLocaleString("fr-FR")} $` },
  { id: "population", src: "demo", label: "Population", f: (v: number) => (v >= 1e6 ? `${(v / 1e6).toLocaleString("fr-FR", { maximumFractionDigits: v >= 1e8 ? 0 : 1 })} M` : `${Math.round(v).toLocaleString("fr-FR")}`) },
  { id: "debt_ratio", src: "eco", label: "Dette / PIB", f: (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %` },
  { id: "inflation", src: "eco", label: "Inflation", f: (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %` },
  { id: "unemployment", src: "eco", label: "Chômage", f: (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %` },
  { id: "birth_rate", src: "demo", label: "Natalité", f: (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} pour 1 000` },
] as const;

interface ConfigCompare {
  noms: string[];
  indics: string[];
  annee: number | null;
}
const CONFIG_DEFAUT: ConfigCompare = { noms: ["France", "United States of America", "China"], indics: ["gdp", "gdp_per_capita", "population"], annee: null };

function multiplicateur(v: number, ref: number): string | null {
  if (!ref || !v) return null;
  const r = v >= ref ? v / ref : ref / v;
  const t = r.toLocaleString("fr-FR", { maximumFractionDigits: r >= 10 ? 0 : 1 });
  return v >= ref ? `${t}× plus` : `${t}× moins`;
}

function Comparateur({ edition, iso2 }: { edition: boolean; iso2: Record<string, string> }) {
  const eco = useSocleEco();
  const demo = useSocleDemo();
  const [cfg, setCfg] = useState<ConfigCompare>(CONFIG_DEFAUT);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("visualize-compare-v2") ?? "null") as ConfigCompare | null;
      if (s && Array.isArray(s.noms) && Array.isArray(s.indics)) setCfg(s);
    } catch {}
  }, []);
  const maj = (c: ConfigCompare) => {
    setCfg(c);
    try {
      localStorage.setItem("visualize-compare-v2", JSON.stringify(c));
    } catch {}
  };

  if (!eco) return <div className="es-globe-attente" aria-label="Chargement" />;
  const derniere = eco.annees[eco.annees.length - 1];
  const annee = cfg.annee ?? derniere;
  const fr = (nom: string) => eco.pays.find((p) => p.nom === nom)?.fr ?? nom;
  const lit = (src: "eco" | "demo", nom: string, champ: string): number | null => {
    if (src === "eco") return valeurSocle(eco, nom, annee, champ);
    return demo && demo.annees.includes(annee) ? valeurSocle(demo, nom, annee, champ) : null;
  };
  const actives = INDICS.filter((i) => cfg.indics.includes(i.id));

  return (
    <div className="es-cp">
      {edition && (
        <div className="es-cp-ctrl">
          <div className="es-cp-ligne">
            <span>Pays</span>
            {cfg.noms.map((n, i) => (
              <ChoixPays key={i} compact label={`Pays ${i + 1}`} valeur={n} options={eco.pays.map((p) => ({ nom: p.nom, fr: p.fr, iso2: iso2[p.nom] }))} onChange={(v) => maj({ ...cfg, noms: cfg.noms.map((x, k) => (k === i ? v : x)) })} />
            ))}
            {cfg.noms.length < 3 && (
              <button type="button" onClick={() => maj({ ...cfg, noms: [...cfg.noms, "Germany"] })}>+ 3<sup>e</sup> pays</button>
            )}
            {cfg.noms.length > 2 && (
              <button type="button" onClick={() => maj({ ...cfg, noms: cfg.noms.slice(0, 2) })}>− 3<sup>e</sup> pays</button>
            )}
          </div>
          <div className="es-cp-ligne">
            <span>Année</span>
            <select value={annee} aria-label="Année" onChange={(e) => maj({ ...cfg, annee: Number(e.target.value) })}>
              {[...eco.annees].reverse().map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="es-cp-ligne">
            <span>Comparer</span>
            {INDICS.map((i) => (
              <button key={i.id} type="button" className={cfg.indics.includes(i.id) ? "on" : ""} aria-pressed={cfg.indics.includes(i.id)} onClick={() => maj({ ...cfg, indics: cfg.indics.includes(i.id) ? cfg.indics.filter((x) => x !== i.id) : [...cfg.indics, i.id] })}>
                {i.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="es-cp-an">Année {annee}</p>
      {actives.length === 0 ? (
        <p className="es-vide">Choisissez au moins un indicateur dans « Personnaliser ».</p>
      ) : (
        <div className="es-barres">
          {actives.map((ind) => {
            const vals = cfg.noms.map((n) => lit(ind.src, n, ind.id));
            const max = Math.max(1e-9, ...vals.map((v) => (v === null ? 0 : Math.abs(v))));
            return (
              <div key={ind.id} className="es-ligne">
                <span className="es-ligne-t">{ind.label}</span>
                {vals.map((v, i) => (
                  <div key={i} className="es-barre" style={{ "--c": i } as React.CSSProperties}>
                    <i style={{ width: v ? `${Math.max(4, (Math.abs(v) / max) * 100)}%` : "0%" }} />
                    <b>{fr(cfg.noms[i])}</b>
                    <em>{v === null ? "—" : ind.f(v)}</em>
                    {i > 0 && v !== null && vals[0] !== null && multiplicateur(v, vals[0] as number) && (
                      <u>{multiplicateur(v, vals[0] as number)} que {fr(cfg.noms[0])}</u>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
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
  iso2 = {},
}: {
  widgetsInitial: string[];
  sommePib: number;
  sommePopulation: number;
  pays?: PaysCompare[];
  iso2?: Record<string, string>;
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
    () => ({
      ...Object.fromEntries(compteurs.map((c) => [c.id, c.label])),
      globe: "Mon globe",
      comparateur: "Comparer des pays",
    }),
    [compteurs],
  );
  const estLarge = (id: string) => id.startsWith("globe") || id === "comparateur";

  const defaut = useMemo<Item[]>(() => {
    const c = (widgetsInitial.length ? widgetsInitial : ["pib", "population"]).filter((id) => compteurs.some((x) => x.id === id));
    return [
      ...c.map((id) => ({ id, t: 2 as Taille, x: "m" as Texte })),
      { id: "globe", t: 6 as Taille },
      { id: "comparateur", t: 6 as Taille },
    ];
  }, [widgetsInitial, compteurs]);

  const [items, setItems] = useState<Item[]>(defaut);
  const [edition, setEdition] = useState(false);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(CLE) ?? "null") as Item[] | null;
      if (Array.isArray(s) && s.every((x) => x.id in NOMS && TAILLES.includes(x.t))) setItems(s);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Chaque changement est gardé sur l'appareil ; les compteurs choisis (quatre
     au plus) rejoignent aussi le profil. */
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
  const bascule = (id: string) => {
    if (items.some((x) => x.id === id)) maj(items.filter((x) => x.id !== id));
    else maj([...items, estLarge(id) ? { id, t: 6 } : { id, t: 2, x: "m" }]);
  };

  return (
    <div className={`es-wb${edition ? " es-wb-edition" : ""}`}>
      <div className="es-wb-barre">
        <h2 className="es-wb-t">Mon dashboard</h2>
        <button type="button" className={`es-wb-perso${edition ? " on" : ""}`} aria-pressed={edition} onClick={() => setEdition(!edition)}>
          {edition ? <Check size={15} aria-hidden="true" /> : <Settings2 size={15} aria-hidden="true" />}
          {edition ? "Terminer" : "Personnaliser"}
        </button>
      </div>

      {edition && (
        <div className="es-wb-bandeau" role="region" aria-label="Personnaliser les widgets">
          <p className="es-wb-bandeau-t"><Plus size={14} aria-hidden="true" /> Choisissez vos widgets</p>
          <div className="es-wb-chips">
            {Object.keys(NOMS).map((id) => {
              const on = items.some((x) => x.id === id);
              return (
                <button key={id} type="button" className={on ? "on" : ""} aria-pressed={on} onClick={() => bascule(id)}>
                  {on && <Check size={12} aria-hidden="true" />}
                  {NOMS[id]}
                </button>
              );
            })}
          </div>
          <p className="es-wb-aide">Glissez une carte par sa poignée pour la déplacer. Réglez sa largeur et la taille de son texte depuis son en-tête.</p>
        </div>
      )}

      <div className="es-wb-grille">
        {items.map((it) => {
          const c = compteurs.find((x) => x.id === it.id);
          const x = it.x ?? "m";
          return (
            <article
              key={it.id}
              className={`es-w es-w-${it.t}${edition ? " es-w-edit" : ""}${glisse === it.id ? " es-w-glisse" : ""}${survol === it.id && glisse !== it.id ? " es-w-cible" : ""}`}
              draggable={edition}
              onDragStart={(e) => { if (!edition) return; setGlisse(it.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", it.id); }}
              onDragOver={(e) => { if (!edition) return; e.preventDefault(); setSurvol(it.id); }}
              onDragLeave={() => setSurvol((s) => (s === it.id ? null : s))}
              onDrop={(e) => { if (!edition) return; e.preventDefault(); if (glisse) deplace(glisse, it.id); setGlisse(null); setSurvol(null); }}
              onDragEnd={() => { setGlisse(null); setSurvol(null); }}
            >
              <header className="es-w-t">
                {edition && <span className="es-w-poignee" aria-hidden="true"><GripVertical size={16} /></span>}
                <h4>{NOMS[it.id]}</h4>
                {c?.exemple && <span className="es-w-ex">exemple</span>}
                {edition && (
                  <div className="es-w-reglages">
                    {!estLarge(it.id) && (
                      <div className="es-seg" role="group" aria-label="Largeur">
                        {TAILLES.slice(0, 2).map((t) => (
                          <button key={t} type="button" className={it.t === t ? "on" : ""} aria-pressed={it.t === t} onClick={() => maj(items.map((y) => (y.id === it.id ? { ...y, t } : y)))}>
                            {NOM_TAILLE[t]}
                          </button>
                        ))}
                      </div>
                    )}
                    {c && (
                      <div className="es-seg" role="group" aria-label="Taille du texte">
                        {TEXTES.map((t) => (
                          <button key={t} type="button" className={x === t ? "on" : ""} aria-pressed={x === t} aria-label={`Texte ${t === "s" ? "petit" : t === "m" ? "moyen" : "gros"}`} onClick={() => maj(items.map((y) => (y.id === it.id ? { ...y, x: t } : y)))}>
                            <span style={{ fontSize: t === "s" ? 11 : t === "m" ? 13.5 : 16 }}>A</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <button type="button" className="es-w-b" aria-label={`Retirer ${NOMS[it.id]}`} onClick={() => maj(items.filter((y) => y.id !== it.id))}>
                      <X size={15} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </header>
              <div className="es-w-c">
                {c && (
                  <div className={`es-w-cpt es-x-${x}`}>
                    <Odometre className="es-w-v" valeur={c.base} parSeconde={c.parSeconde} depuis={depart} dec={c.dec} unite={c.unite} />
                    <p>Depuis le 1<sup>er</sup> janvier</p>
                  </div>
                )}
                {it.id === "globe" && <GlobePerso edition={edition} />}
                {it.id === "comparateur" && <Comparateur edition={edition} iso2={iso2} />}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
