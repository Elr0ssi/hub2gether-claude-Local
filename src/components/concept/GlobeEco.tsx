"use client";

import { ArrowUpRight } from "lucide-react";
import { slugDe } from "@/data/seo/francais";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "./Theme";
import { EvolutionCourbe } from "./EvolutionCourbe";
import { usePretGlobe } from "./ouverture";
import { monnaieCourante } from "./Monnaie";
import { fiche } from "@/data/finance/tauxChange";
import type { CountryEconomyData, EconomyMetricId, EconomyYear } from "@/types";
import { getMaxMetricValue, getValueIntensity } from "@/lib/economyColors";
import { GlobeCompact, type InfoBulle } from "@/components/explorer/GlobeCompact";
import type { Coloration, GlobeExplorerHandle } from "@/components/explorer/GlobeExplorer";
import { vueDePays } from "@/components/explorer/vues";
import { Odometre } from "./Roulement";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE ÉCONOMIE DU PROTOTYPE

   Ce n'est pas un nouveau globe : c'est celui du site, avec une autre palette.
   Le dessin passe par une texture peinte une fois puis tournée par la carte
   graphique, au lieu d'être retracé sommet par sommet à chaque image — c'est
   de là que vient la différence de fluidité.

   Autour, le langage du prototype : la légende, la frise, la fiche pays.
   ═══════════════════════════════════════════════════════════════════════════ */

/** La rampe du globe : celle de Ressources, du clair au foncé. */
const RAMPE = ["#ede9fe", "#d4c6fd", "#b39afb", "#8f6bf7", "#6a3fe0", "#43198f"];
const SANS_DONNEE = { couleur: "#8b8fa3", opacite: 0.15 };

export interface MetriqueEco {
  id: EconomyMetricId;
  label: string;
  unite: "md" | "eur" | "pct" | "hab" | "ans" | "k";
}

/* Les familles du site, telles quelles. En haut, quatre têtes de famille ;
   dans la fiche du pays, les membres de la famille en cours — et rien
   d'autre. Tout étaler faisait dix boutons qui ne disaient plus de quoi on
   parlait. */
export interface FamilleEco {
  id: string;
  label: string;
  membres: MetriqueEco[];
}

export const FAMILLES: FamilleEco[] = [
  {
    id: "pib",
    label: "PIB",
    membres: [
      { id: "gdp", label: "PIB", unite: "md" },
      { id: "gdp_per_capita", label: "PIB par habitant", unite: "eur" },
      { id: "trade_balance", label: "Balance commerciale", unite: "md" },
    ],
  },
  {
    id: "dette",
    label: "Dette",
    membres: [
      { id: "debt_ratio", label: "Dette / PIB", unite: "pct" },
      { id: "debt_amount", label: "Montant de la dette", unite: "md" },
      { id: "inflation", label: "Inflation", unite: "pct" },
    ],
  },
  {
    id: "chomage",
    label: "Chômage",
    membres: [
      { id: "unemployment", label: "Chômage", unite: "pct" },
      { id: "active_population", label: "Population active", unite: "hab" },
      { id: "retirement_age", label: "Âge de la retraite", unite: "ans" },
    ],
  },
  {
    id: "entreprises",
    label: "Entreprises",
    membres: [{ id: "companies", label: "Entreprises", unite: "k" }],
  },
];

export const TOUTES = FAMILLES.flatMap((f) => f.membres);

/* Le sens d'une variation.

   Un nombre qui monte n'est pas une bonne nouvelle par nature : un PIB qui
   croît et une dette qui croît ne se lisent pas de la même façon. La couleur
   dit le sens, pas la direction — vert quand la variation va dans le sens
   favorable, rouge quand elle va contre. La dette, son ratio, l'inflation, le
   chômage et l'âge de la retraite sont donc à l'envers des autres.

   C'est un jugement, et il s'assume : il vaut pour la lecture courante de ces
   indicateurs, pas pour tous les cas. */
export const SENS: Record<EconomyMetricId, 1 | -1> = {
  gdp: 1,
  gdp_per_capita: 1,
  trade_balance: 1,
  companies: 1,
  active_population: 1,
  debt_amount: -1,
  debt_ratio: -1,
  inflation: -1,
  unemployment: -1,
  retirement_age: -1,
};

export function familleDe(id: EconomyMetricId): FamilleEco {
  return FAMILLES.find((f) => f.membres.some((m) => m.id === id)) ?? FAMILLES[0];
}

