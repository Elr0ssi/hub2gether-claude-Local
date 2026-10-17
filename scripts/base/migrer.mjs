#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   MIGRATION VERS LA BASE PAR CATÉGORIE

   La base prend la forme : CATÉGORIE → SOUS-CATÉGORIE → INDICATEUR → PAYS →
   ANNÉES. Un fichier par pays et par indicateur, nommé par son code ISO3.

   CE QUE CE SCRIPT NE FAIT JAMAIS
     · Il n'invente aucune valeur, n'interpole rien, ne comble aucun trou.
       Une année absente reste absente : elle n'apparaît pas dans `data`.
     · Il n'arrondit rien. La valeur écrite est celle de la source, au bit
       près.
     · Il ne fusionne pas deux sources en silence. Quand deux jeux couvrent le
       même indicateur, le premier devient `data` et les autres sont conservés
       dans `autres_sources`, avec leur propre unité et leur propre source.
       Les désaccords sont listés dans le rapport, pas tranchés ici.
     · Il ne supprime rien. Les fichiers d'origine restent en place.

   USAGE
     node scripts/base/migrer.mjs [--simulation]
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { litteral, referentiels } from "./sources.mjs";

const RACINE = process.cwd();
const SIMULATION = process.argv.includes("--simulation");
const { ref, iso } = referentiels(RACINE);

const inconnus = new Map();
function code(nom, origine) {
  const c = iso(nom);
  if (!c) {
    const l = inconnus.get(nom) ?? new Set();
    l.add(origine);
    inconnus.set(nom, l);
    return null;
  }
  return c;
}

/* ── Le registre des indicateurs ──────────────────────────────────────────
   Chaque entrée dit où l'indicateur se range et sous quelle unité. Ajouter
   un indicateur, plus tard, c'est ajouter une ligne ici. */
const REGISTRE = {
  "economie/pib/pib-total": { code: "GDP_TOTAL", unite: "USD", libelle: "PIB", historique: "pib" },
  "economie/pib/pib-par-habitant": { code: "GDP_PER_CAPITA", unite: "USD", libelle: "PIB par habitant", historique: "pib_par_habitant" },
  "economie/pib/balance-commerciale": { code: "TRADE_BALANCE", unite: "USD", libelle: "Balance extérieure des biens et services", historique: "balance_commerciale" },
  "economie/pib/exportations": { code: "EXPORTS", unite: "MD_USD", libelle: "Exportations de biens et services" },
  "economie/pib/importations": { code: "IMPORTS", unite: "MD_USD", libelle: "Importations de biens et services" },
  "economie/dette/dette-montant": { code: "DEBT_AMOUNT", unite: "MD_EUR", libelle: "Montant de la dette publique" },
  "economie/dette/dette-sur-pib": { code: "DEBT_TO_GDP", unite: "PCT", libelle: "Dette publique rapportée au PIB" },
  "economie/dette/inflation": { code: "INFLATION", unite: "PCT", libelle: "Inflation (prix à la consommation)", historique: "inflation" },
  "economie/emploi/taux-chomage": { code: "UNEMPLOYMENT", unite: "PCT", libelle: "Taux de chômage" },
  "economie/emploi/population-active": { code: "ACTIVE_POPULATION", unite: "MILLIONS_HAB", libelle: "Population active (15-64 ans)" },
  "economie/emploi/age-retraite": { code: "RETIREMENT_AGE", unite: "ANNEES", libelle: "Âge de départ à la retraite" },
  "economie/entreprises/nombre-entreprises": { code: "COMPANIES", unite: "MILLIERS", libelle: "Nombre d'entreprises enregistrées" },
  "demographie/population/nombre-habitants": { code: "POPULATION", unite: "MILLIONS_HAB", libelle: "Population" },
};

/* ── L'accumulateur ───────────────────────────────────────────────────────
   chemin → ISO3 → { data, source, autres_sources[] } */
const base = new Map();
function fiche(chemin, iso3) {
  if (!REGISTRE[chemin]) throw new Error(`indicateur hors registre : ${chemin}`);
  let m = base.get(chemin);
  if (!m) base.set(chemin, (m = new Map()));
  let f = m.get(iso3);
  if (!f) m.set(iso3, (f = { data: {}, source: null, autres: [], notes: [] }));
  return f;
}

