"use client";

import { ArrowUpRight } from "lucide-react";
import { slugDe } from "@/data/seo/francais";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "./Theme";
import { EvolutionCourbe } from "./EvolutionCourbe";
import { usePretGlobe } from "./ouverture";
import type { CountryDemographyData, DemographyMetricId, DemographyYear } from "@/data/demographie/demographie";
import { SOURCES_SOCLE_DEMO } from "@/data/demographie/demographie";
import { GlobeCompact, type InfoBulle } from "@/components/explorer/GlobeCompact";
import type { Coloration, GlobeExplorerHandle } from "@/components/explorer/GlobeExplorer";
import { vueDePays } from "@/components/explorer/vues";
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

/** La rampe du globe : celle d'Économie et de Ressources, du clair au foncé. */
const RAMPE = ["#ede9fe", "#d4c6fd", "#b39afb", "#8f6bf7", "#6a3fe0", "#43198f"];
const SANS_DONNEE = { couleur: "#8b8fa3", opacite: 0.15 };

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
  if (unite === "pour1000") return `${v.toFixed(1).replace(".", ",")} pour 1 000`;
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

  const [theme] = useTheme();

  /* Le globe : la même scène qu'Économie et Ressources, colorié sur la même rampe. */
  const globe = useRef<GlobeExplorerHandle>(null);
  const colonne = useRef<HTMLDivElement>(null);
  const pretGlobe = usePretGlobe(colonne);
  const [geo, setGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  useEffect(() => {
    if (!pretGlobe) return;
    let vivant = true;
    fetch("/geo/ne_50m_countries.simplified.geojson").then((r) => r.json()).then((g) => vivant && setGeo(g)).catch(() => {});
    return () => { vivant = false; };
  }, [pretGlobe]);

  const maxV = useMemo(() => getMaxMetricValueDemo(annee.countries, metrique.id, pour100k), [annee, metrique.id, pour100k]);
  const colorations = useMemo<Coloration[]>(() => {
    if (!geo) return [];
    return geo.features.map((f) => {
      const nom = (f.properties as { name: string }).name;
      const t = getValueIntensityDemo(nom, annee.countries, maxV, metrique.id, pour100k);
      if (t === null) return { nom, ...SANS_DONNEE };
      return { nom, couleur: RAMPE[Math.round(Math.max(0, Math.min(1, t)) * (RAMPE.length - 1))], opacite: choisi ? (nom === choisi ? 0.92 : 0.5) : 0.82 };
    });
  }, [geo, annee, maxV, metrique.id, pour100k, choisi]);
  const contours = useMemo(() => (choisi ? [choisi] : []), [choisi]);
  const vueGlobe = useMemo(() => (geo && choisi ? vueDePays(geo, [choisi]) : null), [geo, choisi]);
  const infoBulle = useCallback(
    (nom: string): InfoBulle | null => {
      const d = annee.countries[nom];
      const v = d ? versUnite(d[metrique.id] ?? null, d.population) : null;
      return { titre: nomFr(nom), ligne: v === null ? "Indisponible" : pour100k && metrique.unite === "hab" ? `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} /100 000 hab.` : fmtDemo(v, metrique.unite) };
    },
    [annee, metrique, nomFr, pour100k, versUnite],
  );
  const surPays = useCallback((nom: string | null) => onChoisi(nom), [onChoisi]);

  /* Le rapport entre deux dates : « ×8,4 » se saisit d'un coup d'œil là où « +740 % » demande un calcul. */
  const ecartDemo = useCallback(
    (a: { annee: number; valeur: number }, b: { annee: number; valeur: number }) => {
      if (a.valeur === 0) return null;
      const r = b.valeur / a.valeur;
      const memeSigne = a.valeur > 0 === b.valeur > 0;
      const pct = ((b.valeur - a.valeur) / Math.abs(a.valeur)) * 100;
      return {
        texte: !memeSigne
          ? `${pct > 0 ? "+" : "−"}${Math.abs(pct).toFixed(0)} %, en changeant de signe`
          : Math.abs(r) >= 2
            ? `×${r.toFixed(1).replace(".", ",")}`
            : `${pct >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(pct < 10 && pct > -10 ? 1 : 0).replace(".", ",")} %`,
        detail: `${a.annee} → ${b.annee}`,
        sens: (b.valeur > a.valeur ? 1 : b.valeur < a.valeur ? -1 : 0) as 1 | -1 | 0,
      };
    },
    [],
  );
  const pointsEvo = useMemo(() => serie.map((p) => ({ annee: p.annee, valeur: p.v })), [serie]);

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
        <div className="ge-colonne" ref={colonne}>
          <GlobeCompact
            ref={globe}
            geo={pretGlobe ? geo : null}
            nuit={theme === "nuit"}
            colorations={colorations}
            contours={contours}
            vue={vueGlobe}
            infoBulle={infoBulle}
            onPays={surPays}
          >
            <div className="gc-ech" aria-hidden="true">
              <b>{metrique.label}{pour100k ? " /100k" : ""} · {annee.year}</b>
              <div className="gc-ech-barre">{RAMPE.map((c) => <i key={c} style={{ background: c }} />)}</div>
              <div className="gc-ech-b"><span>Faible</span><span>Élevé</span></div>
              <span className="gc-ech-nd"><i />Indisponible</span>
            </div>
          </GlobeCompact>
          {sousLeGlobe && <div className="ge-sous">{sousLeGlobe}</div>}
        </div>

        <aside className="ge-panneau">
          <div className="ge-fiche">
            {fiche && choisi ? (
              <>
                <div className="ge-tete-fiche">
                  <h3 className="ge-nom">
                  {/* Le nom ouvre la page du pays, dans un nouvel onglet. */}
                  <a
                    className="ge-nom-lien"
                    href={`/pays/${slugDe(nomFr(choisi))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Page du pays : ${nomFr(choisi)} (nouvel onglet)`}
                  >
                    {nomFr(choisi)}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </h3>
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

                <EvolutionCourbe
                  titre={metrique.label}
                  reinit={`${choisi}|${metrique.id}|${pour100k}`}
                  points={pointsEvo}
                  format={(v) => fmtDemo(v, metrique.unite)}
                  ecart={ecartDemo}
                  vide="Moins de deux dates publiées pour ce pays sur cet indicateur."
                />

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
