"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CountryEconomyData, EconomyMetricId, EconomyYear } from "@/types";
import type { PaletteGlobe } from "@/components/map/EconomyGlobe";
import { getValueIntensity } from "@/lib/economyColors";
import { LENT } from "./pieces";

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

export interface MetriqueEco {
  id: EconomyMetricId;
  label: string;
  unite: "md" | "eur" | "pct" | "hab";
}

export function fmtEco(v: number | null | undefined, unite: MetriqueEco["unite"]): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  if (unite === "hab") return `${v.toFixed(1).replace(".", ",")} M`;
  if (unite === "pct") return `${v.toFixed(1).replace(".", ",")} %`;
  if (unite === "eur") return `${Math.round(v).toLocaleString("fr-FR")} €`;
  return Math.abs(v) >= 1000
    ? `${(v / 1000).toFixed(1).replace(".", ",")} T€`
    : `${Math.round(v).toLocaleString("fr-FR")} Md€`;
}

interface Props {
  annee: EconomyYear;
  metrique: MetriqueEco;
  metriques: MetriqueEco[];
  onMetrique: (id: EconomyMetricId) => void;
  choisi: string | null;
  onChoisi: (nom: string | null) => void;
  nomFr: (nom: string) => string;
  /** La valeur de la métrique, année par année, pour la courbe d'évolution. */
  serie: { annee: number; v: number | null }[];
  sousLeGlobe?: React.ReactNode;
}

export function GlobeEco({
  annee,
  metrique,
  metriques,
  onMetrique,
  choisi,
  onChoisi,
  nomFr,
  serie,
  sousLeGlobe,
}: Props) {
  const fiche: CountryEconomyData | undefined = choisi ? annee.countries[choisi] : undefined;

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
    const d = pts
      .map((p, k) => `${k === 0 ? "M" : "L"} ${x(p.annee).toFixed(2)} ${(28 - ((p.v - bas) / ampl) * 26).toFixed(2)}`)
      .join(" ");
    return { d, bas, haut };
  }, [serie]);

  return (
    <div className="ge">
      {/* ── Les métriques ────────────────────────────────────────────────── */}
      <div className="ge-metriques" role="tablist" aria-label="Indicateur affiché">
        {metriques.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={m.id === metrique.id}
            className={`ge-metrique${m.id === metrique.id ? " ge-metrique-on" : ""}`}
            onClick={() => onMetrique(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="ge-corps">
        <div className="ge-colonne">
          <div className="ge-scene">
            <EconomyGlobe
              economyYear={annee}
              metric={metrique.id}
              selectedCountry={choisi}
              onCountryClick={(n) => onChoisi(n)}
              palette={PALETTE}
            />
            <div className="ge-echelle" aria-hidden="true">
              <span
                className="ge-echelle-barre"
                style={{ background: `linear-gradient(90deg, ${BLEUS.join(", ")})` }}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={choisi ?? "vide"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: LENT }}
            >
              {fiche && choisi ? (
                <>
                  <p className="ge-sur">{annee.year}</p>
                  <h3 className="ge-nom">{nomFr(choisi)}</h3>

                  <div className="ge-vedette">
                    <span className="ge-vedette-l">{metrique.label}</span>
                    <span className="ge-vedette-v">
                      {fmtEco(fiche[metrique.id] as number | undefined, metrique.unite)}
                    </span>
                    {rang && (
                      <span className="ge-vedette-r">
                        {rang.rang}
                        <sup>e</sup> sur {rang.total}
                      </span>
                    )}
                  </div>

                  <div className="ge-autres">
                    {metriques
                      .filter((m) => m.id !== metrique.id)
                      .map((m) => (
                        <button key={m.id} type="button" className="ge-autre" onClick={() => onMetrique(m.id)}>
                          <span className="ge-autre-l">{m.label}</span>
                          <span className="ge-autre-v">
                            {fmtEco(fiche[m.id] as number | undefined, m.unite)}
                          </span>
                        </button>
                      ))}
                  </div>

                  <div className="ge-evo">
                    <p className="ge-evo-t">Évolution · {metrique.label}</p>
                    {courbe ? (
                      <>
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
                          <path d={courbe.d} fill="none" stroke="var(--froid)" strokeWidth="1.4"
                            vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                        <p className="ge-evo-b">
                          <span>{fmtEco(courbe.bas, metrique.unite)}</span>
                          <span>{fmtEco(courbe.haut, metrique.unite)}</span>
                        </p>
                      </>
                    ) : (
                      <p className="ge-evo-vide">
                        Moins de deux millésimes publiés pour ce pays sur cet indicateur.
                      </p>
                    )}
                  </div>

                  <p className="ge-source">Banque mondiale (WDI) · FMI · {annee.year}</p>
                </>
              ) : (
                <p className="ge-vide">Cliquez un pays sur le globe pour ouvrir sa fiche.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