const conflits = [];
/** Pose une valeur dans la série principale. Un désaccord est signalé, pas écrasé. */
function pose(chemin, iso3, annee, valeur, source) {
  if (valeur === null || valeur === undefined || !Number.isFinite(valeur)) return 0;
  const f = fiche(chemin, iso3);
  f.source ??= source;
  const a = String(annee);
  if (a in f.data && f.data[a] !== valeur) {
    conflits.push({ chemin, iso3, annee: a, garde: f.data[a], ignore: valeur, source });
    return 0;
  }
  f.data[a] = valeur;
  return 1;
}
/** Range une seconde source sans la mêler à la première. */
function poseAutre(chemin, iso3, annee, valeur, source, unite, note) {
  if (valeur === null || valeur === undefined || !Number.isFinite(valeur)) return 0;
  const f = fiche(chemin, iso3);
  let s = f.autres.find((x) => x.source === source && x.unit === unite);
  if (!s) f.autres.push((s = { source, unit: unite, note, data: {} }));
  s.data[String(annee)] = valeur;
  return 1;
}

const compte = {};
const ajoute = (chemin, n) => (compte[chemin] = (compte[chemin] ?? 0) + n);

/* ═══ 1. La base ISO3 déjà constituée : data/countries/<ISO3>.json ═══════ */

const VERS = {
  pib: "economie/pib/pib-total",
  pib_par_habitant: "economie/pib/pib-par-habitant",
  balance_commerciale: "economie/pib/balance-commerciale",
  inflation: "economie/dette/inflation",
};
let nPays = 0;
for (const f of fs.readdirSync(`${RACINE}/data/countries`).sort()) {
  if (!f.endsWith(".json")) continue;
  const d = JSON.parse(fs.readFileSync(`${RACINE}/data/countries/${f}`, "utf8"));
  nPays += 1;
  for (const [ind, bloc] of Object.entries(d.indicateurs ?? {})) {
    const chemin = VERS[ind];
    if (!chemin) throw new Error(`indicateur inconnu dans ${f} : ${ind}`);
    let n = 0;
    for (const [annee, v] of Object.entries(bloc.valeurs ?? {})) {
      n += pose(chemin, d.iso3, annee, v, bloc.source);
    }
    ajoute(chemin, n);
  }
}

/* ═══ 2. La saisie manuelle de economy.ts : dette/pib, chômage, entreprises
        — et le PIB qu'elle porte aussi, gardé comme seconde source ═════ */

const SAISIE = litteral("src/data/economy/economy.ts", "SAISIE_MANUELLE");
const SRC_SAISIE = "Saisie manuelle du site (Banque mondiale, FMI, OIT) · 7 dates repères";
for (const an of SAISIE) {
  for (const [nom, d] of Object.entries(an.countries)) {
    const c = code(nom, "economy.ts/SAISIE_MANUELLE");
    if (!c) continue;
    ajoute("economie/dette/dette-sur-pib", pose("economie/dette/dette-sur-pib", c, an.year, d.debt_ratio, SRC_SAISIE));
    ajoute("economie/emploi/taux-chomage", pose("economie/emploi/taux-chomage", c, an.year, d.unemployment, SRC_SAISIE));
    ajoute("economie/entreprises/nombre-entreprises", pose("economie/entreprises/nombre-entreprises", c, an.year, d.companies, SRC_SAISIE));
    /* Le PIB saisi à la main existe aussi, en milliards : la page ne s'en
       sert pas — elle lit la base — mais on ne le perd pas pour autant. */
    poseAutre("economie/pib/pib-total", c, an.year, d.gdp, SRC_SAISIE, "MD_USD");
  }
}

/* ═══ 3. laborData.ts : population active et âge de la retraite ══════════ */

const LABOR = litteral("src/data/economy/laborData.ts", "LABOR_DATA");
const SRC_LABOR = "OCDE · OIT · estimations 2023";
const NOTE_LABOR =
  "La source ne publie qu'une valeur, datée 2023. Elle est rangée sous 2023 et " +
  "non répétée sur les autres années : aucune année n'est inventée.";
