"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "./Theme";
import type { CountryDemographyData, DemographyMetricId, DemographyYear } from "@/data/demographie/demographie";
import type { PaletteGlobe } from "@/components/map/DemographyGlobe";
import { getValueIntensityDemo } from "@/lib/demographyColors";
import { Odometre } from "./Roulement";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE DÉMOGRAPHIE DU PROTOTYPE

   Le pendant exact de GlobeEco.tsx — mêmes onglets de famille, même fiche
   pays, même courbe d'évolution à deux repères — posé sur DemographyGlobe
   plutôt que sur EconomyGlobe, puisque les métriques et le format des pays
   diffèrent. Pas de globe canvas retracé sommet par sommet, pas de vitrine
   qui tourne toute seule sans qu'on puisse cliquer un pays : le même globe
   peint sur texture que la page Économie, avec sa propre interactivité.
   ═══════════════════════════════════════════════════════════════════════════ */

const DemographyGlobe = dynamic(
  () => import("@/components/map/DemographyGlobe").then((m) => m.DemographyGlobe),
  { ssr: false, loading: () => <div className="ge-attente" /> },
);

const BLEUS = [
  "#123a72", "#174a91", "#1c5cab", "#256abf", "#2f7ad2",
  "#4a92e0", "#6da7ec", "#93c0f2", "#c0dcf8",
];
const SANS = "#1d2531";

const BLEUS_JOUR = [
  "#dbe9fa", "#bcd7f4", "#9cc3ec", "#7cade3", "#5e96d6",
  "#437cc4", "#2f63ad", "#204c92", "#153873",
];
const SANS_JOUR = "#d9d6cf";

const PALETTE: PaletteGlobe = {
  oceanProfond: "#050b16",
  oceanMoyen: "#081426",
  oceanPlateau: "#0b1c33",
  terreSansDonnee: SANS,
  frontiere: "rgba(150,190,240,0.34)",
  graticule: "rgba(140,185,245,0.09)",
  accent: "#9EC7D8",
  remplissage: (nom, countries, max, metric) => {
    const t = getValueIntensityDemo(nom, countries, max, metric);
    if (t === null) return SANS;
    return BLEUS[Math.round(Math.max(0, Math.min(1, t)) * (BLEUS.length - 1))];
  },
};

const PALETTE_JOUR: PaletteGlobe = {
  oceanProfond: "#cfdced",
  oceanMoyen: "#dce7f3",
  oceanPlateau: "#e6eef7",
  terreSansDonnee: SANS_JOUR,
  frontiere: "rgba(30,60,100,0.3)",
  graticule: "rgba(40,80,130,0.1)",
  accent: "#2f6f8a",
  remplissage: (nom, countries, max, metric) => {
    const t = getValueIntensityDemo(nom, countries, max, metric);
    if (t === null) return SANS_JOUR;
    return BLEUS_JOUR[Math.round(Math.max(0, Math.min(1, t)) * (BLEUS_JOUR.length - 1))];
  },
};

export interface MetriqueDemo {
  id: DemographyMetricId;
  label: string;
  unite: "hab" | "pour1000";
}

export interface FamilleDemo {
  id: string;
  label: string;
  membres: MetriqueDemo[];
}

export const FAMILLES: FamilleDemo[] = [
  {
    id: "population",
    label: "Population",
    membres: [
      { id: "population", label: "Population", unite: "hab" },
      { id: "natural_change", label: "Accroissement", unite: "hab" },
      { id: "net_migration", label: "Solde migratoire", unite: "hab" },
    ],
  },
  {
    id: "natalite",
    label: "Natalité",
    membres: [{ id: "birth_rate", label: "Natalité", unite: "pour1000" }],
  },
  {
    id: "mortalite",
    label: "Mortalité",
    membres: [{ id: "death_rate", label: "Mortalité", unite: "pour1000" }],
  },
];

export const TOUTES = FAMILLES.flatMap((f) => f.membres);

export function familleDe(id: DemographyMetricId): FamilleDemo {
  return FAMILLES.find((f) => f.membres.some((m) => m.id === id)) ?? FAMILLES[0];
}

