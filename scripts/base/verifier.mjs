#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   CONTRÔLE DE LA MIGRATION

   Relit les sources d'origine, relit la base migrée, et compare valeur par
   valeur. Une valeur qui ne se retrouve pas à l'identique fait échouer le
   contrôle — c'est le seul verdict qui compte.

   Le contrôle porte sur l'égalité stricte des nombres : pas de tolérance, pas
   d'arrondi. Migrer une base n'est pas la recalculer.
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import { litteral, referentiels } from "./sources.mjs";

const RACINE = process.cwd();
const { iso } = referentiels(RACINE);
const ecarts = [];
const bilan = [];

/** Relit la base migrée d'un indicateur : ISO3 → { annee → valeur }. */
function lu(chemin) {
  const dossier = `${RACINE}/data/${chemin}`;
  const out = new Map();
  if (!fs.existsSync(dossier)) return out;
  for (const f of fs.readdirSync(dossier)) {
    if (!f.endsWith(".json")) continue;
    const d = JSON.parse(fs.readFileSync(`${dossier}/${f}`, "utf8"));
    out.set(d.country, d);
  }
  return out;
}

/** Compare une série attendue à ce que la base contient. */
function compare(nom, chemin, attendu, { autre = null } = {}) {
  const base = lu(chemin);
  let n = 0;
  const paysManquants = new Set();
  const anneesManquantes = new Set();
  for (const [iso3, serie] of attendu) {
    const f = base.get(iso3);
    if (!f) {
      paysManquants.add(iso3);
      continue;
    }
    const source = autre
      ? (f.autres_sources ?? []).find((s) => s.source.startsWith(autre))?.data ?? {}
      : f.data;
    for (const [annee, v] of Object.entries(serie)) {
      n += 1;
      const w = source[annee];
      if (w === undefined) {
        anneesManquantes.add(`${iso3}/${annee}`);
        continue;
      }
      if (w !== v) ecarts.push(`${chemin} ${iso3} ${annee} : attendu ${v}, trouvé ${w}`);
    }
  }
  bilan.push({
    nom,
    chemin: autre ? `${chemin} (source secondaire)` : chemin,
    valeurs: n,
    pays: attendu.size,
    paysManquants: [...paysManquants],
    anneesManquantes: [...anneesManquantes],
  });
}

/* ── 1. data/countries : la base ISO3 d'origine ─────────────────────────── */

const VERS = {
  pib: "economie/pib/pib-total",
  pib_par_habitant: "economie/pib/pib-par-habitant",
  balance_commerciale: "economie/pib/balance-commerciale",
  inflation: "economie/dette/inflation",
};
const attendus = new Map(Object.values(VERS).map((c) => [c, new Map()]));
for (const f of fs.readdirSync(`${RACINE}/data/countries`)) {
  if (!f.endsWith(".json")) continue;
  const d = JSON.parse(fs.readFileSync(`${RACINE}/data/countries/${f}`, "utf8"));
  for (const [ind, bloc] of Object.entries(d.indicateurs ?? {})) {
    const serie = {};
    for (const [a, v] of Object.entries(bloc.valeurs ?? {})) {
      if (v === null || v === undefined) continue;
      serie[a] = v;
    }
    if (Object.keys(serie).length) attendus.get(VERS[ind]).set(d.iso3, serie);
  }
}
for (const [ind, chemin] of Object.entries(VERS)) {
  compare(`data/countries · ${ind}`, chemin, attendus.get(chemin));
}

/* ── 2. La saisie manuelle ──────────────────────────────────────────────── */

const SAISIE = litteral("src/data/economy/economy.ts", "SAISIE_MANUELLE");
const parChamp = { debt_ratio: new Map(), unemployment: new Map(), companies: new Map(), gdp: new Map() };
for (const an of SAISIE) {
  for (const [nom, d] of Object.entries(an.countries)) {
    const c = iso(nom);
    if (!c) continue;
    for (const champ of Object.keys(parChamp)) {
      if (d[champ] === undefined) continue;
      const m = parChamp[champ];
      const s = m.get(c) ?? {};
      s[String(an.year)] = d[champ];
      m.set(c, s);
    }
  }
}
compare("economy.ts · debt_ratio", "economie/dette/dette-sur-pib", parChamp.debt_ratio);
compare("economy.ts · unemployment", "economie/emploi/taux-chomage", parChamp.unemployment);
compare("economy.ts · companies", "economie/entreprises/nombre-entreprises", parChamp.companies);
compare("economy.ts · gdp (2e source)", "economie/pib/pib-total", parChamp.gdp, { autre: "Saisie manuelle" });

