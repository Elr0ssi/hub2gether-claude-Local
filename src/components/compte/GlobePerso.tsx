"use client";

import { useMemo, useState } from "react";
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

function GlobeEcoPerso() {
  const socle = useSocleEco();
  const [metrique, setMetrique] = useState<EconomyMetricId>("gdp");
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
      onMetrique={setMetrique}
      choisi={choisi}
      onChoisi={setChoisi}
      nomFr={(n) => socle.pays.find((p) => p.nom === n)?.fr ?? n}
      creancier={choisi ? socle.pays.find((p) => p.nom === choisi)?.creancier : undefined}
      serie={serie}
    />
  );
}

function GlobeDemoPerso() {
  const socle = useSocleDemo();
  const [metrique, setMetrique] = useState<DemographyMetricId>("population");
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
      onMetrique={setMetrique}
      choisi={choisi}
      onChoisi={setChoisi}
      nomFr={(n) => socle.pays.find((p) => p.nom === n)?.fr ?? n}
      serie={serie}
      enDirect={false}
    />
  );
}

export function GlobePerso({ type }: { type: "eco" | "demo" }) {
  return (
    <div className="cg-v2 cg-eco es-ge">
      {type === "eco" ? <GlobeEcoPerso /> : <GlobeDemoPerso />}
    </div>
  );
}
