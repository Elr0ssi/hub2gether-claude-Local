"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "./Theme";
import type { CountryDemographyData, DemographyMetricId, DemographyYear } from "@/data/demographie/demographie";
import { SOURCES_SOCLE_DEMO } from "@/data/demographie/demographie";
import type { PaletteGlobe } from "@/components/map/DemographyGlobe";
import { getMaxMetricValueDemo, getValueIntensityDemo } from "@/lib/demographyColors";
import { Odometre } from "./Roulement";

const AN_SECONDES = 365.2425 * 24 * 3600;

/** Le temps écoulé depuis une date, ramené sur l'horloge des animations. */
function origine(depuisMs: number) {
  return performance.now() - (Date.now() - depuisMs);
}

/** Un nombre, en français, sans décimale superflue. */
function nb(v: number, d = 0) {
  return v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
}

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

/* Le plafond de l'échelle vient du repère « pour 100 000 habitants » quand
   il est actif, jamais du paramètre `max` que le globe passe lui-même — ce
   dernier ignore ce repère puisqu'il ne connaît que la grandeur brute. */
function palette(sombre: boolean, pour100k: boolean): PaletteGlobe {
  const sans = sombre ? SANS : SANS_JOUR;
  const rampe = sombre ? BLEUS : BLEUS_JOUR;
  return sombre
    ? {
        oceanProfond: "#050b16",
        oceanMoyen: "#081426",
        oceanPlateau: "#0b1c33",
        terreSansDonnee: sans,
        frontiere: "rgba(150,190,240,0.34)",
        graticule: "rgba(140,185,245,0.09)",
        accent: "#9EC7D8",
        remplissage: (nom, countries, _max, metric) => {
          const max = getMaxMetricValueDemo(countries, metric, pour100k);
          const t = getValueIntensityDemo(nom, countries, max, metric, pour100k);
          if (t === null) return sans;
          return rampe[Math.round(Math.max(0, Math.min(1, t)) * (rampe.length - 1))];
        },
      }
    : {
        oceanProfond: "#cfdced",
        oceanMoyen: "#dce7f3",
        oceanPlateau: "#e6eef7",
        terreSansDonnee: sans,
        frontiere: "rgba(30,60,100,0.3)",
        graticule: "rgba(40,80,130,0.1)",
        accent: "#2f6f8a",
        remplissage: (nom, countries, _max, metric) => {
          const max = getMaxMetricValueDemo(countries, metric, pour100k);
          const t = getValueIntensityDemo(nom, countries, max, metric, pour100k);
          if (t === null) return sans;
          return rampe[Math.round(Math.max(0, Math.min(1, t)) * (rampe.length - 1))];
        },
      };
}

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
    membres: [
      { id: "birth_rate", label: "Natalité", unite: "pour1000" },
      { id: "births_annual", label: "Naissances", unite: "hab" },
    ],
  },
  {
    id: "mortalite",
    label: "Mortalité",
    membres: [
      { id: "deaths_annual", label: "Décès", unite: "hab" },
      { id: "cancer_annual", label: "Cancer", unite: "hab" },
      { id: "suicide_annual", label: "Suicides", unite: "hab" },
      { id: "homicide_annual", label: "Homicides", unite: "hab" },
      { id: "road_annual", label: "Accidents de la route", unite: "hab" },
      { id: "diabetes_annual", label: "Diabète", unite: "hab" },
      { id: "maternal_annual", label: "Mortalité maternelle", unite: "hab" },
    ],
  },
];

export const TOUTES = FAMILLES.flatMap((f) => f.membres);

/* Les grandeurs qui sont un effectif annuel — pas un taux — acceptent un
   compteur en direct sur le dernier pas : ce qu'annonce l'année en cours
   n'est pas mesuré à la seconde, c'est cette valeur annuelle étalée depuis
   le premier janvier. Exactement la règle du PIB sur la page Économie. */