export function fmtEco(v: number | null | undefined, unite: MetriqueEco["unite"]): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "n.d.";
  if (unite === "ans") return `${Math.round(v)} ans`;
  if (unite === "k") return `${Math.round(v).toLocaleString("fr-FR")} k`;
  if (unite === "hab") return `${v.toFixed(1).replace(".", ",")} M`;
  if (unite === "pct") return `${v.toFixed(1).replace(".", ",")} %`;
  if (unite === "eur") return `${Math.round(v).toLocaleString("fr-FR")} ${fiche(monnaieCourante()).unitaire}`;
  /* Toujours des milliards, jamais de trillions. Un PIB en T€ et une dette en
     Md $ ne se comparent pas d'un coup d'œil : il faut diviser de tête avant
     de pouvoir lire. Une seule échelle, et les deux nombres se répondent. */
  return `${Math.round(v).toLocaleString("fr-FR")} ${fiche(monnaieCourante()).suffixe}`;
}

/** La même mise en forme, mais découpée pour l'odomètre : un nombre, ses
    décimales et son unité, au lieu d'une chaîne déjà composée. */
export function pieceEco(
  v: number | null | undefined,
  unite: MetriqueEco["unite"],
): { v: number | null; dec: number; unite: string } {
  if (v === null || v === undefined || !Number.isFinite(v)) return { v: null, dec: 0, unite: "" };
  if (unite === "ans") return { v, dec: 0, unite: "\u00a0ans" };
  if (unite === "k") return { v, dec: 0, unite: "\u00a0k" };
  if (unite === "hab") return { v, dec: 1, unite: "\u00a0M" };
  if (unite === "pct") return { v, dec: 1, unite: "\u00a0%" };
  if (unite === "eur") return { v, dec: 0, unite: `\u00a0${fiche(monnaieCourante()).unitaire}` };
  return { v, dec: 0, unite: `\u00a0${fiche(monnaieCourante()).suffixe}` };
}

interface Props {
  annee: EconomyYear;
  metrique: MetriqueEco;
  onMetrique: (id: EconomyMetricId) => void;
  choisi: string | null;
  onChoisi: (nom: string | null) => void;
  nomFr: (nom: string) => string;
  /** Le créancier principal, quand la famille regardée est celle de la dette. */
  creancier?: string;
  /** La valeur de la métrique, année par année, pour la courbe d'évolution. */
  serie: { annee: number; v: number | null }[];
  sousLeGlobe?: React.ReactNode;
  /**
   * Le compteur de l'année en cours, quand l'indicateur s'y prête.
   *
   * Ce n'est pas une mesure : c'est la dernière valeur annuelle publiée,
   * ramenée à la seconde et cumulée depuis le premier janvier. Le globe, lui,
   * garde les teintes de l'année publiée — il n'existe pas de classement
   * mondial de l'année en cours.
   */
  compteur?: {
    base: number | null;
    baseAnnee: number;
    parSeconde: number;
    /** L'origine du cumul, en temps universel. */
    depuisMs: number;
  };
}

/** Le temps écoulé depuis une date, ramené sur l'horloge des animations. */
function origine(depuisMs: number) {
  return performance.now() - (Date.now() - depuisMs);
}

