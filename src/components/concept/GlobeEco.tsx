"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "./Theme";
import type { CountryEconomyData, EconomyMetricId, EconomyYear } from "@/types";
import type { PaletteGlobe } from "@/components/map/EconomyGlobe";
import { getValueIntensity } from "@/lib/economyColors";
import { Odometre } from "./Roulement";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE ÉCONOMIE DU PROTOTYPE

   Ce n'est pas un nouveau globe : c'est celui du site, avec une autre palette.
   Le dessin passe par une texture peinte une fois puis tournée par la carte
   graphique, au lieu d'être retracé sommet par sommet à chaque image — c'est
   de là que vient la différence de fluidité.

   Autour, le langage du prototype : la légende, la frise, la fiche pays.
   ═══════════════════════════════════════════════════════════════════════════ */

const EconomyGlobe = dynamic(
  () => import("@/components/map/EconomyGlobe").then((m) => m.EconomyGlobe),
  { ssr: false, loading: () => <div className="ge-attente" /> },
);

/** La rampe bleue du prototype, du sombre au clair, en neuf pas. */
const BLEUS = [
  "#123a72", "#174a91", "#1c5cab", "#256abf", "#2f7ad2",
  "#4a92e0", "#6da7ec", "#93c0f2", "#c0dcf8",
];
const SANS = "#1d2531";

/* La même rampe, de jour : elle démarre plus clair et monte moins haut,
   sinon les pays les plus foncés font des trous noirs sur une page blanche
   et les plus clairs disparaissent dans le fond. */
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
    const t = getValueIntensity(nom, countries, max, metric);
    if (t === null) return SANS;
    return BLEUS[Math.round(Math.max(0, Math.min(1, t)) * (BLEUS.length - 1))];
  },
};

/* L'océan de jour reste un océan : il pâlit, il ne devient pas blanc. Un
   globe entièrement clair sur un fond clair n'a plus de silhouette. */