const COMPTEUR_POSSIBLE = new Set<DemographyMetricId>([
  "births_annual",
  "deaths_annual",
  "cancer_annual",
  "suicide_annual",
  "homicide_annual",
  "road_annual",
  "diabetes_annual",
  "maternal_annual",
]);
export function compteurPossibleDemo(id: DemographyMetricId): boolean {
  return COMPTEUR_POSSIBLE.has(id);
}

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
  /**
   * Vrai quand l'année affichée est la dernière du socle : les effectifs
   * annuels (naissances, décès, chaque cause) y acceptent alors un compteur
   * en direct, sur toutes leurs tuiles — pas seulement celle du moment —
   * plutôt qu'une mesure figée. Ce n'est jamais le cas pour un taux ou pour
   * la population, qui restent des valeurs posées.
   */
  enDirect: boolean;
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
  enDirect,
}: Props) {
  const fiche: CountryDemographyData | undefined = choisi ? annee.countries[choisi] : undefined;
  const famille = familleDe(metrique.id);
  /* Le repère « pour 100 000 habitants » : seule la famille Mortalité le
     propose, un effectif s'y compare mal d'un pays à l'autre sans lui. */
  const [pour100k, setPour100k] = useState(false);
  useEffect(() => {
    if (famille.id !== "mortalite") setPour100k(false);
  }, [famille.id]);

  /** La valeur d'une grandeur, ramenée pour 100 000 habitants si demandé. */
  const versUnite = useCallback(
    (v: number | null | undefined, population = fiche?.population): number | null => {
      if (v === null || v === undefined || !Number.isFinite(v)) return null;
      if (!pour100k) return v;
      if (!population) return null;
      return (v / population) * 100000;
    },
    [pour100k, fiche],
  );

  const rang = useMemo(() => {
    const val = (d: CountryDemographyData) => versUnite(d[metrique.id] ?? null, d.population);
    const v = fiche ? val(fiche) : null;
    if (v === null) return null;
    let mieux = 0;
    let total = 0;
    for (const d of Object.values(annee.countries)) {
      const w = val(d);
      if (w === null) continue;
      total += 1;
      if (w > v) mieux += 1;
    }
    return { rang: mieux + 1, total };
  }, [fiche, annee, metrique, versUnite]);

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

  /** Comme pieceDemo, mais ramenée pour 100 000 habitants quand ce repère
      est actif — les taux (pour1000) n'ont pas ce repère, il ne vaut que
      pour les effectifs annuels de la famille Mortalité. */
  const piece = useCallback(
    (brut: number | null | undefined, unite: MetriqueDemo["unite"]) => {
      if (!pour100k || unite !== "hab") return pieceDemo(brut, unite);
      const v = versUnite(brut);
      if (v === null) return { v: null, dec: 0, unite: "" };
      return { v, dec: v < 10 ? 2 : 1, unite: "" };
    },
    [pour100k, versUnite],
  );

  /* Un effectif annuel, sur le dernier pas, tourne en direct depuis le
     premier janvier — vedette et voisines pareillement, plutôt que la
     seule tuile du moment. */
  const infosTuile = useCallback(
    (m: MetriqueDemo, brut: number | undefined) => {
      const eligible = enDirect && compteurPossibleDemo(m.id) && brut !== undefined;
      if (eligible && (!pour100k || fiche?.population)) {
        const parSeconde =
          pour100k && fiche?.population ? ((brut as number) / AN_SECONDES) * (100000 / fiche.population) : (brut as number) / AN_SECONDES;
        return { live: true as const, parSeconde, dec: pour100k ? 2 : 0 };
      }
      return { live: false as const, piece: piece(brut, m.unite) };
    },
    [enDirect, pour100k, fiche, piece],
  );

  const infoVedette = infosTuile(metrique, fiche?.[metrique.id]);
  const depuisAnnee = origine(Date.UTC(annee.year, 0, 1));

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
              key={`${theme}-${pour100k}`}
              palette={palette(!jour, pour100k)}
              marge={1.06}
              onCadrage={mesureLimbe}
              /* Pas de plafond de texels : un plafond bas ne montrait plus
                 rien qu'un aplat flou une fois zoomé, le zoom concentrant
                 une tranche étroite de la toile sur toute la scène. La
                 machine décide comme sur le reste du site. */
            />
            <span className="ge-eclat" aria-hidden="true" />
            <span className="ge-eclat ge-eclat-2" aria-hidden="true" />
            <div className="ge-echelle" aria-hidden="true">
              <span
                className="ge-echelle-barre"
                style={{ background: `linear-gradient(90deg, ${(jour ? BLEUS_JOUR : BLEUS).join(", ")})` }}
              />
              <span className="ge-echelle-l">
                {metrique.label}
                {pour100k ? " /100k" : ""} · faible à élevé
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
                <div className="ge-tete-fiche">
                  <h3 className="ge-nom">{nomFr(choisi)}</h3>
                  {famille.id === "mortalite" && (
                    <div className="ge-unites" role="tablist" aria-label="Unité affichée">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={!pour100k}
                        className={`ge-unite${!pour100k ? " ge-unite-on" : ""}`}
                        onClick={() => setPour100k(false)}
                      >
                        Montant
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={pour100k}
                        className={`ge-unite${pour100k ? " ge-unite-on" : ""}`}
                        onClick={() => setPour100k(true)}
                      >
                        /100 000 hab.
                      </button>
                    </div>
                  )}
                </div>

                <div className="ge-vedette">
                  <span className="ge-vedette-l">
                    {infoVedette.live ? `${metrique.label} depuis le 1er janvier` : metrique.label}
                  </span>
                  {infoVedette.live ? (
                    <>
                      <Odometre
                        className="ge-vedette-v"
                        valeur={0}
                        parSeconde={infoVedette.parSeconde}
                        depuis={depuisAnnee}
                        dec={infoVedette.dec}
                        unite=""
                      />
                      <span className="ge-vedette-r">
                        sur {nb(versUnite(fiche[metrique.id]) ?? 0, infoVedette.dec)} en {annee.year}
                      </span>
                    </>
                  ) : (
                    <>
                      <Odometre
                        className="ge-vedette-v"
                        valeur={infoVedette.piece.v}
                        dec={infoVedette.piece.dec}
                        unite={infoVedette.piece.unite}
                        duree={950}
                        tours={1}
                      />
                      {rang && (
                        <span className="ge-vedette-r">
                          {rang.rang}
                          <sup>e</sup> sur {rang.total}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="ge-autres">
                  {famille.membres
                    .filter((m) => m.id !== metrique.id)
                    .map((m) => {
                      const info = infosTuile(m, fiche[m.id]);
                      return (
                        <button key={m.id} type="button" className="ge-autre" onClick={() => onMetrique(m.id)}>
                          <span className="ge-autre-l">{m.label}</span>
                          {info.live ? (
                            <Odometre
                              className="ge-autre-v"
                              valeur={0}
                              parSeconde={info.parSeconde}
                              depuis={depuisAnnee}
                              dec={info.dec}
                              unite=""
                            />
                          ) : (
                            <Odometre
                              className="ge-autre-v"
                              valeur={info.piece.v}
                              dec={info.piece.dec}
                              unite={info.piece.unite}
                              duree={950}
                              tours={1}
                            />
                          )}
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

                <p className="ge-source">
                  {SOURCES_SOCLE_DEMO[metrique.id]?.source ?? "Nations Unies, World Population Prospects 2024"} ·{" "}
                  {annee.year}
                </p>
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
