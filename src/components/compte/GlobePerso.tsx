"use client";

import { useEffect, useMemo, useState } from "react";
import type { CountryEconomyData, EconomyMetricId, EconomyYear } from "@/types";
import type { DemographyMetricId, DemographyYear } from "@/data/demographie/demographie";
import { GlobeEco, TOUTES as TOUTES_ECO } from "@/components/concept/GlobeEco";
import { GlobeDemographie, TOUTES as TOUTES_DEMO } from "@/components/concept/GlobeDemographie";
import { useSocleDemo, useSocleEco } from "./socles";
import "@/components/concept/v2eco.css";

/* Le globe de l'espace personnel : exactement celui des pages Économie et
   Démographie — même rendu, même panneau, même clic sur un pays — avec une
   seule année (la dernière publiée) et les données de la base complète. */

const CHAMPS_ECO: [EconomyMetricId, keyof CountryEconomyData][] = [
  ["gdp", "gdp"],
  ["gdp_per_capita", "gdp_per_capita"],
  ["trade_balance", "trade_balance"],
  ["debt_ratio", "debt_ratio"],
  ["debt_amount", "debt_amount"],
  ["inflation", "inflation"],
  ["unemployment", "unemployment"],
  ["active_population", "active_population"],
  ["retirement_age", "retirement_age"],
  ["companies", "companies"],
];

function GlobeEcoPerso({ metrique, onMetrique }: { metrique: EconomyMetricId; onMetrique: (id: EconomyMetricId) => void }) {
  const socle = useSocleEco();
  const [choisi, setChoisi] = useState<string | null>("France");

  const derniere = socle ? socle.annees[socle.annees.length - 1] : 0;
  const annee = useMemo<EconomyYear | null>(() => {
    if (!socle) return null;
    const place = socle.cols[derniere] ?? {};
    const countries: Record<string, CountryEconomyData> = {};
    for (const ligne of socle.lignes[derniere] ?? []) {
      const p = socle.pays[ligne[0] as number];
      const fiche: CountryEconomyData = {};
      for (const [id, champ] of CHAMPS_ECO) {
        const i = place[id];
        const x = i === undefined ? null : ligne[i];
        if (typeof x === "number" && Number.isFinite(x)) (fiche as Record<string, number>)[champ as string] = x;
      }
      countries[p.nom] = fiche;
    }
    return { year: derniere, label: String(derniere), dataNote: "", countries };
  }, [socle, derniere]);

  const serie = useMemo(() => {
    if (!socle || !choisi) return [];
    const idx = socle.pays.findIndex((p) => p.nom === choisi);
    return socle.annees.map((a) => {
      const i = (socle.cols[a] ?? {})[metrique];
      const l = idx < 0 || i === undefined ? undefined : (socle.lignes[a] ?? []).find((x) => x[0] === idx);
      const v = l ? l[i] : null;
      return { annee: a, v: typeof v === "number" && Number.isFinite(v) ? v : null };
    });
  }, [socle, choisi, metrique]);

  if (!socle || !annee) return <div className="es-globe-attente" aria-label="Chargement du globe" />;
  return (
    <GlobeEco
      annee={annee}
      metrique={TOUTES_ECO.find((m) => m.id === metrique) ?? TOUTES_ECO[0]}
      onMetrique={onMetrique}
      choisi={choisi}
      onChoisi={setChoisi}
      nomFr={(n) => socle.pays.find((p) => p.nom === n)?.fr ?? n}
      creancier={choisi ? socle.pays.find((p) => p.nom === choisi)?.creancier : undefined}
      serie={serie}
    />
  );
}

function GlobeDemoPerso({ metrique, onMetrique }: { metrique: DemographyMetricId; onMetrique: (id: DemographyMetricId) => void }) {
  const socle = useSocleDemo();
  const [choisi, setChoisi] = useState<string | null>("France");

  const derniere = socle ? socle.annees[socle.annees.length - 1] : 0;
  const annee = useMemo<DemographyYear | null>(() => {
    if (!socle) return null;
    const place = socle.cols[derniere] ?? {};
    const countries: DemographyYear["countries"] = {};
    for (const ligne of socle.lignes[derniere] ?? []) {
      const p = socle.pays[ligne[0] as number];
      const fiche: DemographyYear["countries"][string] = {};
      for (const m of TOUTES_DEMO) {
        const i = place[m.id];
        const x = i === undefined ? null : ligne[i];
        if (typeof x === "number" && Number.isFinite(x)) fiche[m.id] = x;
      }
      countries[p.nom] = fiche;
    }
    return { year: derniere, countries };
  }, [socle, derniere]);

  const serie = useMemo(() => {
    if (!socle || !choisi) return [];
    const idx = socle.pays.findIndex((p) => p.nom === choisi);
    return socle.annees.map((a) => {
      const i = (socle.cols[a] ?? {})[metrique];
      const l = idx < 0 || i === undefined ? undefined : (socle.lignes[a] ?? []).find((x) => x[0] === idx);
      const v = l ? l[i] : null;
      return { annee: a, v: typeof v === "number" && Number.isFinite(v) ? v : null };
    });
  }, [socle, choisi, metrique]);

  if (!socle || !annee) return <div className="es-globe-attente" aria-label="Chargement du globe" />;
  return (
    <GlobeDemographie
      annee={annee}
      metrique={TOUTES_DEMO.find((m) => m.id === metrique) ?? TOUTES_DEMO[0]}
      onMetrique={onMetrique}
      choisi={choisi}
      onChoisi={setChoisi}
      nomFr={(n) => socle.pays.find((p) => p.nom === n)?.fr ?? n}
      serie={serie}
      enDirect={false}
    />
  );
}