for (const l of LABOR) {
  const c = code(l.name, "laborData.ts");
  if (!c) continue;
  ajoute("economie/emploi/population-active", pose("economie/emploi/population-active", c, 2023, l.active_population_millions, SRC_LABOR));
  ajoute("economie/emploi/age-retraite", pose("economie/emploi/age-retraite", c, 2023, l.retirement_age, SRC_LABOR));
  fiche("economie/emploi/population-active", c).notes = [NOTE_LABOR];
  fiche("economie/emploi/age-retraite", c).notes = [NOTE_LABOR];
}

/* ═══ 4. debtData.ts : montant de la dette, ratio, inflation 2024 ════════ */

const DETTE = litteral("src/data/economy/debtData.ts", "DEBT_DATA");
const SRC_DETTE = "Economy · Capital · PIB et dettes du monde (relevés 2000, 2014, 2024)";
for (const d of DETTE) {
  const c = code(d.name, "debtData.ts");
  if (!c) continue;
  for (const [an, champ] of [[2000, "debt_2000_bn"], [2014, "debt_2014_bn"], [2024, "debt_2024_bn"]]) {
    ajoute("economie/dette/dette-montant", pose("economie/dette/dette-montant", c, an, d[champ], SRC_DETTE));
  }
  /* Le ratio existe déjà, saisi ailleurs et sur d'autres années : on le range
     à côté plutôt que de choisir à la place de quelqu'un. */
  for (const [an, champ] of [[2000, "debt_2000_pct"], [2014, "debt_2014_pct"], [2024, "debt_2024_pct"]]) {
    poseAutre("economie/dette/dette-sur-pib", c, an, d[champ], SRC_DETTE, "PCT");
  }
  poseAutre("economie/dette/inflation", c, 2024, d.inflation_2024, SRC_DETTE, "PCT");
}

/* ═══ 5. tradeBalanceHistory.ts et tradeData.ts ══════════════════════════ */

const ANNEES_REPERE = litteral("src/data/economy/populationData.ts", "ECONOMY_YEARS_LIST");
const BALANCE = litteral("src/data/economy/tradeBalanceHistory.ts", "TRADE_BALANCE_BY_COUNTRY");
const SRC_BALANCE = "FMI · OMC · Banque mondiale · estimations sur 7 dates repères";
for (const [nom, serie] of Object.entries(BALANCE)) {
  const c = code(nom, "tradeBalanceHistory.ts");
  if (!c) continue;
  serie.forEach((v, i) => poseAutre("economie/pib/balance-commerciale", c, ANNEES_REPERE[i], v, SRC_BALANCE, "MD_USD"));
}

const TRADE = litteral("src/data/economy/tradeData.ts", "TRADE_DATA");
const SRC_TRADE = "OMC · FMI (WEO) · Banque mondiale (BOP)";
const NOTE_TRADE =
  "La source date ces valeurs « 2024/2025 » sans trancher. Elles sont rangées " +
  "sous 2024, date la plus récente que la source nomme explicitement.";
for (const t of TRADE) {
  const c = code(t.name, "tradeData.ts");
  if (!c) continue;
  ajoute("economie/pib/exportations", pose("economie/pib/exportations", c, 2024, t.exports_bn, SRC_TRADE));
  ajoute("economie/pib/importations", pose("economie/pib/importations", c, 2024, t.imports_bn, SRC_TRADE));
  poseAutre("economie/pib/balance-commerciale", c, 2024, t.balance_bn, SRC_TRADE, "MD_USD", NOTE_TRADE);
  fiche("economie/pib/exportations", c).notes = [NOTE_TRADE];
  fiche("economie/pib/importations", c).notes = [NOTE_TRADE];
}

/* ═══ 6. populationData.ts → démographie ════════════════════════════════ */

const POP = litteral("src/data/economy/populationData.ts", "POPULATION_BY_COUNTRY");
const SRC_POP = "ONU · Banque mondiale · estimations sur 7 dates repères";
for (const [nom, serie] of Object.entries(POP)) {
  const c = code(nom, "populationData.ts");
  if (!c) continue;
  let n = 0;
  serie.forEach((v, i) => (n += pose("demographie/population/nombre-habitants", c, ANNEES_REPERE[i], v, SRC_POP)));
  ajoute("demographie/population/nombre-habitants", n);
}