/* ── 3. laborData ───────────────────────────────────────────────────────── */

const LABOR = litteral("src/data/economy/laborData.ts", "LABOR_DATA");
const actifs = new Map();
const retraite = new Map();
for (const l of LABOR) {
  const c = iso(l.name);
  if (!c) continue;
  actifs.set(c, { 2023: l.active_population_millions });
  retraite.set(c, { 2023: l.retirement_age });
}
compare("laborData · population active", "economie/emploi/population-active", actifs);
compare("laborData · âge retraite", "economie/emploi/age-retraite", retraite);

/* ── 4. debtData ────────────────────────────────────────────────────────── */

const DETTE = litteral("src/data/economy/debtData.ts", "DEBT_DATA");
const montant = new Map();
const ratio2 = new Map();
const infl2 = new Map();
for (const d of DETTE) {
  const c = iso(d.name);
  if (!c) continue;
  montant.set(c, { 2000: d.debt_2000_bn, 2014: d.debt_2014_bn, 2024: d.debt_2024_bn });
  ratio2.set(c, { 2000: d.debt_2000_pct, 2014: d.debt_2014_pct, 2024: d.debt_2024_pct });
  infl2.set(c, { 2024: d.inflation_2024 });
}
compare("debtData · montant", "economie/dette/dette-montant", montant);
compare("debtData · ratio (2e source)", "economie/dette/dette-sur-pib", ratio2, { autre: "Economy · Capital" });
compare("debtData · inflation 2024 (2e source)", "economie/dette/inflation", infl2, { autre: "Economy · Capital" });

/* ── 5. Commerce et population ──────────────────────────────────────────── */

const ANNEES = litteral("src/data/economy/populationData.ts", "ECONOMY_YEARS_LIST");
const BAL = litteral("src/data/economy/tradeBalanceHistory.ts", "TRADE_BALANCE_BY_COUNTRY");
const balHist = new Map();
for (const [nom, serie] of Object.entries(BAL)) {
  const c = iso(nom);
  if (!c) continue;
  const s = {};
  serie.forEach((v, i) => (s[String(ANNEES[i])] = v));
  balHist.set(c, s);
}
compare("tradeBalanceHistory (2e source)", "economie/pib/balance-commerciale", balHist, { autre: "FMI · OMC" });

const TRADE = litteral("src/data/economy/tradeData.ts", "TRADE_DATA");
const exp = new Map();
const imp = new Map();
for (const t of TRADE) {
  const c = iso(t.name);
  if (!c) continue;
  exp.set(c, { 2024: t.exports_bn });
  imp.set(c, { 2024: t.imports_bn });
}
compare("tradeData · exportations", "economie/pib/exportations", exp);
compare("tradeData · importations", "economie/pib/importations", imp);

const POP = litteral("src/data/economy/populationData.ts", "POPULATION_BY_COUNTRY");
const pop = new Map();
for (const [nom, serie] of Object.entries(POP)) {
  const c = iso(nom);
  if (!c) continue;
  const s = {};
  serie.forEach((v, i) => (s[String(ANNEES[i])] = v));
  pop.set(c, s);
}
compare("populationData", "demographie/population/nombre-habitants", pop);

/* ── Verdict ────────────────────────────────────────────────────────────── */

console.log("Contrôle de la migration — égalité stricte, aucune tolérance\n");
let total = 0;
let manque = 0;
for (const b of bilan) {
  total += b.valeurs;
  const trous = b.paysManquants.length + b.anneesManquantes.length;
  manque += trous;
  const etat = trous ? `⚠ ${b.paysManquants.length} pays, ${b.anneesManquantes.length} années absents` : "ok";
  console.log(`  ${b.nom.padEnd(38)} ${String(b.valeurs).padStart(6)} valeurs · ${String(b.pays).padStart(4)} pays · ${etat}`);
  if (b.paysManquants.length) console.log(`      pays : ${b.paysManquants.slice(0, 10).join(", ")}${b.paysManquants.length > 10 ? " …" : ""}`);
  if (b.anneesManquantes.length) console.log(`      années : ${b.anneesManquantes.slice(0, 10).join(", ")}${b.anneesManquantes.length > 10 ? " …" : ""}`);
}
console.log(`\n  ${total} valeurs contrôlées`);
if (ecarts.length) {
  console.log(`\n  ✗ ${ecarts.length} valeurs différentes de la source :`);
  for (const e of ecarts.slice(0, 20)) console.log(`      ${e}`);
  process.exitCode = 1;
} else {
  console.log("  ✓ aucune valeur modifiée");
}
if (manque) process.exitCode = 1;
else console.log("  ✓ aucun pays ni aucune année perdus");