/* Ce que le globe sait montrer : tous les indicateurs économiques et démographiques du site. */
interface Choix {
  cle: string;
  src: "eco" | "demo";
  id: string;
  label: string;
}
const CATALOGUE: Choix[] = [
  ...TOUTES_ECO.map((m) => ({ cle: `eco:${m.id}`, src: "eco" as const, id: m.id as string, label: m.label })),
  ...TOUTES_DEMO.map((m) => ({ cle: `demo:${m.id}`, src: "demo" as const, id: m.id as string, label: m.label })),
];
const DEFAUT = ["eco:gdp", "eco:gdp_per_capita", "demo:population", "eco:inflation"];
const CLE_LS = "visualize-globe-perso-v3";

/** Le globe personnel : le même rendu que les pages Économie et Démographie,
    mais c'est vous qui décidez des indicateurs qu'il peut montrer, tous
    thèmes confondus. */
export function GlobePerso({ edition = false }: { edition?: boolean }) {
  const [selection, setSelection] = useState<string[]>(DEFAUT);
  const [actif, setActif] = useState<string>(DEFAUT[0]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(CLE_LS) ?? "null") as { selection?: string[]; actif?: string } | null;
      if (s?.selection?.length) {
        const ok = s.selection.filter((c) => CATALOGUE.some((x) => x.cle === c));
        if (ok.length) {
          setSelection(ok);
          setActif(s.actif && ok.includes(s.actif) ? s.actif : ok[0]);
        }
      }
    } catch {}
  }, []);
  const garde = (sel: string[], a: string) => {
    try {
      localStorage.setItem(CLE_LS, JSON.stringify({ selection: sel, actif: a }));
    } catch {}
  };

  const va = (cle: string) => {
    setActif(cle);
    garde(selection, cle);
  };
  const bascule = (cle: string) => {
    let sel = selection.includes(cle) ? selection.filter((c) => c !== cle) : [...selection, cle];
    if (sel.length === 0) sel = [cle];
    const a = sel.includes(actif) ? actif : sel[0];
    setSelection(sel);
    setActif(a);
    garde(sel, a);
  };

  const courant = CATALOGUE.find((c) => c.cle === actif) ?? CATALOGUE[0];

  return (
    <div className="es-gp">
      {edition && (
        <div className="es-gp-choix">
          <p>Choisissez les indicateurs que votre globe peut afficher</p>
          {(["eco", "demo"] as const).map((src) => (
            <div key={src} className="es-gp-groupe">
              <span>{src === "eco" ? "Économie" : "Démographie"}</span>
              {CATALOGUE.filter((c) => c.src === src).map((c) => (
                <button key={c.cle} type="button" className={selection.includes(c.cle) ? "on" : ""} aria-pressed={selection.includes(c.cle)} onClick={() => bascule(c.cle)}>
                  {c.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="es-gp-pills" role="tablist" aria-label="Indicateur affiché sur le globe">
        {selection.map((cle) => {
          const c = CATALOGUE.find((x) => x.cle === cle);
          if (!c) return null;
          return (
            <button key={cle} type="button" role="tab" aria-selected={actif === cle} className={actif === cle ? "on" : ""} onClick={() => va(cle)}>
              {c.label}
              <i>{c.src === "eco" ? "Éco" : "Démo"}</i>
            </button>
          );
        })}
      </div>

      <div className="cg-v2 cg-eco es-ge es-ge-sanstabs">
        {courant.src === "eco" ? (
          <GlobeEcoPerso metrique={courant.id as EconomyMetricId} onMetrique={(id) => va(`eco:${id}`)} />
        ) : (
          <GlobeDemoPerso metrique={courant.id as DemographyMetricId} onMetrique={(id) => va(`demo:${id}`)} />
        )}
      </div>
    </div>
  );
}