export function fmtDemo(v: number | null | undefined, unite: MetriqueDemo["unite"]): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "n.d.";
  if (unite === "pour1000") return `${v.toFixed(1).replace(".", ",")} ‰`;
  const a = Math.abs(v);
  if (a >= 1e6) return `${(v / 1e6).toFixed(2).replace(".", ",")} M`;
  if (a >= 1e3) return `${(v / 1e3).toFixed(1).replace(".", ",")} k`;
  return Math.round(v).toLocaleString("fr-FR");
}

/** La même mise en forme, découpée pour l'odomètre. */
export function pieceDemo(
  v: number | null | undefined,
  unite: MetriqueDemo["unite"],
): { v: number | null; dec: number; unite: string } {
  if (v === null || v === undefined || !Number.isFinite(v)) return { v: null, dec: 0, unite: "" };
  if (unite === "pour1000") return { v, dec: 1, unite: " ‰" };
  const a = Math.abs(v);
  if (a >= 1e6) return { v: v / 1e6, dec: 2, unite: " M" };
  if (a >= 1e3) return { v: v / 1e3, dec: 1, unite: " k" };
  return { v, dec: 0, unite: "" };
}

interface Props {
  annee: DemographyYear;
  metrique: MetriqueDemo;
  onMetrique: (id: DemographyMetricId) => void;
  choisi: string | null;
  onChoisi: (nom: string | null) => void;
  nomFr: (nom: string) => string;
  serie: { annee: number; v: number | null }[];
  sousLeGlobe?: React.ReactNode;
}