/** Un nombre, en français, sans décimale superflue. */
function nb(v: number, d = 0) {
  return v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function GlobeEco({
  annee,
  metrique,
  onMetrique,
  choisi,
  onChoisi,
  nomFr,
  creancier,
  serie,
  sousLeGlobe,
  compteur,
}: Props) {
  const fiche: CountryEconomyData | undefined = choisi ? annee.countries[choisi] : undefined;
  const famille = familleDe(metrique.id);

  /* Le rang se lit sur la métrique affichée. Les pays sans valeur ne comptent
     pas : ils ne sont pas derniers, ils ne sont pas classés. */
  const rang = useMemo(() => {
    const v = fiche?.[metrique.id] as number | undefined;
    if (v === undefined || !Number.isFinite(v)) return null;
    let mieux = 0;
    let total = 0;
    for (const d of Object.values(annee.countries)) {
      const w = d[metrique.id] as number | undefined;
      if (w === undefined || !Number.isFinite(w)) continue;
      total += 1;
      if (w > v) mieux += 1;
    }
    return { rang: mieux + 1, total };
  }, [fiche, annee, metrique]);

  const [theme] = useTheme();

  /* Le globe : celui de Ressources (même scène, même zoom, même infobulle), colorié sur la rampe du site.
     Il ne monte qu'une fois la colonne à portée d'écran : construire sa sphère bloque le fil principal. */
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

  const maxV = useMemo(() => getMaxMetricValue(annee.countries, metrique.id), [annee, metrique.id]);
  const colorations = useMemo<Coloration[]>(() => {
    if (!geo) return [];
    return geo.features.map((f) => {
      const nom = (f.properties as { name: string }).name;
      const t = getValueIntensity(nom, annee.countries, maxV, metrique.id);
      if (t === null) return { nom, ...SANS_DONNEE };
      return { nom, couleur: RAMPE[Math.round(Math.max(0, Math.min(1, t)) * (RAMPE.length - 1))], opacite: choisi ? (nom === choisi ? 0.92 : 0.5) : 0.82 };
    });
  }, [geo, annee, maxV, metrique.id, choisi]);
  const contours = useMemo(() => (choisi ? [choisi] : []), [choisi]);
  const vueGlobe = useMemo(() => (geo && choisi ? vueDePays(geo, [choisi]) : null), [geo, choisi]);
  const infoBulle = useCallback(
    (nom: string): InfoBulle | null => {
      const v = annee.countries[nom]?.[metrique.id] as number | undefined;
      return { titre: nomFr(nom), ligne: v === undefined || !Number.isFinite(v) ? "Indisponible" : fmtEco(v, metrique.unite) };
    },
    [annee, metrique, nomFr],
  );
  const surPays = useCallback((nom: string | null) => onChoisi(nom), [onChoisi]);

  /* Le rapport entre deux dates : « ×8,4 » se saisit d'un coup d'œil là où « +740 % » demande un calcul. */
  const ecartEco = useCallback(
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

  /* La vedette et ses voisines, découpées pour l'odomètre. */
  const vedette = pieceEco(fiche?.[metrique.id] as number | undefined, metrique.unite);

  return (
    <div className="ge">
      {/* ── Les métriques ────────────────────────────────────────────────── */}
      <div className="ge-metriques" role="tablist" aria-label="Indicateur affiché">
        {FAMILLES.map((f) => {
          const active = f.id === famille.id;
          /* La tête de famille reste allumée quand on regarde l'un de ses
             membres, et dit lequel : sinon, choisir « Inflation » dans la
             fiche éteignait « Dette » et l'on ne savait plus où l'on était. */
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
              <b>{metrique.label} · {annee.year}</b>
              <div className="gc-ech-barre">{RAMPE.map((c) => <i key={c} style={{ background: c }} />)}</div>
              <div className="gc-ech-b"><span>Faible</span><span>Élevé</span></div>
              <span className="gc-ech-nd"><i />Indisponible</span>
            </div>
          </GlobeCompact>
          {sousLeGlobe && <div className="ge-sous">{sousLeGlobe}</div>}
        </div>

        {/* ── La fiche pays ──────────────────────────────────────────────── */}
        <aside className="ge-panneau">
          {/* Aucune apparition, aucun envol : quand on change de pays, le
              cadre ne bouge pas et ce sont les nombres qui tournent jusqu'à
              leur nouvelle valeur. C'est le mouvement qui dit le changement,
              pas le déplacement du bloc. */}
          <div className="ge-fiche">
            {fiche && choisi ? (
              <>
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

                <div className="ge-vedette">
                  <span className="ge-vedette-l">
                    {compteur ? `${metrique.label} produit depuis le 1er janvier` : metrique.label}
                  </span>
                  {compteur && compteur.base !== null ? (
                    <>
                      <Odometre
                        className="ge-vedette-v"
                        valeur={0}
                        parSeconde={compteur.parSeconde}
                        depuis={origine(compteur.depuisMs)}
                        /* Quatre décimales, et c'est un choix, pas un excès
                           de précision : en milliards entiers le dernier
                           chiffre ne bougerait que toutes les trois heures,
                           et le compteur paraîtrait arrêté. À cette échelle
                           le dernier rouleau tourne de manière continue,
                           c'est-à-dire qu'il se voit avancer. */
                        dec={4}
                        unite={vedette.unite}
                        couleur={1}
                      />
                      <span className="ge-vedette-r">
                        sur {nb(compteur.base, 0)}
                        {vedette.unite} en {compteur.baseAnnee}
                      </span>
                    </>
                  ) : (
                    <>
                      <Odometre
                        className="ge-vedette-v"
                        valeur={vedette.v}
                        dec={vedette.dec}
                        unite={vedette.unite}
                        duree={950}
                        tours={1}
                        couleur={SENS[metrique.id]}
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

                {famille.id === "dette" && creancier && (
                  <p className="ge-note">Créancier principal · {creancier}</p>
                )}

                <div className="ge-autres">
                  {famille.membres
                    .filter((m) => m.id !== metrique.id)
                    .map((m) => {
                      const p = pieceEco(fiche[m.id] as number | undefined, m.unite);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          className="ge-autre"
                          onClick={() => onMetrique(m.id)}
                        >
                          <span className="ge-autre-l">{m.label}</span>
                          <Odometre
                            className="ge-autre-v"
                            valeur={p.v}
                            dec={p.dec}
                            unite={p.unite}
                            duree={950}
                            tours={1}
                            couleur={SENS[m.id]}
                          />
                        </button>
                      );
                    })}
                </div>

                <EvolutionCourbe
                  titre={metrique.label}
                  reinit={`${choisi}|${metrique.id}`}
                  points={pointsEvo}
                  format={(v) => fmtEco(v, metrique.unite)}
                  ecart={ecartEco}
                  vide="Moins de deux dates publiées pour ce pays sur cet indicateur."
                />

                <p className="ge-source">Banque mondiale (WDI) · FMI · {annee.year}</p>
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