const PALETTE_JOUR: PaletteGlobe = {
  oceanProfond: "#cfdced",
  oceanMoyen: "#dce7f3",
  oceanPlateau: "#e6eef7",
  terreSansDonnee: SANS_JOUR,
  frontiere: "rgba(30,60,100,0.3)",
  graticule: "rgba(40,80,130,0.1)",
  accent: "#2f6f8a",
  remplissage: (nom, countries, max, metric) => {
    const t = getValueIntensity(nom, countries, max, metric);
    if (t === null) return SANS_JOUR;
    return BLEUS_JOUR[Math.round(Math.max(0, Math.min(1, t)) * (BLEUS_JOUR.length - 1))];
  },
};

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
  if (unite === "eur") return `${Math.round(v).toLocaleString("fr-FR")} €`;
  /* Toujours des milliards, jamais de trillions. Un PIB en T€ et une dette en
     Md€ ne se comparent pas d'un coup d'œil : il faut diviser de tête avant
     de pouvoir lire. Une seule échelle, et les deux nombres se répondent. */
  return `${Math.round(v).toLocaleString("fr-FR")} Md€`;
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
  if (unite === "eur") return { v, dec: 0, unite: "\u00a0€" };
  return { v, dec: 0, unite: "\u00a0Md€" };
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

  /* La courbe d'évolution : une valeur absente coupe le trait, elle ne le
     ramène pas à zéro. */
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
    /* Les deux bouts de la série, avec leur année : une courbe sans repère
       dit une forme, pas une histoire. On donne le départ et l'arrivée
       plutôt que le minimum et le maximum — ce qu'on veut lire, c'est le
       chemin parcouru. */
    return { d, marques, debut: marques[0], fin: marques[marques.length - 1] };
  }, [serie]);

  /* Le survol de la courbe. On ne cherche pas le point le plus proche en
     distance : on prend celui dont l'abscisse est la plus proche du doigt,
     sinon un creux profond attire le curseur alors qu'on vise une année. */
  const [survol, setSurvol] = useState<number | null>(null);
  const [theme] = useTheme();
  const jour = theme === "clair";

  const cadre = useRef<HTMLDivElement>(null);

  /* La lumière du limbe suit la caméra.

     Le diamètre apparent de la sphère change à chaque zoom ; l'anneau était
     lui dimensionné une fois pour toutes sur le cadre, et se retrouvait donc
     dessiné à l'intérieur du globe dès qu'on s'approchait. Le globe mesure
     désormais son limbe et le dépose ici, en pixels, directement dans le
     style de la scène : aucun rendu React par image.

     Passé le bord du cadre, le limbe n'est plus visible — il est hors champ.
     La lumière s'éteint alors progressivement plutôt que de venir baver sur
     les bords de la scène. */
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

  /* Deux repères posés sur la courbe donnent l'évolution entre eux. Un clic
     pose le premier, un second le referme, un troisième repart de zéro. Le
     multiple est dit plutôt que le pourcentage : « ×8,4 » se saisit d'un coup
     d'œil là où « +740 % » demande un calcul. En dessous de deux, c'est le
     pourcentage qui parle mieux, et on le donne à la place. */
  const [bornes, setBornes] = useState<number[]>([]);
  const pose = useCallback(
    (i: number) => {
      setBornes((b) => (b.length >= 2 ? [i] : b.length === 1 && b[0] === i ? [] : [...b, i].sort((x, y) => x - y)));
    },
    [],
  );
  useEffect(() => setBornes([]), [choisi, metrique.id]);

  const ecart = useMemo(() => {
    if (!courbe || bornes.length < 2) return null;
    const a = courbe.marques[bornes[0]];
    const b = courbe.marques[bornes[1]];
    if (!a || !b || a.v === 0) return null;
    const r = b.v / a.v;
    /* Un rapport n'a de sens que si les deux valeurs sont du même signe :
       passer d'un déficit à un excédent ne se multiplie pas. */
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
        <div className="ge-colonne">
          <div className="ge-scene" ref={scene}>
            <EconomyGlobe
              economyYear={annee}
              metric={metrique.id}
              selectedCountry={choisi}
              onCountryClick={(n) => onChoisi(n)}
              /* Le globe peint ses fonds de carte une fois, au montage : un
                 changement de palette après coup ne repeindrait que les
                 remplissages, pas l'océan ni le graticule. On le remonte
                 donc, ce qui ne se produit qu'au clic sur le bouton du
                 thème. */
              key={theme}
              palette={jour ? PALETTE_JOUR : PALETTE}
              /* La sphère occupe davantage son cadre : la valeur d'origine
                 laissait près d'un cinquième de vide autour d'elle. */
              marge={1.06}
              onCadrage={mesureLimbe}
              /* Ce globe tient dans une colonne de six cents pixels. Les
                 toiles de huit mille texels du fond de carte du site n'y
                 montrent rien de plus : quatre toiles de cette taille pèsent
                 cinq cents méga-octets et leur peinture tient la main du
                 navigateur plusieurs secondes à l'ouverture. */
              texelsMax={4096}
            />
            {/* L'éclat qui sort de la sphère : un anneau de lumière posé sur
                son bord, en fusion d'écran, qui respire. Il ne tourne pas avec
                le globe — c'est une lumière, pas une matière. */}
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

        {/* ── La fiche pays ──────────────────────────────────────────────── */}
        <aside className="ge-panneau">
          {/* Aucune apparition, aucun envol : quand on change de pays, le
              cadre ne bouge pas et ce sont les nombres qui tournent jusqu'à
              leur nouvelle valeur. C'est le mouvement qui dit le changement,
              pas le déplacement du bloc. */}
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
                    couleur={SENS[metrique.id]}
                  />
                  {rang && (
                    <span className="ge-vedette-r">
                      {rang.rang}
                      <sup>e</sup> sur {rang.total}
                    </span>
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

                <div className="ge-evo">
                  <p className="ge-evo-t">Évolution · {metrique.label}</p>
                  {courbe ? (
                    <>
                      {/* Le bandeau dit les deux bouts au repos, et l'année
                          survolée dès qu'on pose le doigt sur la courbe. */}
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
                            <b>{fmtEco(lu.v, metrique.unite)}</b>
                            {lu.annee}
                          </span>
                        ) : (
                          <>
                            <span className="ge-evo-bout">
                              <b>{fmtEco(courbe.debut.v, metrique.unite)}</b>
                              {courbe.debut.annee}
                            </span>
                            <span className="ge-evo-bout ge-evo-bout-d">
                              <b>{fmtEco(courbe.fin.v, metrique.unite)}</b>
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
                          <circle
                            cx={courbe.debut.x}
                            cy={courbe.debut.y}
                            r="0.9"
                            fill="var(--encre-3)"
                            vectorEffect="non-scaling-stroke"
                          />
                          <circle
                            cx={courbe.fin.x}
                            cy={courbe.fin.y}
                            r="1.3"
                            fill="var(--froid)"
                            vectorEffect="non-scaling-stroke"
                          />
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
                                  <line
                                    x1={m.x}
                                    y1="0"
                                    x2={m.x}
                                    y2="30"
                                    stroke="var(--froid)"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                  <circle
                                    cx={m.x}
                                    cy={m.y}
                                    r="1.7"
                                    fill="var(--froid)"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </g>
                              ))}
                            </>
                          )}
                          {lu && (
                            <>
                              <line
                                x1={lu.x}
                                y1="0"
                                x2={lu.x}
                                y2="30"
                                stroke="var(--bord)"
                                strokeWidth="1"
                                vectorEffect="non-scaling-stroke"
                              />
                              <circle
                                cx={lu.x}
                                cy={lu.y}
                                r="1.8"
                                fill="var(--encre)"
                                vectorEffect="non-scaling-stroke"
                              />
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
                    <p className="ge-evo-vide">
                      Moins de deux dates publiés pour ce pays sur cet indicateur.
                    </p>
                  )}
                </div>

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