export function GlobeDemographie({
  annee,
  metrique,
  onMetrique,
  choisi,
  onChoisi,
  nomFr,
  serie,
  sousLeGlobe,
}: Props) {
  const fiche: CountryDemographyData | undefined = choisi ? annee.countries[choisi] : undefined;
  const famille = familleDe(metrique.id);

  const rang = useMemo(() => {
    const v = fiche?.[metrique.id];
    if (v === undefined || !Number.isFinite(v)) return null;
    let mieux = 0;
    let total = 0;
    for (const d of Object.values(annee.countries)) {
      const w = d[metrique.id];
      if (w === undefined || !Number.isFinite(w)) continue;
      total += 1;
      if (w > v) mieux += 1;
    }
    return { rang: mieux + 1, total };
  }, [fiche, annee, metrique]);

  const courbe = useMemo(() => {
    const pts = serie.filter((p) => p.v !== null) as { annee: number; v: number }[];
    if (pts.length < 2) return null;
    const bas = Math.min(...pts.map((p) => p.v));
    const haut = Math.max(...pts.map((p) => p.v));
    const ampl = haut - bas || 1;
    const x = (a: number) => {
      const i = serie.findIndex((p) => p.annee === a);
      return (i / Math.max(1, serie.length - 1)) * 100;
    };
    const y = (v: number) => 30 - ((v - bas) / ampl) * 26;
    const marques = pts.map((p) => ({ ...p, x: x(p.annee), y: y(p.v) }));
    const d = marques
      .map((p, k) => `${k === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");
    return { d, marques, debut: marques[0], fin: marques[marques.length - 1] };
  }, [serie]);

  const [survol, setSurvol] = useState<number | null>(null);
  const [theme] = useTheme();
  const jour = theme === "clair";

  const cadre = useRef<HTMLDivElement>(null);

  const scene = useRef<HTMLDivElement>(null);
  const mesureLimbe = useCallback((diametre: number) => {
    const el = scene.current;
    if (!el) return;
    el.style.setProperty("--ge-d", `${Math.round(diametre)}px`);
    const cote = Math.min(el.clientWidth, el.clientHeight);
    const sortie = cote ? (diametre - cote) / (cote * 0.35) : 0;
    el.style.setProperty("--ge-eclat-o", String(Math.max(0, Math.min(1, 1 - sortie))));
  }, []);
  const vise = useCallback(
    (clientX: number) => {
      const el = cadre.current;
      if (!el || !courbe) return;
      const r = el.getBoundingClientRect();
      const t = Math.max(0, Math.min(100, ((clientX - r.left) / (r.width || 1)) * 100));
      let best = 0;
      let d = Infinity;
      courbe.marques.forEach((p, i) => {
        const e = Math.abs(p.x - t);
        if (e < d) {
          d = e;
          best = i;
        }
      });
      setSurvol(best);
    },
    [courbe],
  );
  const lu = survol !== null && courbe ? courbe.marques[survol] : null;

  const [bornes, setBornes] = useState<number[]>([]);
  const pose = useCallback((i: number) => {
    setBornes((b) => (b.length >= 2 ? [i] : b.length === 1 && b[0] === i ? [] : [...b, i].sort((x, y) => x - y)));
  }, []);
  useEffect(() => setBornes([]), [choisi, metrique.id]);

  const ecart = useMemo(() => {
    if (!courbe || bornes.length < 2) return null;
    const a = courbe.marques[bornes[0]];
    const b = courbe.marques[bornes[1]];
    if (!a || !b || a.v === 0) return null;
    const r = b.v / a.v;
    const memeSigne = a.v > 0 === b.v > 0;
    const pct = ((b.v - a.v) / Math.abs(a.v)) * 100;
    return {
      a,
      b,
      texte: !memeSigne
        ? `${pct > 0 ? "+" : "−"}${Math.abs(pct).toFixed(0)} %, en changeant de signe`
        : Math.abs(r) >= 2
          ? `×${r.toFixed(1).replace(".", ",")}`
          : `${pct >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(pct < 10 && pct > -10 ? 1 : 0).replace(".", ",")} %`,
      sens: b.v > a.v ? 1 : b.v < a.v ? -1 : 0,
    };
  }, [courbe, bornes]);

  const vedette = pieceDemo(fiche?.[metrique.id], metrique.unite);

  return (
    <div className="ge">
      <div className="ge-metriques" role="tablist" aria-label="Indicateur affiché">
        {FAMILLES.map((f) => {
          const active = f.id === famille.id;
          const sous = active && metrique.id !== f.membres[0].id ? metrique.label : null;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`ge-metrique${active ? " ge-metrique-on" : ""}`}
              onClick={() => onMetrique(f.membres[0].id)}
            >
              {f.label}
              {sous && <span className="ge-metrique-sous">{sous}</span>}
            </button>
          );
        })}
      </div>

      <div className="ge-corps">
        <div className="ge-colonne">
          <div className="ge-scene" ref={scene}>
            <DemographyGlobe
              demographyYear={annee}
              metric={metrique.id}
              selectedCountry={choisi}
              onCountryClick={(n) => onChoisi(n)}
              key={theme}
              palette={jour ? PALETTE_JOUR : PALETTE}
              marge={1.06}
              onCadrage={mesureLimbe}
              texelsMax={4096}
            />
            <span className="ge-eclat" aria-hidden="true" />
            <span className="ge-eclat ge-eclat-2" aria-hidden="true" />
            <div className="ge-echelle" aria-hidden="true">
              <span
                className="ge-echelle-barre"
                style={{ background: `linear-gradient(90deg, ${(jour ? BLEUS_JOUR : BLEUS).join(", ")})` }}
              />
              <span className="ge-echelle-l">
                {metrique.label} · faible à élevé
                <i className="ge-echelle-sans" /> sans donnée
              </span>
            </div>
          </div>
          {sousLeGlobe && <div className="ge-sous">{sousLeGlobe}</div>}
        </div>

        <aside className="ge-panneau">
          <div className="ge-fiche">
            {fiche && choisi ? (
              <>
                <h3 className="ge-nom">{nomFr(choisi)}</h3>

                <div className="ge-vedette">
                  <span className="ge-vedette-l">{metrique.label}</span>
                  <Odometre
                    className="ge-vedette-v"
                    valeur={vedette.v}
                    dec={vedette.dec}
                    unite={vedette.unite}
                    duree={950}
                    tours={1}
                  />
                  {rang && (
                    <span className="ge-vedette-r">
                      {rang.rang}
                      <sup>e</sup> sur {rang.total}
                    </span>
                  )}
                </div>

                <div className="ge-autres">
                  {famille.membres
                    .filter((m) => m.id !== metrique.id)
                    .map((m) => {
                      const p = pieceDemo(fiche[m.id], m.unite);
                      return (
                        <button key={m.id} type="button" className="ge-autre" onClick={() => onMetrique(m.id)}>
                          <span className="ge-autre-l">{m.label}</span>
                          <Odometre className="ge-autre-v" valeur={p.v} dec={p.dec} unite={p.unite} duree={950} tours={1} />
                        </button>
                      );
                    })}
                </div>

                <div className="ge-evo">
                  <p className="ge-evo-t">Évolution · {metrique.label}</p>
                  {courbe ? (
                    <>
                      <div className="ge-evo-h">
                        {ecart ? (
                          <span
                            className={`ge-evo-ec${ecart.sens > 0 ? " ge-evo-ec-h" : ecart.sens < 0 ? " ge-evo-ec-b" : ""}`}
                          >
                            <b>{ecart.texte}</b>
                            {ecart.a.annee} → {ecart.b.annee}
                          </span>
                        ) : lu ? (
                          <span className="ge-evo-lu">
                            <b>{fmtDemo(lu.v, metrique.unite)}</b>
                            {lu.annee}
                          </span>
                        ) : (
                          <>
                            <span className="ge-evo-bout">
                              <b>{fmtDemo(courbe.debut.v, metrique.unite)}</b>
                              {courbe.debut.annee}
                            </span>
                            <span className="ge-evo-bout ge-evo-bout-d">
                              <b>{fmtDemo(courbe.fin.v, metrique.unite)}</b>
                              {courbe.fin.annee}
                            </span>
                          </>
                        )}
                      </div>
                      <div
                        ref={cadre}
                        className="ge-evo-c"
                        onPointerMove={(e) => vise(e.clientX)}
                        onPointerDown={(e) => {
                          e.currentTarget.setPointerCapture(e.pointerId);
                          vise(e.clientX);
                        }}
                        onClick={() => survol !== null && pose(survol)}
                        onPointerLeave={() => setSurvol(null)}
                        onPointerCancel={() => setSurvol(null)}
                      >
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
                          <path
                            d={courbe.d}
                            fill="none"
                            stroke="var(--froid)"
                            strokeWidth="1.4"
                            vectorEffect="non-scaling-stroke"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          <circle cx={courbe.debut.x} cy={courbe.debut.y} r="0.9" fill="var(--encre-3)" vectorEffect="non-scaling-stroke" />
                          <circle cx={courbe.fin.x} cy={courbe.fin.y} r="1.3" fill="var(--froid)" vectorEffect="non-scaling-stroke" />
                          {ecart && (
                            <>
                              <rect
                                x={Math.min(ecart.a.x, ecart.b.x)}
                                y="0"
                                width={Math.abs(ecart.b.x - ecart.a.x)}
                                height="30"
                                fill="rgba(158,199,216,0.1)"
                              />
                              {[ecart.a, ecart.b].map((m) => (
                                <g key={m.annee}>
                                  <line x1={m.x} y1="0" x2={m.x} y2="30" stroke="var(--froid)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                  <circle cx={m.x} cy={m.y} r="1.7" fill="var(--froid)" vectorEffect="non-scaling-stroke" />
                                </g>
                              ))}
                            </>
                          )}
                          {lu && (
                            <>
                              <line x1={lu.x} y1="0" x2={lu.x} y2="30" stroke="var(--bord)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                              <circle cx={lu.x} cy={lu.y} r="1.8" fill="var(--encre)" vectorEffect="non-scaling-stroke" />
                            </>
                          )}
                        </svg>
                      </div>
                      <p className="ge-evo-aide">
                        {bornes.length === 0
                          ? "Cliquez deux dates pour mesurer l'écart."
                          : bornes.length === 1
                            ? `${courbe.marques[bornes[0]].annee} posée. Cliquez la seconde date.`
                            : "Cliquez ailleurs pour repartir."}
                      </p>
                    </>
                  ) : (
                    <p className="ge-evo-vide">Moins de deux dates publiés pour ce pays sur cet indicateur.</p>
                  )}
                </div>

                <p className="ge-source">Nations Unies, World Population Prospects 2024 · {annee.year}</p>
              </>
            ) : (
              <p className="ge-vide">Cliquez un pays sur le globe pour ouvrir sa fiche.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