/* ═══ 7. Écriture ═══════════════════════════════════════════════════════ */

if (inconnus.size) {
  console.error("\nPays sans code ISO3 — la migration s'arrête plutôt que de les perdre :");
  for (const [nom, o] of inconnus) console.error(`  · ${nom}  (${[...o].join(", ")})`);
  console.error("\nComplétez la table d'alias dans scripts/base/sources.mjs.");
  process.exit(1);
}

let fichiers = 0;
let valeurs = 0;
for (const [chemin, pays] of [...base].sort()) {
  const meta = REGISTRE[chemin];
  for (const [iso3, f] of [...pays].sort()) {
    /* Les années sont écrites dans l'ordre croissant : un fichier se relit à
       l'œil, et un diff de mise à jour montre la ligne ajoutée, pas tout. */
    const data = {};
    for (const a of Object.keys(f.data).sort()) data[a] = f.data[a];
    const sortie = {
      country: iso3,
      indicator: meta.code,
      unit: meta.unite,
      source: f.source,
      name: ref[iso3]?.nom ?? null,
      iso2: ref[iso3]?.iso2 ?? null,
      data,
    };
    if (f.notes.length) sortie.notes = f.notes;
    if (f.autres.length) {
      sortie.autres_sources = f.autres.map((s) => {
        const d = {};
        for (const a of Object.keys(s.data).sort()) d[a] = s.data[a];
        const o = { source: s.source, unit: s.unit, data: d };
        if (s.note) o.note = s.note;
        return o;
      });
    }
    valeurs += Object.keys(data).length;
    fichiers += 1;
    if (!SIMULATION) {
      const dossier = path.join(RACINE, "data", chemin);
      fs.mkdirSync(dossier, { recursive: true });
      fs.writeFileSync(path.join(dossier, `${iso3}.json`), JSON.stringify(sortie, null, 2) + "\n");
    }
  }
}

/* Chaque dossier d'indicateur porte sa propre fiche : la base se décrit
   elle-même, et rien n'a besoin d'une table tenue ailleurs pour être lu. */
if (!SIMULATION) {
  for (const [chemin, pays] of base) {
    const meta = REGISTRE[chemin];
    const annees = new Set();
    const sources = new Set();
    let n = 0;
    for (const f of pays.values()) {
      for (const a of Object.keys(f.data)) annees.add(Number(a));
      if (f.source) sources.add(f.source);
      if (Object.keys(f.data).length) n += 1;
    }
    const fiche = {
      indicateur: meta.code,
      libelle: meta.libelle,
      unite: meta.unite,
      categorie: chemin.split("/").slice(0, -1).join("/"),
      chemin: `data/${chemin}`,
      sources: [...sources],
      annees: [...annees].sort((a, b) => a - b),
      paysCouverts: n,
      misAJour: new Date().toISOString().slice(0, 10),
    };
    if (meta.historique) fiche.cleHistorique = meta.historique;
    fs.writeFileSync(
      path.join(RACINE, "data", chemin, "_indicateur.json"),
      JSON.stringify(fiche, null, 2) + "\n",
    );
  }
}

console.log(SIMULATION ? "SIMULATION — rien n'a été écrit\n" : "Base écrite\n");
console.log(`  ${nPays} fiches pays lues dans data/countries`);
for (const [chemin, n] of Object.entries(compte).sort()) {
  const p = base.get(chemin)?.size ?? 0;
  console.log(`  ${chemin.padEnd(42)} ${String(p).padStart(4)} pays  ${String(n).padStart(7)} valeurs`);
}
console.log(`\n  ${fichiers} fichiers · ${valeurs} valeurs dans les séries principales`);
if (conflits.length) {
  console.log(`\n  ${conflits.length} désaccords entre sources (valeur conservée / valeur ignorée) :`);
  for (const c of conflits.slice(0, 12)) {
    console.log(`    ${c.chemin} ${c.iso3} ${c.annee} : garde ${c.garde}, ignore ${c.ignore}`);
  }
  if (conflits.length > 12) console.log(`    … et ${conflits.length - 12} autres`);
}
